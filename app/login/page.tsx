'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const alreadyLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (alreadyLoggedIn) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      router.replace('/dashboard');
      return;
    }

    setError('Invalid email or password. Please use the admin credentials provided below.');
    setLoading(false);
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 15%, white) 0%, #ffffff 55%, color-mix(in srgb, var(--theme-secondary) 18%, white) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(15, 39, 74, 0.14)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, white)',
          background: '#ffffff',
        }}
      >
        <section
          style={{
            background: 'linear-gradient(160deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
            padding: '48px 40px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.22)',
                fontSize: '20px',
              }}
            >
              ✦
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.04em' }}>
              <span>Spark</span>
              <span style={{ color: '#dfeafb' }}>Well</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
            Admin access
          </div>

          <h1 style={{ margin: '18px 0 12px', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.05em' }}>
            Welcome back
          </h1>

          <p style={{ margin: 0, maxWidth: '420px', fontSize: '1rem', lineHeight: 1.7, opacity: 0.9 }}>
            Manage bookings, customer updates, service quality, and daily operations from your SparkWell dashboard.
          </p>

          <div style={{ marginTop: '28px', display: 'grid', gap: '14px' }}>
            {['Booking overview', 'Customer communication', 'Service quality tracking'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.95 }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    background: '#d4ebff',
                    boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.12)',
                  }}
                />
                <span style={{ fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: '#ffffff', padding: '42px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--theme-primary)' }}>
                Sign in
              </p>
              <h2 style={{ margin: '10px 0 0', fontSize: '2rem', letterSpacing: '-0.04em', color: 'var(--theme-text)' }}>
                Admin dashboard
              </h2>
            </div>

            {error && (
              <div
                style={{
                  background: '#fff1f2',
                  color: '#b42318',
                  border: '1px solid #fecdd3',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  fontSize: '0.92rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--theme-text)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid color-mix(in srgb, var(--theme-primary) 18%, white)',
                    background: '#f8fafc',
                    color: 'var(--theme-text)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--theme-text)' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="admin123"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid color-mix(in srgb, var(--theme-primary) 18%, white)',
                    background: '#f8fafc',
                    color: 'var(--theme-text)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  boxShadow: '0 12px 24px rgba(26, 58, 107, 0.22)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div
              style={{
                marginTop: '22px',
                background: '#f0f9ff',
                border: '1px solid #dbeafe',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#174176',
              }}
            >
              <strong>Demo admin login:</strong>
              <div>Email: admin@example.com</div>
              <div>Password: admin123</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
