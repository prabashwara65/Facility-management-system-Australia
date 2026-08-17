'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HomeContent from './components/HomeContent';
import ServicesContent from './components/pages/ServicesContent';
import PricingSection from './components/pages/PricingSection';
import PromiseContent from './components/pages/PromiseContent';
import TestimonialsContent from './components/pages/TestimonialsContent';
import ServiceAreasContent from './components/pages/ServiceAreasContent';
import BookingSection from './components/pages/BookingSection';


function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { isAuthorized: false, userEmail: '' };
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';

  return {
    isAuthorized: isLoggedIn,
    userEmail: isLoggedIn ? userEmail : '',
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [authState] = useState(getInitialAuthState);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!authState.isAuthorized) {
      router.replace('/login');
    }
  }, [authState.isAuthorized, router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
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
      default:
        return <HomeContent />;
    }
  };

  if (!authState.isAuthorized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          color: '#e2e8f0',
          background: '#020817',
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, rgba(96, 165, 250, 0.16), transparent 30%), linear-gradient(135deg, #020817 0%, #0f172a 28%, #111827 100%)',
        color: '#e2e8f0',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1460px', margin: '0 auto', padding: '28px 20px 40px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px minmax(0, 1fr)',
            gap: '20px',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Navbar onLogout={handleLogout} userEmail={authState.userEmail} activeTab={activeTab} />
            {renderContent()}
          </section>
        </div>
      </div>
    </main>
  );
}