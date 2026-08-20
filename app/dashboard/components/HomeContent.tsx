'use client';

import {
  ArrowUpRight,
  FileText,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Database,
  Download,
  Link2,
  DollarSign,
  Home,
  Building,
  Users,
  Star,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import PricingSection from '../components/pages/PricingSection';

// Types
interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  revenue: number;
}

interface ServiceStats {
  total: number;
  residential: number;
  commercial: number;
  active: number;
}

interface PricingStats {
  totalTiers: number;
  totalAddOns: number;
  totalFAQs: number;
}

export default function HomeContent() {
  const [showPricingPreview, setShowPricingPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [serviceStats, setServiceStats] = useState<ServiceStats>({
    total: 0,
    residential: 0,
    commercial: 0,
    active: 0,
  });
  const [pricingStats, setPricingStats] = useState<PricingStats>({
    totalTiers: 0,
    totalAddOns: 0,
    totalFAQs: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Stats Cards Data
  const statCards = [
    { label: 'Total Bookings', value: bookingStats.total.toString(), delta: '+12.4%', tone: '#8b5cf6' },
    { label: 'Pending', value: bookingStats.pending.toString(), delta: '+2.1%', tone: '#f59e0b' },
    { label: 'Completed', value: bookingStats.completed.toString(), delta: '+18.7%', tone: '#10b981' },
    { label: 'Revenue', value: `$${bookingStats.revenue.toLocaleString()}`, delta: '+0.8%', tone: '#3b82f6' },
  ];

  const quickActions = [
    { icon: Database, label: 'Auto backup', detail: 'Every 6 hours', color: '#8b5cf6' },
    { icon: Download, label: 'Download queue', detail: '12 files', color: '#3b82f6' },
    { icon: Link2, label: 'Shared links', detail: '7 active', color: '#10b981' },
    { icon: DollarSign, label: 'Pricing', detail: `${pricingStats.totalTiers} tiers`, color: '#f59e0b' },
  ];

  const serviceStatsData = [
    { label: 'Total Services', value: serviceStats.total.toString(), icon: Home, color: '#3b82f6' },
    { label: 'Residential', value: serviceStats.residential.toString(), icon: Home, color: '#10b981' },
    { label: 'Commercial', value: serviceStats.commercial.toString(), icon: Building, color: '#8b5cf6' },
    { label: 'Active', value: serviceStats.active.toString(), icon: Star, color: '#f59e0b' },
  ];

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Load booking stats
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError);
      } else if (bookingsData) {
        const total = bookingsData.length;
        const pending = bookingsData.filter(b => b.status === 'Pending').length;
        const confirmed = bookingsData.filter(b => b.status === 'Confirmed').length;
        const completed = bookingsData.filter(b => b.status === 'Completed').length;
        const cancelled = bookingsData.filter(b => b.status === 'Cancelled').length;
        const revenue = bookingsData.reduce((sum, b) => sum + (b.total_price || 0), 0);

        setBookingStats({
          total,
          pending,
          confirmed,
          completed,
          cancelled,
          revenue,
        });

        // Get recent 5 bookings
        setRecentBookings(bookingsData.slice(0, 5));
      }

      // 2. Load service stats
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*');

      if (servicesError) {
        console.error('Error loading services:', servicesError);
      } else if (servicesData) {
        setServiceStats({
          total: servicesData.length,
          residential: servicesData.filter(s => s.category === 'Residential').length,
          commercial: servicesData.filter(s => s.category === 'Commercial').length,
          active: servicesData.filter(s => s.status === 'Active').length,
        });
      }

      // 3. Load pricing stats
      const { data: tiersData, error: tiersError } = await supabase
        .from('pricing_tiers')
        .select('*');

      const { data: addOnsData, error: addOnsError } = await supabase
        .from('add_ons')
        .select('*');

      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*');

      if (!tiersError && tiersData) {
        setPricingStats({
          totalTiers: tiersData.length,
          totalAddOns: addOnsData?.length || 0,
          totalFAQs: faqsData?.length || 0,
        });
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#94a3b8' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px' }}>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Overview Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.92), rgba(17,24,39,0.95))',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px 24px 20px',
          boxShadow: '0 20px 55px rgba(2, 6, 23, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                color: '#94a3b8',
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Dashboard Overview
            </div>
            <h1
              style={{
                margin: '8px 0 0',
                fontSize: 'clamp(1.5rem, 3vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.07em',
                color: '#f8fafc',
              }}
            >
              Good morning
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRefresh}
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(59,130,246,0.12)',
                color: '#dbeafe',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 'clamp(0.75rem, 0.9vw, 0.9rem)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
            <button
              onClick={() => setShowPricingPreview(!showPricingPreview)}
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(59,130,246,0.12)',
                color: '#dbeafe',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 'clamp(0.75rem, 0.9vw, 0.9rem)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
            >
              <DollarSign size={15} />
              {showPricingPreview ? 'Hide Pricing' : 'View Pricing'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: '20px',
                padding: '18px 16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(0.6rem, 0.7vw, 0.74rem)',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: card.tone,
                    flexShrink: 0,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: '14px',
                  fontSize: 'clamp(1.3rem, 2vw, 2rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  color: '#f8fafc',
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#86efac',
                  fontSize: 'clamp(0.65rem, 0.7vw, 0.8rem)',
                  fontWeight: 600,
                }}
              >
                <ArrowUpRight size={14} />
                {card.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Service Stats Mini Cards */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px', 
            marginTop: '16px',
          }}
        >
          {serviceStatsData.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${stat.color}22`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: 'clamp(0.6rem, 0.65vw, 0.7rem)' }}>{stat.label}</div>
                  <div style={{ color: '#f8fafc', fontSize: 'clamp(0.85rem, 1vw, 1rem)', fontWeight: 700 }}>{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section Preview */}
      {showPricingPreview && (
        <div
          style={{
            borderRadius: '30px',
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,0.12)',
            background: 'rgba(15, 23, 42, 0.82)',
          }}
        >
          <PricingSection />
        </div>
      )}

      {/* Main Content Grid */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Left Column - Recent Bookings */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(2, 6, 23, 0.28)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                Recent Activity
              </div>
              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
                  letterSpacing: '-0.05em',
                  color: '#f8fafc',
                }}
              >
                Recent Bookings
              </h2>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
              {bookingStats.total} total
            </span>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '8px',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: 'rgba(15, 23, 42, 0.72)',
                    border: '1px solid rgba(148,163,184,0.08)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(96,165,250,0.14)',
                        color: '#93c5fd',
                        flexShrink: 0,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {booking.first_name?.[0]}{booking.last_name?.[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'clamp(0.8rem, 0.85vw, 0.9rem)' }}>
                        {booking.first_name} {booking.last_name}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', fontSize: 'clamp(0.65rem, 0.7vw, 0.75rem)' }}>
                          {booking.service_type}
                        </span>
                        <span
                          style={{
                            fontSize: 'clamp(0.6rem, 0.65vw, 0.7rem)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            color: booking.status === 'Pending' ? '#f59e0b' : 
                                   booking.status === 'Confirmed' ? '#3b82f6' : 
                                   booking.status === 'Completed' ? '#10b981' : '#ef4444',
                            background: booking.status === 'Pending' ? 'rgba(245,158,11,0.15)' : 
                                       booking.status === 'Confirmed' ? 'rgba(59,130,246,0.15)' : 
                                       booking.status === 'Completed' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          }}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: 'clamp(0.7rem, 0.75vw, 0.8rem)' }}>
                      {formatDate(booking.preferred_date)}
                    </span>
                    <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: 'clamp(0.8rem, 0.85vw, 0.9rem)' }}>
                      ${booking.total_price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}>
                No bookings yet
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Traffic Chart */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(15,23,42,0.82), rgba(20,31,53,0.98))',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Activity
                </div>
                <h2
                  style={{
                    margin: '8px 0 0',
                    fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
                    letterSpacing: '-0.05em',
                    color: '#f8fafc',
                  }}
                >
                  Traffic
                </h2>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#86efac',
                  fontWeight: 700,
                  fontSize: 'clamp(0.8rem, 0.9vw, 1rem)',
                }}
              >
                <TrendingUp size={15} />
                +24%
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                gap: 'clamp(4px, 0.6vw, 10px)',
                height: '180px',
                marginTop: '18px',
              }}
            >
              {[58, 76, 54, 82, 69, 92, 64].map((bar, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    maxWidth: '30px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '22px',
                      height: `${bar}%`,
                      minHeight: '24px',
                      borderRadius: '12px 12px 6px 6px',
                      background:
                        index === 6
                          ? 'linear-gradient(180deg, #60a5fa, #8b5cf6)'
                          : 'linear-gradient(180deg, rgba(96,165,250,0.7), rgba(59,130,246,0.3))',
                      boxShadow: '0 8px 18px rgba(96, 165, 250, 0.25)',
                    }}
                  />
                  <span style={{ fontSize: 'clamp(0.5rem, 0.6vw, 0.7rem)', color: '#94a3b8' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Quick actions
                </div>
                <h2
                  style={{
                    margin: '8px 0 0',
                    fontSize: 'clamp(1.1rem, 1.4vw, 1.5rem)',
                    letterSpacing: '-0.05em',
                    color: '#f8fafc',
                  }}
                >
                  Uploads
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'rgba(15, 23, 42, 0.72)',
                      border: '1px solid rgba(148,163,184,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexWrap: 'wrap',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: `${action.color}22`,
                        color: action.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: '120px' }}>
                      <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: 'clamp(0.8rem, 0.85vw, 0.9rem)' }}>{action.label}</div>
                      <div style={{ color: '#94a3b8', fontSize: 'clamp(0.7rem, 0.75vw, 0.8rem)', marginTop: '2px' }}>
                        {action.detail}
                      </div>
                    </div>
                    <ArrowUpRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}