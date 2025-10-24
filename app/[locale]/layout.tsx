import '../globals.css';

import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import { AuthProvider } from '@/contexts/AuthContext';

// Configure Inter (Primary Font) - Design System Requirement
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'], // Regular, Medium, Semibold, Bold
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Configure Space Grotesk (Timer Display) - Design System Requirement
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-timer',
  weight: ['400', '500', '700'], // Regular, Medium, Bold
  display: 'swap',
  preload: true,
  fallback: ['Inter', 'system-ui', 'sans-serif'],
});

// Configure JetBrains Mono (Technical Elements) - Design System Requirement
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'], // Regular weight for monospace
  display: 'swap',
  preload: true,
  fallback: ['Consolas', 'Monaco', 'monospace'],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'pt-br', 'es', 'fr', 'de'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cue-timer-theme') || 'light'
                document.documentElement.classList.add(theme)
              } catch {}
            `,
          }}
        />
        <ErrorBoundary>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange={false}
            storageKey='cue-timer-theme'
          >
            <NextIntlClientProvider messages={messages}>
              <AuthProvider>
                <div className='min-h-screen bg-background text-foreground'>
                  <Navigation />
                  <main>{children}</main>
                </div>
              </AuthProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pt-br' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
  ];
}
