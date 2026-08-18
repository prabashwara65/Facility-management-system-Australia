'use client';

import {
  LayoutGrid,
  Cloud,
  FolderOpen,
  Users,
  Settings,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Home,
  MapPin,
  Calendar,
} from 'lucide-react';

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
  { icon: MapPin, label: 'ServiceAreas' },
  { icon: Calendar, label: 'Bookings' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside
      style={{
        borderRadius: '32px',
        background: 'rgba(15, 23, 42, 0.86)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 30px 70px rgba(15, 23, 42, 0.45)',
        padding: '24px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px 20px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              boxShadow: '0 10px 22px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Cloud size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#f8fafc' }}>
              SparkWell
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ marginTop: '8px' }}>
          <div
            style={{
              color: '#94a3b8',
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
                  background: isActive
                    ? 'rgba(246, 216, 93, 0.15)'
                    : 'transparent',
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#e2e8f0';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      width: '4px',
                      height: '24px',
                      borderRadius: '4px',
                      background: '#F6D85D',
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