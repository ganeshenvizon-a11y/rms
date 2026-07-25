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
  GripVertical
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

  let timerBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (minutes >= 15 || order.isRush) {
    timerBadgeStyle = 'bg-error text-on-error border-error animate-pulse';
  } else if (minutes >= 10) {
    timerBadgeStyle = 'bg-secondary-container text-on-secondary-fixed border-secondary-container';
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
      className={`rounded-xl border bg-surface-container-lowest flex flex-col overflow-hidden shadow-sm transition-all ${
        isDragging
          ? 'opacity-40 shadow-none'
          : order.isRush
          ? 'border-error ring-2 ring-error/20'
          : order.status === 'ready'
          ? 'border-t-4 border-t-emerald-500 border-x border-b border-outline-variant/60'
          : order.status === 'served'
          ? 'border-outline-variant/60 opacity-80'
          : 'border-outline-variant/60 hover:border-outline-variant'
      } ${!isDragging ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {/* Card Header */}
      <div className="p-3.5 border-b border-outline-variant/60 flex items-center justify-between gap-2">
        <div className="flex items-start gap-1.5">
          <GripVertical className="w-4 h-4 text-outline shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-on-surface text-sm">Order #{order.orderId}</h5>
              {order.guestCount ? (
                <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5 font-medium">
                  <Users className="w-3 h-3" /> {order.guestCount}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-on-surface-variant">
              Table {order.tableNumber} • {order.serverName || 'QR Dine'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/kitchen/orders/${order.orderId}`)}
            className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors"
            title="View Order Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleRush(order.orderId)}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
              order.isRush
                ? 'bg-error text-on-error border-error'
                : 'bg-surface-container text-on-surface-variant border-outline-variant hover:text-error'
            }`}
            title="Toggle Rush Priority"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </button>
          {prefs.showTimers && (
            <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${timerBadgeStyle}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Special Notes */}
      {order.specialNotes && (
        <div className="bg-error text-on-error p-2.5 text-xs font-bold flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">{order.specialNotes}</p>
        </div>
      )}

      {/* Items */}
      <div className="p-3.5 flex-1 space-y-2.5">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItemDone(order.orderId, item.id)}
            className={`flex items-start gap-2.5 cursor-pointer group transition-all ${
              item.isDone ? 'opacity-45' : 'opacity-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.isDone ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-outline group-hover:text-on-surface" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-primary text-sm">{item.quantity}x</span>
                <h4 className={`text-sm font-bold text-on-surface ${item.isDone ? 'line-through text-on-surface-variant' : ''}`}>
                  {item.name}
                </h4>
              </div>

              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.selectedOptions.map((opt, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant border border-outline-variant/60 rounded-md text-[10px] font-medium"
                    >
                      + {opt}
                    </span>
                  ))}
                </div>
              )}

              {item.notes && (
                <p className="text-[11px] text-on-surface-variant italic mt-0.5">"{item.notes}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="p-3 pt-0">
        {order.status === 'received' && (
          <button
            onClick={() => onUpdateStatus(order.orderId, 'preparing')}
            className="w-full py-3 bg-primary hover:brightness-110 text-on-primary rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <CookingPot className="w-4 h-4" />
            <span>Start Preparing</span>
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateStatus(order.orderId, 'ready')}
            className="w-full py-3 bg-primary hover:brightness-110 text-on-primary rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Ready</span>
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order.orderId, 'served')}
            className="w-full py-3 bg-on-surface hover:opacity-90 text-surface rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Clear Order</span>
          </button>
        )}

        {order.status === 'served' && (
          <button
            onClick={() => onUpdateStatus(order.orderId, 'preparing')}
            className="w-full py-3 bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
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
