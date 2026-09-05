import { createHmac, timingSafeEqual } from 'crypto';

export type AdminSessionUser = {
  id: string;
  email: string;
  role: string;
  full_name?: string | null;
};

const SESSION_COOKIE = 'admin_session';

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || process.env.DATABASE_URL || 'local-dev-secret';
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createSessionToken(user: AdminSessionUser) {
  const payload = base64UrlEncode(JSON.stringify({ ...user, iat: Date.now() }));
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string | null): AdminSessionUser | null {
  if (!token) return null;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as AdminSessionUser;
    if (!decoded.id || !decoded.email) return null;
    return decoded;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
