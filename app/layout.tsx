import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CueTimer - Professional Event Management Timer',
  description:
    "Professional timing that works when technology doesn't. Offline-first countdown timer for events, presentations, and conferences.",
  keywords: ['timer', 'presentation', 'events', 'conference', 'countdown', 'offline'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
