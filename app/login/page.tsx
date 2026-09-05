'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSafePasswordInput, isValidEmail, sanitizeEmail, validateSafeFields } from '@/lib/security/input';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (adminData) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          router.replace('/dashboard');
        } else {
          await supabase.auth.signOut();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
        }
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const safeEmail = sanitizeEmail(email);
      const unsafeMessage = validateSafeFields({ Email: safeEmail });

      if (!isValidEmail(safeEmail) || unsafeMessage) {
        setError(unsafeMessage || 'Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (!isSafePasswordInput(password)) {
        setError('Please enter a valid password.');
        setLoading(false);
        return;
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password,
      });

      if (authError) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Check if user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role, full_name')
          .eq('id', authData.user.id)
          .single();

        if (adminError || !adminData) {
          // User exists but is not an admin - sign them out
          await supabase.auth.signOut();
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        // Store session info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', authData.user.email || safeEmail);
        localStorage.setItem('userRole', adminData.role);
        localStorage.setItem('userName', adminData.full_name || 'Admin');

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authData.user.id);

        // Redirect to dashboard
        router.replace('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fa',
        padding: '20px',
        position: 'relative',
      }}
    >
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
          background: 'white',
          color: '#1a1a2e',
          padding: '10px 14px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'white',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>
            Admin Login
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Sign in to manage your dashboard</p>
        </div>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
              required
              maxLength={254}
              placeholder="admin@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 128))}
              required
              maxLength={128}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            padding: '12px',
            background: '#f0f9ff',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1e40af',
          }}
        >
          <strong>Demo Credentials:</strong>
          <div>Email: admin@example.com</div>
          <div>Password: admin123</div>
        </div>
      </div>
    </div>
  );
}
