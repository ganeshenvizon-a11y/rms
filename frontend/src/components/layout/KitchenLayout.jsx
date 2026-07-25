import React from 'react';
import { useLocation } from 'react-router-dom';
import Toast from '../common/Toast';
import KitchenSidebar from '../kitchen/KitchenSidebar';
import KitchenTopBar from '../kitchen/KitchenTopBar';

const PAGE_META = [
  {
    match: (p) => p.startsWith('/kitchen/orders/'),
    title: 'Order Details',
    subtitle: 'Kitchen Ticket'
  },
  {
    match: (p) => p.startsWith('/kitchen/history'),
    title: 'Order History',
    subtitle: 'Completed & active kitchen tickets'
  },
  {
    match: (p) => p.startsWith('/kitchen/summary'),
    title: 'Item Summary',
    subtitle: 'Batch cook aggregation queue'
  },
  {
    match: (p) => p.startsWith('/kitchen/assistance'),
    title: 'Assistance Calls',
    subtitle: 'Live table request feed'
  },
  {
    match: (p) => p.startsWith('/kitchen/settings'),
    title: 'Kitchen Settings',
    subtitle: 'Kitchen Module'
  },
  {
    match: (p) => p === '/kitchen',
    title: null,
    subtitle: null,
    showSearch: true,
    searchPlaceholder: 'Search table, order #, or dish...'
  }
];

const KitchenLayout = ({ children, staffAuth, pendingCallsCount = 0, onResetData }) => {
  const location = useLocation();

  if (!staffAuth) {
    return (
      <div className="flex h-screen w-full bg-background overflow-hidden items-center justify-center">
        <Toast />
        {children}
      </div>
    );
  }

  const meta = PAGE_META.find((m) => m.match(location.pathname)) || {};

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Toast />
      <KitchenSidebar pendingCallsCount={pendingCallsCount} onResetData={onResetData} />
      <div className="flex-1 flex flex-col min-w-0">
        <KitchenTopBar
          title={meta.title}
          subtitle={meta.subtitle}
          showSearch={meta.showSearch}
          searchPlaceholder={meta.searchPlaceholder}
          staffAuth={staffAuth}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default KitchenLayout;
