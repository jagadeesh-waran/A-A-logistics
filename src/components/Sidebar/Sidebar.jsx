import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings2,
  LogOut,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/create-llr', label: 'Create LLR', icon: FilePlus, badge: 'NEW' },
  { path: '/all-llr', label: 'All LLR Records', icon: FileText, badge: null },
  { path: '/settings', label: 'Settings', icon: Settings2, badge: null },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('llr_logged_in');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      {/* Brand Header with Prominent Official Logo */}
      <div className="sidebar-brand-wrapper">
        <div
          className="sidebar-brand group flex flex-col items-center gap-2.5"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="relative w-full p-3 rounded-2xl bg-gradient-to-b from-zinc-900/95 to-black border border-white/15 group-hover:border-[#ef233c]/80 shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_20px_rgba(239,35,60,0.25)] group-hover:shadow-[0_0_35px_rgba(239,35,60,0.5)] transition-all flex items-center justify-center overflow-hidden">
            <img
              src="/logo.png"
              alt="A&A Logistics Official Logo"
              className="w-full h-auto max-h-24 sm:max-h-28 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(239,35,60,0.5)]"
            />
            {/* Ambient subtle glow overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#ef233c]/10 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="w-full flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] shadow-[0_0_6px_#ef233c] animate-pulse" />
              <span className="text-xs font-extrabold font-manrope text-white tracking-wider uppercase">
                A&amp;A Logistics
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/40 shadow-[0_0_8px_rgba(239,35,60,0.25)]">
              PRO
            </span>
          </div>
        </div>
      </div>

      <div className="sidebar-divider" />

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label font-manrope">
          <span>OPERATIONS</span>
        </div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-link-content">
                    <div className="nav-icon-wrapper">
                      <Icon size={17} className="nav-icon" />
                    </div>
                    <span className="nav-label font-inter">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="nav-badge-pill">{item.badge}</span>
                  ) : (
                    <ChevronRight size={13} className="nav-arrow" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active System Pill */}
      <div className="sidebar-status-card">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
        </span>
        <div className="status-text-block">
          <span className="status-title font-manrope font-semibold">Dispatch Hub Live</span>
          <span className="status-desc font-inter">Local Storage &bull; Offline Sync</span>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="sidebar-footer">
        <div className="footer-user-block">
          <div className="user-avatar-badge font-manrope">
            <span>AA</span>
          </div>
          <div className="user-details">
            <span className="user-name font-manrope">A&amp;A Operator</span>
            <span className="user-role font-inter">Transport Officer</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-logout-button"
          title="Sign out"
          aria-label="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
