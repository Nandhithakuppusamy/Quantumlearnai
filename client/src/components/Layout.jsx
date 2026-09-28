import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import PresentationModal from './PresentationModal';

export const Layout = () => {
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar
        mobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenPresentation={() => setIsPresentationOpen(true)}
          onOpenMenu={() => setIsMobileSidebarOpen(true)}
        />
        
        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 2xl:p-10 pb-28 md:pb-10 overflow-x-hidden">
          <Outlet context={{ openPresentation: () => setIsPresentationOpen(true) }} />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileNav />

      {/* SIH Presentation Mode Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
};

export default Layout;
