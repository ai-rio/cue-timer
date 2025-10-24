import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/auth/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, locale = 'en' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/auth/callback`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
      return NextResponse.json(
        { error: 'Failed to send magic link. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent successfully',
    });
  } catch (error) {
    console.error('Magic link route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
