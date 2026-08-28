'use client';

import { Search, Bell, MoonStar, User, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onLogout: () => void;
  userEmail?: string;
  activeTab?: string;
}

export default function Navbar({ onLogout, userEmail = 'admin@example.com', activeTab = 'Overview' }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="dashboard-topbar"
      style={{
        background: 'rgba(15, 23, 42, 0.78)',
        border: '1px solid rgba(148, 163, 184, 0.12)',
        borderRadius: '26px',
        padding: '18px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.2)',
      }}
    >
      {/* Page Title */}
      <div className="dashboard-topbar-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.05em' }}>
          {activeTab}
        </h2>
        <span
          style={{
            fontSize: '0.7rem',
            color: '#94a3b8',
            background: 'rgba(148,163,184,0.12)',
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
              color: '#94a3b8',
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
              border: '1px solid rgba(148, 163, 184, 0.12)',
              background: 'rgba(15, 23, 42, 0.72)',
              color: '#cbd5e1',
              padding: '0 16px 0 42px',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.12)')}
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
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#F6D961',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(246, 217, 97, 0.3)',
            }}
          >
            <User size={16} color="#1a1a1a" />
          </div>
          <span className="dashboard-user-name" style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>
            {userEmail.split('@')[0]}
          </span>
        </div>

        {/* Notification Button */}
        <button
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            background: 'rgba(15, 23, 42, 0.7)',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 217, 97, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)')}
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
              background: '#ef4444',
              border: '2px solid #0f172a',
            }}
          />
        </button>

        {/* Theme Toggle */}
        <button
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            background: 'rgba(15, 23, 42, 0.7)',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(246, 217, 97, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)')}
        >
          <MoonStar size={18} />
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
