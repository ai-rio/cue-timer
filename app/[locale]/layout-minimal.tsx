import '../globals.css';

import { JetBrains_Mono, Plus_Jakarta_Sans, Source_Serif_4 } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// Configure Plus Jakarta Sans (Body & UI) - Optimized with fewer weights
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600'], // Reduced from 4 to 2 weights for better performance
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Configure Source Serif 4 (Headers & Emphasis) - Optimized
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '700'], // Reduced from 3 to 2 weights
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

// Configure JetBrains Mono (Code & Data) - Load on demand
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400'], // Single weight for monospace
  display: 'swap',
  preload: false, // Load only when needed
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
      className={`scroll-smooth ${jakarta.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${jakarta.className} antialiased`}>
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
        <NextIntlClientProvider messages={messages}>
          <div className='min-h-screen bg-background text-foreground'>
            <main>{children}</main>
          </div>
        </NextIntlClientProvider>
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
