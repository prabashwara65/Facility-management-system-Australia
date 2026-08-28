'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomeContent from './components/HomeContent';
import ServicesContent from './components/pages/ServicesContent';
import PricingSection from './components/pages/PricingSection';
import PromiseContent from './components/pages/PromiseContent';
import TestimonialsContent from './components/pages/TestimonialsContent';
import ServiceAreasContent from './components/pages/ServiceAreasContent';
import BookingSection from './components/pages/BookingSection';
import MobileDetailing from './components/pages/MobileDetailing';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const supabase = createClient();

    const verifySession = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        router.replace('/login');
        return;
      }

      setUserEmail(user.email || '');
    };

    verifySession();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.replace('/login');
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <HomeContent />;
      case 'Services':
        return <ServicesContent />;
      case 'Pricing':
        return <PricingSection />;
      case 'Promise':
        return <PromiseContent />;
      case 'Testimonials':
        return <TestimonialsContent />;
      case 'ServiceAreas':
        return <ServiceAreasContent />;
      case 'Bookings':
        return <BookingSection />;
      case 'MobileDetailing':
        return <MobileDetailing />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, rgba(96, 165, 250, 0.16), transparent 30%), linear-gradient(135deg, #020817 0%, #0f172a 28%, #111827 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
        overflowX: 'hidden',
      }}
    >
      <div className="dashboard-frame" style={{ maxWidth: '1460px', margin: '0 auto', padding: '28px 20px 40px' }}>
        <div
          className="dashboard-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '260px minmax(0, 1fr)',
            gap: '20px',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <section className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
            <Navbar onLogout={handleLogout} userEmail={userEmail || 'admin@example.com'} activeTab={activeTab} />
            {renderContent()}
          </section>
        </div>
      </div>

      <style jsx global>{`
        .dashboard-content,
        .dashboard-content * {
          box-sizing: border-box;
        }

        .dashboard-content {
          max-width: 100%;
        }

        .dashboard-content input,
        .dashboard-content select,
        .dashboard-content textarea,
        .dashboard-content button {
          max-width: 100%;
        }

        @media (max-width: 1024px) {
          .dashboard-frame {
            padding: 16px 12px 28px !important;
          }

          .dashboard-layout {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 14px !important;
          }

          .dashboard-content {
            gap: 14px !important;
            min-width: 0 !important;
          }

          .dashboard-sidebar {
            position: sticky !important;
            top: 10px !important;
            z-index: 30 !important;
            min-width: 0 !important;
            padding: 12px !important;
            border-radius: 22px !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 12px !important;
            overflow-x: auto !important;
            scrollbar-width: none;
          }

          .dashboard-sidebar::-webkit-scrollbar {
            display: none;
          }

          .dashboard-sidebar > div {
            display: flex !important;
            min-width: max-content !important;
            align-items: center !important;
            gap: 10px !important;
          }

          .dashboard-sidebar-logo {
            margin-bottom: 0 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }

          .dashboard-sidebar-nav {
            display: flex !important;
            margin-top: 0 !important;
            align-items: center !important;
            gap: 8px !important;
          }

          .dashboard-sidebar-label,
          .dashboard-sidebar-active-marker {
            display: none !important;
          }

          .dashboard-sidebar-item {
            width: auto !important;
            flex: 0 0 auto !important;
            margin-bottom: 0 !important;
            padding: 10px 12px !important;
            white-space: nowrap !important;
          }

          .dashboard-topbar {
            padding: 14px !important;
            border-radius: 22px !important;
            flex-wrap: wrap !important;
            align-items: stretch !important;
          }

          .dashboard-topbar-title {
            flex: 1 1 auto !important;
            min-width: 0 !important;
          }

          .dashboard-topbar-search {
            order: 3 !important;
            flex: 1 1 100% !important;
            max-width: none !important;
          }

          .dashboard-topbar-actions {
            flex: 0 0 auto !important;
          }

          .dashboard-content > div {
            max-width: 100% !important;
          }

          .dashboard-content [style*="repeat(4, 1fr)"],
          .dashboard-content [style*="repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .dashboard-content [style*="minmax(350px"],
          .dashboard-content [style*="minmax(320px"],
          .dashboard-content [style*="minmax(280px"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .dashboard-content [style*="gridTemplateColumns: auto 1fr auto"],
          .dashboard-content [style*="grid-template-columns: auto 1fr auto"] {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }

        @media (max-width: 720px) {
          .dashboard-frame {
            padding: 10px 10px 24px !important;
          }

          .dashboard-content [style*="repeat(4, 1fr)"],
          .dashboard-content [style*="repeat(3, 1fr)"],
          .dashboard-content [style*="minmax(350px"],
          .dashboard-content [style*="minmax(320px"],
          .dashboard-content [style*="minmax(280px"],
          .dashboard-content [style*="1fr 1fr"] {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          .dashboard-content [style*="padding: 24px"],
          .dashboard-content [style*="padding: 32px"],
          .dashboard-content [style*="padding: 40px"],
          .dashboard-content [style*="padding: 60px"] {
            padding: 16px !important;
          }

          .dashboard-content [style*="border-radius: 30px"],
          .dashboard-content [style*="border-radius: 32px"] {
            border-radius: 20px !important;
          }

          .dashboard-content [style*="width: 200px"],
          .dashboard-content [style*="max-width: 400px"],
          .dashboard-content [style*="max-width: 420px"] {
            width: 100% !important;
            max-width: none !important;
          }

          .dashboard-content [style*="position: fixed"][style*="right: 20px"] {
            left: 10px !important;
            right: 10px !important;
            top: 10px !important;
            width: auto !important;
          }

          .dashboard-content [style*="white-space: nowrap"] {
            white-space: normal !important;
          }

          .dashboard-sidebar {
            top: 6px !important;
            padding: 10px !important;
            border-radius: 18px !important;
          }

          .dashboard-sidebar-logo .font-serif {
            display: none !important;
          }

          .dashboard-sidebar-item {
            gap: 0 !important;
            min-width: 42px !important;
            justify-content: center !important;
            padding: 10px !important;
          }

          .dashboard-sidebar-item-label {
            display: none !important;
          }

          .dashboard-topbar {
            gap: 10px !important;
            padding: 12px !important;
            border-radius: 18px !important;
          }

          .dashboard-topbar-title h2 {
            font-size: 1rem !important;
            letter-spacing: 0 !important;
          }

          .dashboard-topbar-title span {
            display: none !important;
          }

          .dashboard-topbar-actions {
            gap: 8px !important;
          }

          .dashboard-user-name,
          .dashboard-logout-label {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
