import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import Navigation from '@/components/Navigation';
import { AuthProvider } from '@/contexts/AuthContext';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'pt-br', 'es', 'fr', 'de'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
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
            <div className='min-h-screen bg-background text-foreground' suppressHydrationWarning>
              <Navigation />
              <main>{children}</main>
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
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
