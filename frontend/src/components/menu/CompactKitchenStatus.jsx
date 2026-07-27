import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

/**
 * Compact kitchen status row with clean vertical breathing room.
 */
const CompactKitchenStatus = ({ kitchenLoad }) => {
  if (!kitchenLoad) return null;

  const prepTime = kitchenLoad.averagePreparationMinutes || 20;
  const estimatedRange = `${prepTime}–${prepTime + 5} min`;
  const isBusy = kitchenLoad.status === 'BUSY' || kitchenLoad.status === 'VERY_BUSY';

  return (
    <div className="px-4 mb-7">
      <div
        className={`h-[44px] px-4 rounded-xl border flex items-center justify-between text-xs font-semibold gap-2 transition-colors ${
          isBusy
            ? 'bg-[#FFF5DF] border-[#F47712]/30 text-[#211917]'
            : 'bg-[#EAF7EF] border-[#238653]/30 text-[#211917]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {isBusy ? (
            <Clock className="w-4 h-4 text-[#B56B08] shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#238653] shrink-0" aria-hidden="true" />
          )}
          <span className="truncate text-[12.5px]">
            <span className="font-bold">{isBusy ? 'Busy kitchen' : 'Kitchen active'}</span>
            <span className="mx-1.5 text-[#95867E]">·</span>
            <span className="text-[#6F5F58]">Expected preparation {estimatedRange}</span>
          </span>
        </div>

        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            isBusy ? 'bg-[#F47712]/15 text-[#B56B08]' : 'bg-[#238653]/15 text-[#238653]'
          }`}
        >
          {isBusy ? 'Busy' : 'Normal'}
        </span>
      </div>
    </div>
  );
};

export default CompactKitchenStatus;
