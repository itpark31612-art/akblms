import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Drawer } from '../../design-system/components/Drawer';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Responsive Drawer Sidebar */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        size="sm"
        showCloseButton={false}
      >
        <div className="-m-6 h-full">
          <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
