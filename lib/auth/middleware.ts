import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from './supabase';

interface User {
  id: string;
  email?: string;
  // Add other user properties as needed
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Auth middleware error:', error);
      return response;
    }

    if (session) {
      response.headers.set('x-user-id', session.user.id);
      response.headers.set('x-user-email', session.user.email || '');
    }
  } catch (error) {
    console.error('Unexpected auth middleware error:', error);
  }

  return response;
}

export function withAuth<T extends Record<string, unknown> = Record<string, unknown>>(
  handler: (req: NextRequest & { user?: User }) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return handler({ ...req, user } as unknown as NextRequest & { user: User });
    } catch (error) {
      console.error('Auth check error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
