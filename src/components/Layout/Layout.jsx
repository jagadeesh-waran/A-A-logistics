import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Toast from '../Toast/Toast';
import { useToast } from '../Toast/useToast';
import './Layout.css';

export const ToastContext = createContext(null);

export const useToastContext = () => useContext(ToastContext);

const Layout = () => {
  const { toasts, removeToast, toast } = useToast();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <ToastContext.Provider value={toast}>
      {/* Global Background from Superdesign Red-Noir Reference */}
      <div className="global-stars-bg fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black" />
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]" />
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ef233c]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_85%)]" />
      </div>

      {/* Top Gradient Blur */}
      <div className="gradient-blur" />

      <div className="layout relative z-10">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="layout__main">
          <Navbar
            onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          />
          <main className="layout__content" key={location.pathname}>
            <Outlet />
          </main>
        </div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export default Layout;
