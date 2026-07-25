import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredOrder,
  setStoredOrder,
  clearStoredOrder,
  getStoredKitchenOrders,
  setStoredKitchenOrders,
  getStoredAssistanceRequests,
  setStoredAssistanceRequests,
  getStoredWaiterTables,
  setStoredWaiterTables,
  getStoredBillRequests,
  setStoredBillRequests,
  getStoredIssueReport,
  setStoredIssueReport,
  clearStoredIssueReport,
} from '../utils/storage';
import {
  INITIAL_KITCHEN_ORDERS,
  INITIAL_ASSISTANCE_REQUESTS,
  playKitchenChime,
} from '../services/kitchenService';
import {
  INITIAL_WAITER_TABLES,
  INITIAL_BILL_REQUESTS,
} from '../services/waiterService';
import {
  getStoredReceipts,
  setStoredReceipts,
  getStoredRegisterSession,
  setStoredRegisterSession,
  INITIAL_RECEIPTS
} from '../services/counterService';

const OrderContext = createContext();

const STAGE_MAP = {
  received: 0,
  preparing: 1,
  ready: 2,
  served: 3,
};

export const OrderProvider = ({ children }) => {
  const [activeOrder, setActiveOrder] = useState(() => getStoredOrder());
  
  const [kitchenOrders, setKitchenOrders] = useState(() => {
    const stored = getStoredKitchenOrders();
    return stored && Array.isArray(stored) ? stored : INITIAL_KITCHEN_ORDERS;
  });

  const [assistanceRequests, setAssistanceRequests] = useState(() => {
    const stored = getStoredAssistanceRequests();
    return stored && Array.isArray(stored) ? stored : INITIAL_ASSISTANCE_REQUESTS;
  });

  const [waiterTables, setWaiterTables] = useState(() => {
    const stored = getStoredWaiterTables();
    return stored && Array.isArray(stored) ? stored : INITIAL_WAITER_TABLES;
  });

  const [billRequests, setBillRequests] = useState(() => {
    const stored = getStoredBillRequests();
    return stored && Array.isArray(stored) ? stored : INITIAL_BILL_REQUESTS;
  });

  const [receipts, setReceipts] = useState(() => getStoredReceipts());
  const [registerSession, setRegisterSession] = useState(() => getStoredRegisterSession());
  const [issueReport, setIssueReport] = useState(() => getStoredIssueReport());

  useEffect(() => {
    if (issueReport) {
      setStoredIssueReport(issueReport);
    }
  }, [issueReport]);

  useEffect(() => {
    setStoredReceipts(receipts);
  }, [receipts]);

  useEffect(() => {
    setStoredRegisterSession(registerSession);
  }, [registerSession]);

  useEffect(() => {
    if (activeOrder) {
      setStoredOrder(activeOrder);
    }
  }, [activeOrder]);

  useEffect(() => {
    setStoredKitchenOrders(kitchenOrders);
  }, [kitchenOrders]);

  useEffect(() => {
    setStoredAssistanceRequests(assistanceRequests);
  }, [assistanceRequests]);

  useEffect(() => {
    setStoredWaiterTables(waiterTables);
  }, [waiterTables]);

  useEffect(() => {
    setStoredBillRequests(billRequests);
  }, [billRequests]);

  // Handle customer placing a new order -> add to active order & push to kitchen KDS
  const placeOrder = (orderData) => {
    const fullOrder = {
      ...orderData,
      status: 'received',
      stageIndex: 0, // 0: Received, 1: Preparing, 2: Ready, 3: Served
      createdAt: new Date().toISOString(),
      isPaid: false,
    };
    
    setActiveOrder(fullOrder);
    setStoredOrder(fullOrder);

    // Convert customer items into kitchen ticket items format
    const kitchenTicketItems = (orderData.items || []).map((item, idx) => {
      let station = 'Dosa & Tiffin Station';
      if (item.category === 'dosas') station = 'Dosa & Tiffin Station';
      else if (item.category === 'rice_biryani') station = 'Biryani & Rice Station';
      else if (item.category === 'curries') station = 'Curry & Sambar Station';
      else if (item.category === 'starters') station = 'Vada & Appetizer Station';
      else if (item.category === 'desserts' || item.category === 'beverages') station = 'Beverage & Dessert Station';

      return {
        id: `k-item-${Date.now()}-${idx}`,
        dishId: item.dishId || item.id,
        name: item.name,
        quantity: item.quantity,
        station,
        isDone: false,
        selectedOptions: item.selectedOptions || [],
        notes: item.specialInstructions || '',
      };
    });

    const newKitchenOrder = {
      orderId: orderData.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: orderData.tableNumber || '05',
      serverName: 'Table QR',
      guestCount: orderData.guestCount || 2,
      status: 'received',
      isRush: false,
      createdAt: new Date().toISOString(),
      elapsedSeconds: 0,
      specialNotes: orderData.specialNotes || '',
      items: kitchenTicketItems,
    };

    setKitchenOrders((prev) => [newKitchenOrder, ...prev]);
    
    // Update waiter floor plan table status to 'cooking'
    updateWaiterTableStatus(orderData.tableNumber || '05', 'cooking', {
      activeOrderId: newKitchenOrder.orderId,
      totalBill: orderData.totals?.grandTotal || 0,
    });

    playKitchenChime();
  };

  const updateOrderStatus = (newStatus, stageIndex) => {
    if (!activeOrder) return;
    const updatedStageIdx = stageIndex !== undefined ? stageIndex : (STAGE_MAP[newStatus] ?? activeOrder.stageIndex);
    const updated = {
      ...activeOrder,
      status: newStatus,
      stageIndex: updatedStageIdx,
    };
    setActiveOrder(updated);
    setStoredOrder(updated);

    // Also update corresponding kitchen order if exists
    setKitchenOrders((prev) =>
      prev.map((ko) =>
        ko.orderId === activeOrder.orderId
          ? { ...ko, status: newStatus }
          : ko
      )
    );
  };

  // Kitchen Staff advancing status of an order ticket in KDS
  const updateKitchenOrderStatus = (orderId, newStatus) => {
    let targetTableNo = null;

    setKitchenOrders((prev) =>
      prev.map((ko) => {
        if (ko.orderId === orderId) {
          targetTableNo = ko.tableNumber;
          // If status changes to 'ready' or 'served', mark items done
          const allItemsDone = newStatus === 'ready' || newStatus === 'served';
          const updatedItems = ko.items.map((it) => ({
            ...it,
            isDone: allItemsDone ? true : it.isDone,
          }));
          return { ...ko, status: newStatus, items: updatedItems };
        }
        return ko;
      })
    );

    // Update corresponding floor plan table status
    if (targetTableNo) {
      const tableStatus = newStatus === 'ready' ? 'ready' : newStatus === 'served' ? 'seated' : 'cooking';
      updateWaiterTableStatus(targetTableNo, tableStatus);
    }

    // Synchronize customer active order if matching
    if (activeOrder && activeOrder.orderId === orderId) {
      const stageIndex = STAGE_MAP[newStatus] ?? activeOrder.stageIndex;
      const updatedCustomerOrder = {
        ...activeOrder,
        status: newStatus,
        stageIndex,
      };
      setActiveOrder(updatedCustomerOrder);
      setStoredOrder(updatedCustomerOrder);
    }
  };

  // Waiter updating table status on floor plan
  const updateWaiterTableStatus = (tableNumber, newStatus, extraData = {}) => {
    setWaiterTables((prev) =>
      prev.map((tbl) =>
        tbl.tableNumber === tableNumber
          ? {
              ...tbl,
              status: newStatus,
              guestCount: extraData.guestCount !== undefined ? extraData.guestCount : tbl.guestCount,
              serverName: extraData.serverName || tbl.serverName,
              activeOrderId: extraData.activeOrderId !== undefined ? extraData.activeOrderId : tbl.activeOrderId,
              totalBill: extraData.totalBill !== undefined ? extraData.totalBill : tbl.totalBill,
            }
          : tbl
      )
    );
  };

  // Toggle item completed status within a ticket card
  const toggleKitchenItemDone = (orderId, itemId) => {
    setKitchenOrders((prev) =>
      prev.map((ko) => {
        if (ko.orderId === orderId) {
          const updatedItems = ko.items.map((it) =>
            it.id === itemId ? { ...it, isDone: !it.isDone } : it
          );
          
          // Auto advance to 'preparing' if cook starts ticking items in a 'received' order
          let nextStatus = ko.status;
          if (ko.status === 'received' && updatedItems.some((it) => it.isDone)) {
            nextStatus = 'preparing';
          }

          return { ...ko, items: updatedItems, status: nextStatus };
        }
        return ko;
      })
    );
  };

  // Toggle Rush / Urgent status for a ticket
  const toggleRushOrder = (orderId) => {
    setKitchenOrders((prev) =>
      prev.map((ko) =>
        ko.orderId === orderId ? { ...ko, isRush: !ko.isRush } : ko
      )
    );
  };

  // Customer table assistance call log
  const addAssistanceRequest = (tableNumber, requestType) => {
    const newReq = {
      id: `req-${Date.now()}`,
      tableNumber,
      requestType,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setAssistanceRequests((prev) => [newReq, ...prev]);
    updateWaiterTableStatus(tableNumber, 'call_waiter');
    playKitchenChime();
  };

  const resolveAssistanceRequest = (requestId) => {
    let resolvedTableNo = null;

    setAssistanceRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          resolvedTableNo = req.tableNumber;
          return { ...req, status: 'resolved' };
        }
        return req;
      })
    );

    if (resolvedTableNo) {
      updateWaiterTableStatus(resolvedTableNo, 'seated');
    }
  };

  // Bill Settlement Handlers
  const addBillRequest = (tableNumber, billData = {}) => {
    const newBill = {
      id: `bill-${Date.now()}`,
      tableNumber,
      guestCount: billData.guestCount || 2,
      serverName: billData.serverName || 'Elena Vance',
      subtotal: billData.subtotal || 42.00,
      tax: billData.tax || 2.10,
      vat: billData.vat || 3.36,
      grandTotal: billData.grandTotal || 47.46,
      paymentMethod: billData.paymentMethod || 'Credit Card / Contactless',
      splitRequested: billData.splitRequested || false,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    setBillRequests((prev) => [newBill, ...prev]);
    updateWaiterTableStatus(tableNumber, 'bill_requested');
  };

  const settleBillRequest = (billId, tableNumber) => {
    setBillRequests((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'settled' } : b))
    );
    // Mark table available after settlement
    updateWaiterTableStatus(tableNumber, 'available', {
      guestCount: 0,
      activeOrderId: null,
      totalBill: 0,
      serverName: 'Unassigned',
    });
  };

  const processCounterPayment = (paymentData) => {
    const newReceiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    
    const newReceipt = {
      receiptNo: newReceiptNo,
      orderId: paymentData.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber: paymentData.tableNumber || "Quick Counter",
      serverName: paymentData.serverName || "Marco Rossi",
      cashierName: paymentData.cashierName || registerSession.cashierName || "Marco Rossi",
      timestamp,
      paymentMethod: paymentData.paymentMethod || "Credit Card",
      cardBrand: paymentData.cardBrand,
      referenceNo: paymentData.referenceNo,
      tenderedAmount: paymentData.tenderedAmount,
      changeGiven: paymentData.changeGiven,
      subtotal: paymentData.subtotal || 0,
      tax: paymentData.tax || 0,
      vat: paymentData.vat || 0,
      discount: paymentData.discount || 0,
      tip: paymentData.tip || 0,
      grandTotal: paymentData.grandTotal || 0,
      status: "paid",
      items: paymentData.items || []
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    // Update cash register sales balance
    setRegisterSession((prev) => {
      let cashInc = 0;
      let cardInc = 0;
      let upiInc = 0;
      if (paymentData.paymentMethod === 'Cash') cashInc = paymentData.grandTotal;
      else if (paymentData.paymentMethod.includes('Card') || paymentData.paymentMethod.includes('Credit')) cardInc = paymentData.grandTotal;
      else upiInc = paymentData.grandTotal;

      return {
        ...prev,
        cashCollected: prev.cashCollected + cashInc,
        cardCollected: prev.cardCollected + cardInc,
        upiCollected: prev.upiCollected + upiInc,
      };
    });

    // If bill request existed for this table/order, mark settled
    if (paymentData.billId) {
      settleBillRequest(paymentData.billId, paymentData.tableNumber);
    } else if (paymentData.tableNumber && paymentData.tableNumber !== "Quick Counter") {
      updateWaiterTableStatus(paymentData.tableNumber, 'available', {
        guestCount: 0,
        activeOrderId: null,
        totalBill: 0,
        serverName: 'Unassigned',
      });
    }

    return newReceipt;
  };

  const toggleRegisterDrawer = (openState) => {
    setRegisterSession((prev) => ({
      ...prev,
      isDrawerOpen: openState !== undefined ? openState : !prev.isDrawerOpen
    }));
  };

  const voidOrRefundReceipt = (receiptNo) => {
    setReceipts((prev) =>
      prev.map((r) => (r.receiptNo === receiptNo ? { ...r, status: "refunded" } : r))
    );
  };

  const resetKitchenDemoData = () => {
    setKitchenOrders(INITIAL_KITCHEN_ORDERS);
    setAssistanceRequests(INITIAL_ASSISTANCE_REQUESTS);
    setWaiterTables(INITIAL_WAITER_TABLES);
    setBillRequests(INITIAL_BILL_REQUESTS);
    setReceipts(INITIAL_RECEIPTS);
  };

  const markAsPaid = (transactionData) => {
    if (!activeOrder) return;
    const updated = {
      ...activeOrder,
      isPaid: true,
      transaction: transactionData,
    };
    setActiveOrder(updated);
    setStoredOrder(updated);
  };

  const clearOrder = () => {
    setActiveOrder(null);
    clearStoredOrder();
  };

  // Customer submitting an issue report (post-service reporting flow)
  const submitIssueReport = (reportData) => {
    const newReport = {
      id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      category: reportData.category,
      categoryLabel: reportData.categoryLabel,
      details: reportData.details || '',
      orderId: reportData.orderId,
      tableNumber: reportData.tableNumber,
      priority: 'High Priority',
      stageIndex: 0,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    setIssueReport(newReport);
    setStoredIssueReport(newReport);
    playKitchenChime();
    return newReport;
  };

  const advanceIssueReportStage = () => {
    setIssueReport((prev) => {
      if (!prev) return prev;
      const nextIdx = Math.min(4, prev.stageIndex + 1);
      const stageIds = ['submitted', 'staff_notified', 'staff_assigned', 'resolving', 'resolved'];
      return { ...prev, stageIndex: nextIdx, status: stageIds[nextIdx] };
    });
  };

  const clearIssueReport = () => {
    setIssueReport(null);
    clearStoredIssueReport();
  };

  return (
    <OrderContext.Provider
      value={{
        activeOrder,
        placeOrder,
        updateOrderStatus,
        markAsPaid,
        clearOrder,
        kitchenOrders,
        assistanceRequests,
        updateKitchenOrderStatus,
        toggleKitchenItemDone,
        toggleRushOrder,
        addAssistanceRequest,
        resolveAssistanceRequest,
        resetKitchenDemoData,
        waiterTables,
        billRequests,
        updateWaiterTableStatus,
        addBillRequest,
        settleBillRequest,
        receipts,
        registerSession,
        processCounterPayment,
        toggleRegisterDrawer,
        voidOrRefundReceipt,
        issueReport,
        submitIssueReport,
        advanceIssueReportStage,
        clearIssueReport,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};


