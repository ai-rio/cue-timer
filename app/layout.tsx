import './globals.css';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-timer',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CueTimer - Professional Event Management Timer',
  description:
    "Professional timing that works when technology doesn't. Offline-first countdown timer for events, presentations, and conferences.",
  keywords: ['timer', 'presentation', 'events', 'conference', 'countdown', 'offline'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CueTimer',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'CueTimer',
    title: 'CueTimer - Professional Event Management Timer',
    description:
      "Professional timing that works when technology doesn't. Offline-first countdown timer for events, presentations, and conferences.",
  },
  twitter: {
    card: 'summary',
    title: 'CueTimer - Professional Event Management Timer',
    description:
      "Professional timing that works when technology doesn't. Offline-first countdown timer for events, presentations, and conferences.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enhanced viewport and mobile optimization */}
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        {/* Apple and iOS optimization */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='CueTimer' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='application-name' content='CueTimer' />

        {/* Microsoft and Windows optimization */}
        <meta name='msapplication-TileColor' content='#ff6b35' />
        <meta name='msapplication-config' content='/browserconfig.xml' />

        {/* Theme and branding */}
        <meta name='theme-color' content='#ff6b35' />
        <meta name='msapplication-navbutton-color' content='#ff6b35' />
        <meta name='apple-mobile-web-app-status-bar-style' content='#ff6b35' />

        {/* Icons and favicons */}
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/icons/icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/icons/icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='128x128' href='/icons/icon-128x128.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/icons/icon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/icon-16x16.png' />
        <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#ff6b35' />

        {/* PWA manifest */}
        <link rel='manifest' href='/manifest.json' />

        {/* Prevent phone number detection */}
        <meta name='format-detection' content='telephone=no' />

        {/* Preload critical resources for mobile */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
      </head>
      <body
        className='font-sans antialiased bg-background text-foreground transition-colors duration-300'
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
