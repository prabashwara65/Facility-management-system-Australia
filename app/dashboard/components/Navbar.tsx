'use client';

import { Search, Bell, MoonStar, Sun, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useDashboardTheme } from '../context/DashboardThemeContext';

interface NavbarProps {
  onLogout: () => void;
  userEmail?: string;
  activeTab?: string;
}

export default function Navbar({
  onLogout,
  userEmail = 'admin@example.com',
  activeTab = 'Overview',
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useDashboardTheme();
  const panelBackground = theme.isNightMode ? 'rgba(15, 23, 42, 0.78)' : theme.panel;
  const controlBackground = theme.card;
  const hoverBackground = theme.hover;
  const borderColor = theme.border;
  const titleColor = theme.text;
  const textColor = theme.text;
  const mutedColor = theme.muted;
  const inputTextColor = theme.inputText;
  const shadow = theme.shadow;

  return (
    <header
      className="dashboard-topbar"
      style={{
        background: panelBackground,
        border: `1px solid ${borderColor}`,
        borderRadius: '26px',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: shadow,
      }}
    >
      {/* Page Title */}
      <div className="dashboard-topbar-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: titleColor, letterSpacing: '-0.05em' }}>
          {activeTab}
        </h2>
        <span
          style={{
            fontSize: '0.7rem',
            color: mutedColor,
            background: theme.isNightMode ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.06)',
            padding: '2px 10px',
            borderRadius: '20px',
          }}
        >
          {activeTab === 'Overview' ? 'Dashboard' : 'Management'}
        </span>
      </div>

      {/* Search Bar */}
      <div className="dashboard-topbar-search" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '420px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              top: '50%',
              left: '14px',
              transform: 'translateY(-50%)',
              color: mutedColor,
            }}
          />
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              border: `1px solid ${borderColor}`,
              background: controlBackground,
              color: inputTextColor,
              padding: '0 16px 0 42px',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = theme.isNightMode ? 'rgba(226, 232, 240, 0.36)' : 'rgba(15, 23, 42, 0.28)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = borderColor)}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="dashboard-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* User Info - Admin Icon with Yellow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px 6px 6px',
            borderRadius: '12px',
            background: controlBackground,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: theme.iconBackground,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} color={mutedColor} />
          </div>
          <span className="dashboard-user-name" style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500 }}>
            {userEmail.split('@')[0]}
          </span>
        </div>

        {/* Notification Button */}
        <button
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            background: controlBackground,
            color: mutedColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBackground)}
          onMouseLeave={(e) => (e.currentTarget.style.background = controlBackground)}
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
              background: mutedColor,
              border: `2px solid ${theme.isNightMode ? '#0f172a' : '#ffffff'}`,
            }}
          />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={theme.toggleMode}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: `1px solid ${borderColor}`,
            background: controlBackground,
            color: mutedColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = hoverBackground)}
          onMouseLeave={(e) => (e.currentTarget.style.background = controlBackground)}
          aria-label={theme.isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
        >
          {theme.isNightMode ? <Sun size={18} /> : <MoonStar size={18} />}
        </button>

        {/* Logout Button - Yellow */}
        <button
          onClick={onLogout}
          style={{
            border: 'none',
            borderRadius: '14px',
            padding: '11px 18px',
            background: '#F6D961',
            color: '#1a1a1a',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(246, 217, 97, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(246, 217, 97, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(246, 217, 97, 0.3)';
          }}
        >
          <LogOut size={16} />
          <span className="dashboard-logout-label">Logout</span>
        </button>
      </div>
    </header>
  );
}
