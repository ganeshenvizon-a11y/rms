import React from 'react';
import Icon from '../common/Icon';

const HonestExpectationBanner = ({ kitchenLoad, estimatedRange, isCompact = false }) => {
  if (!kitchenLoad) return null;

  const getStatusBadge = () => {
    switch (kitchenLoad.status) {
      case 'BUSY':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300',
          icon: 'schedule',
          label: 'Kitchen is currently busy',
          desc: 'Expected preparation range: 20–25 minutes'
        };
      case 'VERY_BUSY':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-900 dark:text-orange-300',
          icon: 'warning',
          label: 'Longer preparation times are expected',
          desc: 'Average kitchen load is high right now'
        };
      case 'PAUSED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300',
          icon: 'pause_circle',
          label: 'New food orders are temporarily paused',
          desc: 'Kitchen is clearing active tickets'
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300',
          icon: 'check_circle',
          label: 'Kitchen running normally',
          desc: 'Standard preparation times apply'
        };
    }
  };

  const badge = getStatusBadge();

  if (isCompact) {
    return (
      <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 ${badge.bg}`}>
        <Icon name={badge.icon} className="text-sm shrink-0" />
        <span className="truncate">{badge.label}</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${badge.bg}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <Icon name={badge.icon} className="text-xl" />
        </div>
        <div>
          <span className="font-bold text-sm block">{badge.label}</span>
          <span className="opacity-90">{badge.desc}</span>
        </div>
      </div>

      {estimatedRange && (
        <div className="bg-surface/80 backdrop-blur px-3.5 py-2 rounded-lg border border-outline-variant/20 flex items-center gap-2 font-bold text-on-surface self-start sm:self-auto">
          <Icon name="timer" className="text-primary text-base" />
          <span>Current estimate: {estimatedRange}</span>
        </div>
      )}
    </div>
  );
};

export default HonestExpectationBanner;
