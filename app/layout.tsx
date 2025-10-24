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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className='font-sans antialiased'>{children}</body>
    </html>
  );
}
