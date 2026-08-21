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
  Phone,
  Mail,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  UserCheck,
  Tag,
  Leaf,
  Plane,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  totalFAQs: number;
  popularTier: string;
}

interface PromiseStats {
  total: number;
  active: number;
}

interface TestimonialStats {
  total: number;
  active: number;
  fiveStar: number;
}

interface AreaStats {
  total: number;
  active: number;
  regions: number;
}

export default function HomeContent() {
  const [loading, setLoading] = useState(true);
  
  // Stats
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
    totalFAQs: 0,
    popularTier: '',
  });
  const [promiseStats, setPromiseStats] = useState<PromiseStats>({
    total: 0,
    active: 0,
  });
  const [testimonialStats, setTestimonialStats] = useState<TestimonialStats>({
    total: 0,
    active: 0,
    fiveStar: 0,
  });
  const [areaStats, setAreaStats] = useState<AreaStats>({
    total: 0,
    active: 0,
    regions: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

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
        const pending = bookingsData.filter(b => b.status === 'pending' || b.status === 'Pending').length;
        const confirmed = bookingsData.filter(b => b.status === 'confirmed' || b.status === 'Confirmed').length;
        const completed = bookingsData.filter(b => b.status === 'completed' || b.status === 'Completed').length;
        const cancelled = bookingsData.filter(b => b.status === 'cancelled' || b.status === 'Cancelled').length;
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
        const sorted = [...bookingsData].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentBookings(sorted.slice(0, 5));
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
          active: servicesData.filter(s => s.status === 'Active' || s.is_active === true).length,
        });
      }

      // 3. Load pricing stats
      const { data: tiersData, error: tiersError } = await supabase
        .from('pricing_tiers')
        .select('*');

      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*');

      if (!tiersError && tiersData) {
        const popular = tiersData.find(t => t.is_popular === true);
        setPricingStats({
          totalTiers: tiersData.length,
          totalFAQs: faqsData?.length || 0,
          popularTier: popular?.label || 'None',
        });
      }

      // 4. Load promise stats
      const { data: promisesData, error: promisesError } = await supabase
        .from('promise_features')
        .select('*');

      if (!promisesError && promisesData) {
        setPromiseStats({
          total: promisesData.length,
          active: promisesData.filter(p => p.status === 'Active').length,
        });
      }

      // 5. Load testimonial stats
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*');

      if (!testimonialsError && testimonialsData) {
        setTestimonialStats({
          total: testimonialsData.length,
          active: testimonialsData.filter(t => t.status === 'Active').length,
          fiveStar: testimonialsData.filter(t => t.rating === 5).length,
        });
      }

      // 6. Load service areas stats
      const { data: areasData, error: areasError } = await supabase
        .from('service_areas')
        .select('*');

      if (!areasError && areasData) {
        const regions = [...new Set(areasData.map(a => a.region))];
        setAreaStats({
          total: areasData.length,
          active: areasData.filter(a => a.status === 'Active').length,
          regions: regions.length,
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

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'pending') return '#f59e0b';
    if (s === 'confirmed') return '#3b82f6';
    if (s === 'completed') return '#10b981';
    if (s === 'cancelled') return '#ef4444';
    return '#94a3b8';
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

  // Main stat cards
  const mainStats = [
    { label: 'Total Bookings', value: bookingStats.total, icon: FileText, color: '#8b5cf6' },
    { label: 'Pending', value: bookingStats.pending, icon: Clock, color: '#f59e0b' },
    { label: 'Completed', value: bookingStats.completed, icon: CheckCircle, color: '#10b981' },
    { label: 'Revenue', value: `$${bookingStats.revenue.toLocaleString()}`, icon: DollarSign, color: '#3b82f6' },
  ];

  // Category stats
  const categoryStats = [
    { label: 'Services', value: serviceStats.total, icon: Package, color: '#3b82f6' },
    { label: 'Pricing Tiers', value: pricingStats.totalTiers, icon: DollarSign, color: '#8b5cf6' },
    { label: 'Promise Features', value: promiseStats.total, icon: ShieldCheck, color: '#10b981' },
    { label: 'Testimonials', value: testimonialStats.total, icon: Star, color: '#f59e0b' },
    { label: 'Service Areas', value: areaStats.total, icon: MapPin, color: '#ef4444' },
    { label: 'FAQs', value: pricingStats.totalFAQs, icon: HelpCircle, color: '#06b6d4' },
  ];

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Overview Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.92), rgba(17,24,39,0.95))',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px',
          boxShadow: '0 20px 55px rgba(2, 6, 23, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Dashboard Overview
            </div>
            <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(1.5rem, 3vw, 3rem)', lineHeight: 1.05, letterSpacing: '-0.07em', color: '#f8fafc' }}>
              Welcome Back
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              border: '1px solid rgba(148,163,184,0.18)',
              background: 'rgba(59,130,246,0.12)',
              color: '#dbeafe',
              borderRadius: '12px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Main Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {mainStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(15, 23, 42, 0.72)',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: '20px',
                  padding: '18px 20px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: `${stat.color}22`,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {stat.label}
                    </div>
                    <div style={{ color: '#f8fafc', fontSize: 'clamp(1.2rem, 1.8vw, 1.8rem)', fontWeight: 700 }}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Stats */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Content Overview
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
            All Categories
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {categoryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
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
                  <div style={{ color: '#94a3b8', fontSize: '0.6rem', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {/* Recent Bookings */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Recent Activity
              </div>
              <h2 style={{ margin: '8px 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                Recent Bookings
              </h2>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{bookingStats.total} total</span>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: 'rgba(15, 23, 42, 0.72)',
                    border: '1px solid rgba(148,163,184,0.08)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {booking.first_name} {booking.last_name}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {booking.service_type}
                        </span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '2px 10px',
                            borderRadius: '10px',
                            color: getStatusColor(booking.status),
                            background: `${getStatusColor(booking.status)}22`,
                          }}
                        >
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>
                      ${booking.total_price || 0}
                    </div>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '4px', paddingLeft: '44px' }}>
                    {formatDate(booking.preferred_date)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '30px 0' }}>
                No bookings yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Service Areas Quick View */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Service Areas
                </div>
                <h2 style={{ margin: '8px 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  Coverage
                </h2>
              </div>
              <MapPin size={20} color="#3b82f6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(15,23,42,0.5)', borderRadius: '12px' }}>
                <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>{areaStats.total}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Suburbs</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(15,23,42,0.5)', borderRadius: '12px' }}>
                <div style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>{areaStats.active}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Active</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(15,23,42,0.5)', borderRadius: '12px' }}>
                <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>{areaStats.regions}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Regions</div>
              </div>
            </div>
          </div>

          {/* Testimonials & Promise Quick View */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Testimonials */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Star size={16} color="#f59e0b" />
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Testimonials</span>
                </div>
                <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>{testimonialStats.total}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span style={{ color: '#10b981', fontSize: '0.75rem' }}>✓ {testimonialStats.active} active</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>★ {testimonialStats.fiveStar} 5-star</span>
                </div>
              </div>

              {/* Promise Features */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase' }}>Promises</span>
                </div>
                <div style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 700 }}>{promiseStats.total}</div>
                <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '4px' }}>
                  ✓ {promiseStats.active} active
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Popular Tier</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600 }}>{pricingStats.popularTier || 'None'}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Pricing Tiers</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600 }}>{pricingStats.totalTiers}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>FAQs</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600 }}>{pricingStats.totalFAQs}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Stats */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Service Details
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
            Service Breakdown
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', background: 'rgba(15,23,42,0.5)', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700 }}>{serviceStats.total}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Total Services</div>
          </div>
          <div style={{ padding: '14px', background: 'rgba(15,23,42,0.5)', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ color: '#3b82f6', fontSize: '1.3rem', fontWeight: 700 }}>{serviceStats.residential}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Residential</div>
          </div>
          <div style={{ padding: '14px', background: 'rgba(15,23,42,0.5)', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ color: '#8b5cf6', fontSize: '1.3rem', fontWeight: 700 }}>{serviceStats.commercial}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Commercial</div>
          </div>
          <div style={{ padding: '14px', background: 'rgba(15,23,42,0.5)', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 700 }}>{serviceStats.active}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>Active</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}