import React from 'react';
import Icon from '../common/Icon';

const STAGES = [
  { id: 'received', title: 'Order Received', icon: 'check' },
  { id: 'preparing', title: 'Preparing', icon: 'restaurant_menu' },
  { id: 'ready', title: 'Ready', icon: 'notifications_active' },
  { id: 'served', title: 'Served', icon: 'celebration' },
];

const STAGE_SUBTITLES = [
  'Confirmed by the kitchen',
  'Your dishes are being cooked',
  'Final plating and garnish',
  'Enjoy your authentic meal',
];

const OrderTimeline = ({ currentStageIndex = 1 }) => {
  return (
    <section className="space-y-6">
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentStageIndex;
        const isCurrent = idx === currentStageIndex;
        const isLast = idx === STAGES.length - 1;

        return (
          <div key={stage.id} className="flex items-start gap-6 relative">
            {!isLast && <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-surface-container-highest" />}
            <div className="relative z-10 flex gap-6 w-full">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted || isCurrent
                      ? `bg-primary text-on-primary ${isCurrent ? 'ring-4 ring-primary/20' : ''}`
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <Icon name={stage.icon} className={`text-lg ${isCurrent ? 'animate-pulse-ring' : ''}`} filled={isCurrent} />
                </div>
              </div>
              <div className="flex-1 pb-1">
                <h3 className={`text-sm font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant opacity-60'}`}>
                  {stage.title}
                </h3>
                <p className={`text-xs text-on-surface-variant ${isCompleted || isCurrent ? '' : 'opacity-40'}`}>
                  {STAGE_SUBTITLES[idx]}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default OrderTimeline;
