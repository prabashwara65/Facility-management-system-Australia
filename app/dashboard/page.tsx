'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

  if (!authState.isAuthorized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          color: 'var(--theme-primary)',
          background: '#f8fafc',
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  const stats = [
    { label: 'Today bookings', value: '28' },
    { label: 'Active clients', value: '142' },
    { label: 'Avg. rating', value: '4.9/5' },
    { label: 'Re-cleans', value: '6' },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)',
        color: 'var(--theme-text)',
      }}
    >
      <header
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--theme-primary)',
              color: '#ffffff',
              fontSize: '20px',
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.04em' }}>
              <span style={{ color: 'var(--theme-primary)' }}>Spark</span>
              <span style={{ color: 'var(--theme-secondary)' }}>Well</span>
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b' }}>
              Admin portal
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            border: 'none',
            borderRadius: '999px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 18px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 20px 40px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
            borderRadius: '28px',
            padding: '32px 28px',
            color: '#ffffff',
            boxShadow: '0 20px 45px rgba(26, 58, 107, 0.18)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.82 }}>
                Dashboard
              </div>
              <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(2rem, 3vw, 3rem)', letterSpacing: '-0.06em' }}>
                Welcome back
              </h1>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '0.9rem',
              }}
            >
              Logged in as <strong>{authState.userEmail}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginTop: '24px' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, white)',
                padding: '22px 20px',
                boxShadow: '0 10px 24px rgba(15, 39, 74, 0.05)',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
              <div style={{ marginTop: '12px', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--theme-primary)' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '22px',
              border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, white)',
              padding: '22px',
              boxShadow: '0 12px 28px rgba(15, 39, 74, 0.05)',
            }}
          >
            <h2 style={{ margin: '0 0 18px', fontSize: '1.35rem', letterSpacing: '-0.04em' }}>Latest tasks</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                'Confirm Saturday deep clean for 12 Apple Lane',
                'Send quote approval to the North Melbourne client',
                'Review 3 new booking enquiries from this week',
              ].map((task, index) => (
                <div
                  key={task}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: index % 2 === 0 ? '#f8fbff' : '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: index === 0 ? '#22c55e' : index === 1 ? '#f59e0b' : '#3b82f6',
                    }}
                  />
                  <span style={{ fontWeight: 500 }}>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: '#ffffff',
              borderRadius: '22px',
              border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, white)',
              padding: '22px',
              boxShadow: '0 12px 28px rgba(15, 39, 74, 0.05)',
            }}
          >
            <h2 style={{ margin: '0 0 18px', fontSize: '1.35rem', letterSpacing: '-0.04em' }}>Quick notes</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f0fdf4', color: '#166534' }}>
                12 jobs scheduled this week with a 96% on-time completion rate.
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8' }}>
                Customer satisfaction remains strong after the recent service update.
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#fff7ed', color: '#9a4d00' }}>
                Two follow-up inspections are due before Thursday.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
