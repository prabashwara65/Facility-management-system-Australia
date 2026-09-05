import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/postgres/server';
import { createSessionToken, SESSION_COOKIE, type AdminSessionUser } from '@/lib/auth/session';
import { sanitizeEmail } from '@/lib/security/input';

type AdminRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  password_hash: string | null;
  is_active: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = sanitizeEmail(body.email || '');
    const password = body.password || '';

    const result = await query<AdminRow>(
      'SELECT id, email, full_name, role, password_hash, is_active FROM admin_users WHERE email = $1 LIMIT 1',
      [email]
    );
    const admin = result.rows[0];

    if (!admin?.is_active || !admin.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [admin.id]);

    const user: AdminSessionUser = {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      role: admin.role,
    };
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('[auth-login] failed', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
