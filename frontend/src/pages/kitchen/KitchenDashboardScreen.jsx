import React, { useState } from 'react';
import KitchenHeader from '../../components/kitchen/KitchenHeader';
import KitchenStatsBanner from '../../components/kitchen/KitchenStatsBanner';
import KanbanBoard from '../../components/kitchen/KanbanBoard';

const KitchenDashboardScreen = ({
  orders,
  onUpdateStatus,
  onToggleItemDone,
  onToggleRush,
  defaultStation = 'All'
}) => {
  const [selectedStation, setSelectedStation] = useState(defaultStation);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 space-y-8">
      <section>
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Live Dashboard</h2>
            <p className="text-sm text-on-surface-variant">Real-time kitchen order tickets across every station.</p>
          </div>
        </div>

        <KitchenStatsBanner orders={orders} />
      </section>

      <section className="space-y-4">
        <KitchenHeader
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <KanbanBoard
          orders={orders}
          onUpdateStatus={onUpdateStatus}
          onToggleItemDone={onToggleItemDone}
          onToggleRush={onToggleRush}
          filterStation={selectedStation}
          searchQuery={searchQuery}
        />
      </section>
    </div>
  );
};

export default KitchenDashboardScreen;
