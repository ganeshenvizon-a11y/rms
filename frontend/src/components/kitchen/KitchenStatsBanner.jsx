import React from 'react';
import { Sparkles, CookingPot, CheckCircle2, ListChecks } from 'lucide-react';

const isToday = (isoString) => {
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const KitchenStatsBanner = ({ orders = [] }) => {
  const receivedCount = orders.filter((o) => o.status === 'received').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const completedTodayCount = orders.filter(
    (o) => o.status === 'served' && isToday(o.createdAt)
  ).length;

  const cards = [
    {
      label: 'New Orders',
      value: receivedCount,
      icon: Sparkles,
      border: 'border-secondary-container',
      iconColor: 'text-secondary-container',
    },
    {
      label: 'Preparing',
      value: preparingCount,
      icon: CookingPot,
      border: 'border-primary',
      iconColor: 'text-primary',
    },
    {
      label: 'Ready',
      value: readyCount,
      icon: CheckCircle2,
      border: 'border-emerald-500',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Completed Today',
      value: completedTodayCount,
      icon: ListChecks,
      border: 'border-on-surface-variant',
      iconColor: 'text-on-surface-variant',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const CardIcon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-surface-container-lowest p-4 sm:p-5 rounded-xl shadow-sm border-l-4 ${card.border} flex justify-between items-center`}
          >
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">{card.label}</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{card.value}</h3>
            </div>
            <CardIcon className={`w-9 h-9 ${card.iconColor}`} strokeWidth={1.75} />
          </div>
        );
      })}
    </div>
  );
};

export default KitchenStatsBanner;
