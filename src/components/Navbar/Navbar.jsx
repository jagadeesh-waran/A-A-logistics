import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User, ChevronDown, Plus, Menu, ArrowRight } from 'lucide-react';
import './Navbar.css';

const pageTitleMap = {
  '/': { title: 'Design Intelligence', breadcrumb: 'OPERATIONS', category: 'Dashboard' },
  '/dashboard': { title: 'Design Intelligence', breadcrumb: 'OPERATIONS', category: 'Dashboard' },
  '/create-llr': { title: 'Generate Lorry Receipt', breadcrumb: 'DISPATCH', category: 'Create' },
  '/all-llr': { title: 'Consignment Archive', breadcrumb: 'RECORDS', category: 'Registry' },
  '/settings': { title: 'System Configuration', breadcrumb: 'PREFERENCES', category: 'Settings' },
  '/preview-llr': { title: 'Document Preview', breadcrumb: 'MANIFEST', category: 'Print Ready' },
};

const getPageDetails = (pathname) => {
  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  if (pageTitleMap[normalizedPath]) {
    return pageTitleMap[normalizedPath];
  }

  const segment = normalizedPath.split('/').filter(Boolean).pop();
  if (!segment) {
    return { title: 'Design Intelligence', breadcrumb: 'OPERATIONS', category: 'Dashboard' };
  }

  const formattedTitle = segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: formattedTitle,
    breadcrumb: 'SYSTEM',
    category: 'Hub',
  };
};

const Navbar = ({ onToggleSidebar = () => {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, breadcrumb, category } = getPageDetails(location.pathname);

  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/all-llr?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('llr_logged_in');
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar-container">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="navbar-left">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="navbar-hamburger-btn"
          aria-label="Toggle navigation menu"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Mini Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          className="navbar-mobile-brand"
        >
          <img src="/logo.png" alt="A&A Logistics" className="w-8 h-8 object-contain" />
        </div>

        <div className="navbar-title-group">
          <div className="navbar-breadcrumb-row">
            <span className="navbar-breadcrumb-chip font-manrope">{breadcrumb}</span>
            <span className="navbar-breadcrumb-sep">&bull;</span>
            <span className="navbar-breadcrumb-active font-inter">{category}</span>
          </div>
          <h1 className="navbar-title font-manrope">{title}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="navbar-right">
        {/* Quick New LLR Button */}
        {location.pathname !== '/create-llr' && (
          <button
            onClick={() => navigate('/create-llr')}
            className="navbar-new-llr-btn group"
            title="Create New LLR"
          >
            <span className="absolute inset-0 border border-white/10 rounded-full" />
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-[1px] rounded-full bg-black" />
            <span className="relative z-10 flex items-center gap-1.5 text-xs font-bold font-manrope uppercase tracking-wider text-white">
              <Plus size={14} className="text-[#ef233c] shrink-0" />
              <span className="hidden sm:inline">New LLR</span>
              <ArrowRight size={12} className="text-[#ef233c] hidden sm:inline group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        )}

        {/* Desktop Global Search Input */}
        <div className="navbar-search-wrapper hidden md:flex">
          <Search className="navbar-search-icon" size={14} />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search LLR, party, truck..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <div className="navbar-search-shortcut">
            <span>↵</span>
          </div>
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setShowMobileSearch((prev) => !prev)}
          className="navbar-icon-btn md:hidden"
          aria-label="Search records"
          title="Search"
        >
          <Search size={16} />
        </button>

        {/* Live Notification Indicator */}
        <button className="navbar-icon-btn" aria-label="Notifications" title="System Notifications">
          <Bell size={16} />
          <span className="navbar-notification-pulse" />
        </button>

        {/* User Menu Trigger */}
        <div className="navbar-user-menu" ref={userMenuRef}>
          <button
            className="navbar-user-trigger"
            onClick={() => setShowUserMenu((v) => !v)}
            aria-label="User Account Menu"
          >
            <div className="navbar-user-avatar overflow-hidden p-0.5 bg-white/5 border border-white/10">
              <img src="/logo.png" alt="AA" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="navbar-user-info hidden lg:flex">
              <span className="navbar-user-name font-manrope">A&amp;A Admin</span>
              <span className="navbar-user-badge font-inter">HQ Mumbai</span>
            </div>
            <ChevronDown
              size={13}
              className="navbar-chevron"
              style={{
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {showUserMenu && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown__header">
                <div className="flex items-center gap-2 mb-1">
                  <img src="/logo.png" alt="A&A Logistics" className="w-4 h-4 object-contain rounded-sm" />
                  <p className="navbar-dropdown__name font-manrope">A&amp;A Logistics</p>
                </div>
                <p className="navbar-dropdown__role font-inter">Super Administrator</p>
              </div>
              <div className="navbar-dropdown__divider" />
              <button
                className="navbar-dropdown__item font-inter"
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
              >
                <User size={14} className="text-zinc-400" />
                Profile &amp; Settings
              </button>
              <div className="navbar-dropdown__divider" />
              <button
                className="navbar-dropdown__item navbar-dropdown__item--danger font-inter"
                onClick={handleLogout}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Row (Expandable) */}
      {showMobileSearch && (
        <div className="navbar-mobile-search-row md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="text"
              autoFocus
              className="w-full h-9 pl-9 pr-4 rounded-full bg-zinc-900 border border-white/15 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#ef233c]"
              placeholder="Search LLR, party, truck..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
