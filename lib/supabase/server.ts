import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

export async function createClient() {
  const cookieStore = await cookies();

  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value),
          },
          error: null,
        };
      },
    },
  };
}
