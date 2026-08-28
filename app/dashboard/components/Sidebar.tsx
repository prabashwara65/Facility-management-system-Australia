'use client';

import {
  LayoutGrid,
  Users,
  ShieldCheck,
  Sparkles,
  DollarSign,
  MapPin,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useDashboardTheme } from '../context/DashboardThemeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: 'Overview' },
  { icon: Sparkles, label: 'Services' },
  { icon: DollarSign, label: 'Pricing' },
  { icon: ShieldCheck, label: 'Promise' },
  { icon: Users, label: 'Testimonials' },
  { icon: MapPin, label: 'Service Areas' },
  { icon: Calendar, label: 'Bookings' },
  { icon: Calendar, label: 'Mobile Detailing' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const theme = useDashboardTheme();
  const sidebarBackground = theme.isNightMode ? 'rgba(15, 23, 42, 0.86)' : theme.panel;
  const borderColor = theme.border;
  const shadow = theme.isNightMode ? '0 30px 70px rgba(15, 23, 42, 0.45)' : '0 30px 70px rgba(15, 23, 42, 0.12)';
  const activeBackground = theme.accentBackground;
  const hoverBackground = theme.hover;
  const activeColor = theme.text;
  const mutedColor = theme.muted;
  const hoverColor = theme.text;

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        borderRadius: '32px',
        background: sidebarBackground,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Logo */}
        <Link href="/dashboard" className="dashboard-sidebar-logo flex items-center gap-2.5 mb-6 px-2">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: theme.iconBackground,
              border: `1px solid ${borderColor}`,
            }}
          >
            <span className="text-lg" style={{ color: activeColor }}>✦</span>
          </div>
          <div className="font-serif text-[18px] font-bold leading-tight">
            <span style={{ color: activeColor }}>Shining</span>
            <span style={{ color: mutedColor }}> Property Service</span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="dashboard-sidebar-nav" style={{ marginTop: '8px' }}>
          <div
            className="dashboard-sidebar-label"
            style={{
              color: mutedColor,
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0 10px 10px',
            }}
          >
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            
            return (
              <button
                key={item.label}
                className="dashboard-sidebar-item"
                onClick={() => setActiveTab(item.label)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px 12px',
                  marginBottom: '8px',
                  background: isActive ? activeBackground : 'transparent',
                  color: isActive ? activeColor : mutedColor,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = hoverColor;
                    e.currentTarget.style.background = hoverBackground;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = mutedColor;
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                <span className="dashboard-sidebar-item-label">{item.label}</span>
                {isActive && (
                  <div
                    className="dashboard-sidebar-active-marker"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      width: '4px',
                      height: '24px',
                      borderRadius: '4px',
                      background: activeColor,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
