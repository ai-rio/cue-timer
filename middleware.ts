import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt-br', 'es', 'fr', 'de'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Always show locale prefix to avoid conflicts with root layout
  localePrefix: 'always',

  // Optional: Detect locale from user preferences
  localeDetection: true,
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Required for Next.js development
    "style-src 'self' 'unsafe-inline'", // Required for Tailwind
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co", // WebSocket support for real-time timer sync
    "frame-src 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Skip all internal paths (_next) and API routes
    '/((?!_next|api|favicon.ico).*)',
  ],
};
