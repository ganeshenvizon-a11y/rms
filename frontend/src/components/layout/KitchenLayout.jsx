import React from 'react';
import KitchenNavbar from './KitchenNavbar';
import KitchenSidebar from '../kitchen/KitchenSidebar';
import Toast from '../common/Toast';

const KitchenLayout = ({ children, staffAuth, onLogoutStaff, pendingCallsCount = 0 }) => {
  return (
    <div className="h-screen bg-surface text-on-surface font-sans antialiased selection:bg-primary-container/30 selection:text-primary flex flex-col overflow-hidden">
      <Toast />

      <KitchenNavbar
        staffAuth={staffAuth}
        onLogoutStaff={onLogoutStaff}
        pendingCallsCount={pendingCallsCount}
      />

      <div className="flex flex-1 min-h-0">
        {staffAuth && (
          <KitchenSidebar pendingCallsCount={pendingCallsCount} />
        )}

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KitchenLayout;
