import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import PresentationModal from './PresentationModal';

export const Layout = () => {
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenPresentation={() => setIsPresentationOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
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
