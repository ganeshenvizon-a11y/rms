import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core';
import KitchenOrderCard from './KitchenOrderCard';
import { Inbox, CookingPot, CheckCircle2, Archive } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const COLUMNS = [
  {
    id: 'received',
    title: 'New Orders',
    icon: Inbox,
    badgeClass: 'bg-surface-container-highest text-on-surface',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    icon: CookingPot,
    badgeClass: 'bg-primary text-on-primary',
  },
  {
    id: 'ready',
    title: 'Ready',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-500 text-white',
  },
  {
    id: 'served',
    title: 'Completed',
    icon: Archive,
    badgeClass: 'bg-on-surface-variant text-white',
  },
];

const KanbanColumn = ({ col, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto no-scrollbar pr-0.5 rounded-2xl transition-colors ${
        isOver ? 'bg-primary/5 ring-2 ring-primary/40 ring-inset' : ''
      }`}
    >
      {children}
    </div>
  );
};

const KanbanBoard = ({
  orders = [],
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  filterStation = 'All',
  searchQuery = ''
}) => {
  const [activeOrder, setActiveOrder] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesTable = order.tableNumber.toLowerCase().includes(query);
    const matchesId = order.orderId.toLowerCase().includes(query);
    const matchesItem = order.items.some((it) => it.name.toLowerCase().includes(query));
    return matchesTable || matchesId || matchesItem;
  });

  const handleDragStart = (event) => {
    const order = filteredOrders.find((o) => o.orderId === event.active.id);
    setActiveOrder(order || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveOrder(null);
    if (!over) return;

    const newStatus = over.id;
    const order = filteredOrders.find((o) => o.orderId === active.id);
    if (order && order.status !== newStatus) {
      onUpdateStatus(order.orderId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveOrder(null)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const ColumnIcon = col.icon;
          const colOrders = filteredOrders.filter((o) => o.status === col.id);

          return (
            <section key={col.id} className="flex flex-col gap-3 min-w-0">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <ColumnIcon className="w-4 h-4 text-on-surface-variant" />
                  <h4 className="font-headline-md text-headline-md text-on-surface text-lg">
                    {col.title}
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${col.badgeClass}`}>
                  {colOrders.length}
                </span>
              </div>

              <KanbanColumn col={col}>
                <AnimatePresence mode="popLayout">
                  {colOrders.length > 0 ? (
                    colOrders.map((order) => (
                      <KitchenOrderCard
                        key={order.orderId}
                        order={order}
                        onUpdateStatus={onUpdateStatus}
                        onToggleItemDone={onToggleItemDone}
                        onToggleRush={onToggleRush}
                        filterStation={filterStation}
                      />
                    ))
                  ) : (
                    <div className="py-10 px-4 text-center border-2 border-dashed border-outline-variant/60 rounded-xl bg-surface-container-lowest/50">
                      <ColumnIcon className="w-7 h-7 mx-auto text-on-surface-variant/50 mb-2" />
                      <p className="text-xs text-on-surface-variant font-medium">
                        No tickets in {col.title}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </KanbanColumn>
            </section>
          );
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {activeOrder && (
          <div className="rounded-xl border-2 border-primary bg-surface-container-lowest shadow-2xl p-3.5 w-[320px] rotate-2 opacity-95">
            <p className="text-sm font-bold text-on-surface">Order #{activeOrder.orderId}</p>
            <p className="text-xs text-on-surface-variant">
              Table {activeOrder.tableNumber} • {activeOrder.items.length} item
              {activeOrder.items.length === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
