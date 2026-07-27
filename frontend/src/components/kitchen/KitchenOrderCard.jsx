import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import {
  Clock,
  CheckSquare,
  Square,
  AlertOctagon,
  CookingPot,
  CheckCircle2,
  Users,
  RotateCcw,
  Sparkles,
  Eye,
  GripVertical,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const KitchenOrderCard = ({
  order,
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  filterStation = 'All'
}) => {
  const navigate = useNavigate();
  const { prefs } = useKitchenPrefs();
  const [elapsedSeconds, setElapsedSeconds] = useState(order.elapsedSeconds || 0);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.orderId
  });
  const dragStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  useEffect(() => {
    const createdTime = new Date(order.createdAt).getTime();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - createdTime) / 1000);
      setElapsedSeconds(seconds > 0 ? seconds : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  let timerBadgeStyle = 'bg-amber-100 text-amber-900 border-amber-300';
  if (minutes >= 15 || order.isRush) {
    timerBadgeStyle = 'bg-red-600 text-white border-red-700 animate-pulse';
  } else if (minutes >= 10) {
    timerBadgeStyle = 'bg-orange-500 text-white border-orange-600';
  }

  const displayedItems = filterStation === 'All'
    ? order.items
    : order.items.filter((it) => it.station === filterStation);

  if (displayedItems.length === 0 && filterStation !== 'All') {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      {...attributes}
      {...listeners}
      className={`touch-none ${isDragging ? 'relative z-40' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl border bg-white flex flex-col overflow-hidden shadow-sm transition-all ${
          isDragging
            ? 'opacity-40 shadow-none'
            : order.isRush
            ? 'border-red-500 ring-2 ring-red-500/20'
            : order.status === 'ready'
            ? 'border-t-4 border-t-emerald-600 border-x border-b border-gray-200'
            : order.status === 'served'
            ? 'border-gray-200 opacity-80'
            : 'border-gray-200 hover:border-gray-300'
        } ${!isDragging ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {/* Card Header: TABLE & ORDER # */}
        <div className="p-3.5 border-b border-gray-200 bg-gray-900 text-white flex items-center justify-between gap-2">
          <div className="flex items-start gap-1.5">
            <GripVertical className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-extrabold text-sm tracking-wider uppercase">
                  TABLE {order.tableNumber} · ORDER #{order.orderId}
                </h5>
                {order.guestCount ? (
                  <span className="text-[10px] text-gray-300 flex items-center gap-0.5 font-medium">
                    <Users className="w-3 h-3" /> {order.guestCount}
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-gray-400">
                Server: {order.serverName || 'QR Dine Customer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate(`/kitchen/orders/${order.orderId}`)}
              className="p-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              title="View Order Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleRush(order.orderId)}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                order.isRush
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-800 text-gray-300 border-gray-700 hover:text-red-400'
              }`}
              title="Toggle Rush Priority"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
            </button>
            {prefs.showTimers && (
              <div className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${timerBadgeStyle}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedTime}</span>
              </div>
            )}
          </div>
        </div>

        {/* Table Special Notes */}
        {order.specialNotes && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-900 p-2.5 text-xs font-bold flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <p className="leading-snug">Table Note: {order.specialNotes}</p>
          </div>
        )}

        {/* Items List grouped by station */}
        <div className="p-3.5 flex-1 space-y-4 bg-gray-50/50">
          {Object.entries(
            displayedItems.reduce((acc, item) => {
              const stationName = (item.station || 'MAIN_KITCHEN').replace('_', ' ');
              if (!acc[stationName]) acc[stationName] = [];
              acc[stationName].push(item);
              return acc;
            }, {})
          ).map(([stationHeader, items]) => (
            <div key={stationHeader} className="space-y-2">
              <div className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 px-2 py-0.5 rounded w-max">
                {stationHeader}
              </div>

              {items.map((item) => {
                const formattedModifiers = [];
                if (item.makeVegan) formattedModifiers.push('MAKE VEGAN (NO DAIRY)');
                if (item.jainPreparation) formattedModifiers.push('JAIN PREPARATION (NO ONION/GARLIC)');

                if (item.modifiers && Array.isArray(item.modifiers)) {
                  item.modifiers.forEach(m => formattedModifiers.push(typeof m === 'string' ? m.toUpperCase() : m));
                } else if (item.selectedCustomizations && item.selectedCustomizations.length > 0) {
                  item.selectedCustomizations.forEach(c => {
                    formattedModifiers.push((c.label || c.name || '').toUpperCase());
                  });
                }

                const isHold = item.readinessStatus === 'HOLD' || item.courseAction === 'HOLD';
                const isRefire = item.isRefire;

                return (
                  <div
                    key={item.id || item.orderItemId || item.cartItemId}
                    onClick={() => onToggleItemDone(order.orderId, item.id || item.orderItemId || item.cartItemId)}
                    className={`p-3 rounded-xl border bg-white transition-all shadow-sm cursor-pointer ${
                      item.isDone ? 'opacity-40 bg-gray-100 border-gray-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Badges for RE-FIRE and HOLD */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      {isRefire && (
                        <span className="bg-red-600 text-white font-mono font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider animate-pulse flex items-center gap-1">
                          <Flame className="w-3 h-3" /> RE-FIRE · PRIORITY HIGH
                        </span>
                      )}
                      {isHold && (
                        <span className="bg-amber-100 border border-amber-300 text-amber-900 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-700" /> HOLD — Do not prepare until requested
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="bg-gray-800 text-red-300 font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                          REJECTED ({item.rejectionReason || 'Unavailable'})
                        </span>
                      )}
                    </div>

                    {/* Item Header */}
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {item.isDone ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-black text-amber-700 text-lg font-mono">{item.quantity} ×</span>
                          <h4 className={`text-base font-black text-gray-900 uppercase tracking-wide ${item.isDone ? 'line-through text-gray-400' : ''}`}>
                            {item.name}
                          </h4>
                        </div>

                        {/* Action-Language Modifiers */}
                        {formattedModifiers.length > 0 && (
                          <div className="mt-2 space-y-1 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80 font-mono text-xs text-amber-950 font-extrabold">
                            {formattedModifiers.map((mod, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="text-amber-600">▪</span>
                                <span>{mod}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* High-Contrast ALLERGY ALERT Box */}
                        {item.allergyAlert && (
                          <div className="mt-2 bg-red-600 text-white p-2.5 rounded-lg font-mono text-xs font-black shadow-md space-y-0.5">
                            <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] bg-red-700 px-2 py-0.5 rounded w-max text-red-100">
                              <AlertTriangle className="w-4 h-4 text-white" />
                              <span>ALLERGY ALERT</span>
                            </div>
                            <p className="text-white text-sm uppercase pt-1 font-bold">{item.allergyAlert}</p>
                          </div>
                        )}

                        {/* Preference / Special Instructions */}
                        {(item.note || item.itemNote || item.notes) && (
                          <div className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded-lg font-medium">
                            <span className="font-bold text-gray-900 block text-[10px] uppercase tracking-wider text-gray-500">Preference:</span>
                            <span className="italic">"{item.note || item.itemNote || item.notes}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-gray-200">
          {order.status === 'received' && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'preparing')}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <CookingPot className="w-4 h-4" />
              <span>Start Preparing</span>
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'ready')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Ready</span>
            </button>
          )}

          {order.status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'served')}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Clear Order</span>
            </button>
          )}

          {order.status === 'served' && (
            <button
              onClick={() => onUpdateStatus(order.orderId, 'preparing')}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recall Ticket</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default KitchenOrderCard;
