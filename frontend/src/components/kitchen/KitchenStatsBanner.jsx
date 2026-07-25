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
      iconBg: 'bg-secondary-container/20',
      iconColor: 'text-secondary',
      valueColor: 'text-on-surface',
    },
    {
      label: 'Preparing',
      value: preparingCount,
      icon: CookingPot,
      iconBg: 'bg-primary-container/20',
      iconColor: 'text-primary',
      valueColor: 'text-primary',
    },
    {
      label: 'Ready',
      value: readyCount,
      icon: CheckCircle2,
      iconBg: 'bg-tertiary-container/20',
      iconColor: 'text-tertiary',
      valueColor: 'text-on-surface',
    },
    {
      label: 'Completed Today',
      value: completedTodayCount,
      icon: ListChecks,
      iconBg: 'bg-surface-container-high',
      iconColor: 'text-on-surface-variant',
      valueColor: 'text-on-surface',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const CardIcon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/20 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-on-surface-variant">{card.label}</p>
              <h3 className={`text-3xl font-bold mt-1 ${card.valueColor}`}>{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <CardIcon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KitchenStatsBanner;
