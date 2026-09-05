'use client';

import { Bell, LogOut, MoonStar, Search, Sun, User } from 'lucide-react';
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
  const theme = useDashboardTheme();
  const panelBackground = theme.isNightMode ? 'rgba(15, 23, 42, 0.78)' : theme.panel;
  const controlBackground = theme.card;
  const hoverBackground = theme.hover;
  const borderColor = theme.border;
  const mutedColor = theme.muted;
  const shadow = theme.shadow;
  const buttonBaseStyle = {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    border: `1px solid ${borderColor}`,
    background: controlBackground,
    color: mutedColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'all 0.2s ease',
    flex: '0 0 auto',
  };

  return (
    <header
      className="dashboard-topbar"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '18px',
        zIndex: 45,
        transform: 'translateX(-50%)',
        width: 'min(360px, calc(100vw - 28px))',
        background: panelBackground,
        border: `1px solid ${borderColor}`,
        borderRadius: '24px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: shadow,
        backdropFilter: 'blur(18px)',
      }}
      aria-label={`${activeTab} dashboard actions`}
    >
      <button
        type="button"
        aria-label={`Search ${activeTab}`}
        title={`Search ${activeTab}`}
        style={buttonBaseStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBackground)}
        onMouseLeave={(e) => (e.currentTarget.style.background = controlBackground)}
      >
        <Search size={18} />
      </button>

      <button
        type="button"
        aria-label="Notifications"
        title="Notifications"
        style={buttonBaseStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBackground)}
        onMouseLeave={(e) => (e.currentTarget.style.background = controlBackground)}
      >
        <Bell size={18} />
        <span
          style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: mutedColor,
            border: `2px solid ${theme.isNightMode ? '#0f172a' : '#ffffff'}`,
          }}
        />
      </button>

      <div
        title={userEmail}
        aria-label={`Signed in as ${userEmail}`}
        style={{
          ...buttonBaseStyle,
          background: theme.iconBackground,
          cursor: 'default',
        }}
      >
        <User size={18} />
      </div>

      <button
        type="button"
        onClick={theme.toggleMode}
        style={buttonBaseStyle}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBackground)}
        onMouseLeave={(e) => (e.currentTarget.style.background = controlBackground)}
        aria-label={theme.isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
        title={theme.isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
      >
        {theme.isNightMode ? <Sun size={18} /> : <MoonStar size={18} />}
      </button>

      <button
        type="button"
        onClick={onLogout}
        style={{
          ...buttonBaseStyle,
          background: '#F6D961',
          color: '#1a1a1a',
          boxShadow: '0 4px 15px rgba(246, 217, 97, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(246, 217, 97, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(246, 217, 97, 0.3)';
        }}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} />
      </button>

      <style jsx>{`
        @media (max-width: 420px) {
          .dashboard-topbar {
            width: min(320px, calc(100vw - 20px)) !important;
            gap: 8px !important;
            padding: 8px !important;
          }

          .dashboard-topbar > button,
          .dashboard-topbar > div {
            width: 42px !important;
            height: 42px !important;
          }
        }
      `}</style>
      <style jsx global>{`
        .dashboard-content {
          padding-bottom: 92px;
        }
      `}</style>
    </header>
  );
}
