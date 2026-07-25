import React, { useState } from 'react';
import KitchenHeader from '../../components/kitchen/KitchenHeader';
import KitchenStatsBanner from '../../components/kitchen/KitchenStatsBanner';
import KanbanBoard from '../../components/kitchen/KanbanBoard';

const KitchenDashboardScreen = ({
  orders,
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  onResetData,
  defaultStation = 'All'
}) => {
  const [selectedStation, setSelectedStation] = useState(defaultStation);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Live Dashboard</h2>
      </div>

      <KitchenStatsBanner orders={orders} />

      <KitchenHeader
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onResetData={onResetData}
      />

      <KanbanBoard
        orders={orders}
        onUpdateStatus={onUpdateStatus}
        onToggleItemDone={onToggleItemDone}
        onToggleRush={onToggleRush}
        filterStation={selectedStation}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default KitchenDashboardScreen;
