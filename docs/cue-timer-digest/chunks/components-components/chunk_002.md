# Chunk 2: components_components

## Metadata

- **Files**: 5
- **Size**: 14,233 characters (~3,558 tokens)
- **Categories**: components

## Files in this chunk

- `components/ErrorBoundary.tsx`
- `components/LanguageSwitcher.tsx`
- `components/Navigation.tsx`
- `components/TailwindTest.tsx`
- `components/theme-toggle.tsx`

---

## File: `components/ErrorBoundary.tsx`

```tsx
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} reset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  reset,
}: {
  error?: Error;
  reset: () => void;
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
        <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full'>
          <svg
            className='w-6 h-6 text-red-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h2 className='mt-4 text-center text-xl font-semibold text-gray-900'>
          Something went wrong
        </h2>
        <p className='mt-2 text-center text-gray-600'>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <div className='mt-6'>
          <button
            onClick={reset}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
```

## File: `components/LanguageSwitcher.tsx`

```tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt-br', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'toggle' | 'compact';
}

export default function LanguageSwitcher({
  className = '',
  variant = 'dropdown',
}: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Remove the current locale from pathname and add the new one
      const newPathname =
        pathname?.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
      router.push(newPathname);
    });
  };

  if (variant === 'toggle') {
    const otherLocale = locale === 'en' ? 'pt-br' : 'en';
    const otherLocaleData = locales.find((l) => l.code === otherLocale);

    return (
      <button
        onClick={() => handleLanguageChange(otherLocale)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={`Switch to ${otherLocaleData?.name}`}
        suppressHydrationWarning
      >
        <span className='text-lg'>{otherLocaleData?.flag}</span>
        <span className='hidden sm:inline'>{otherLocaleData?.name}</span>
      </button>
    );
  }

  if (variant === 'compact') {
    const currentLocaleData = locales.find((l) => l.code === locale);

    return (
      <button
        onClick={() => handleLanguageChange(locale === 'en' ? 'pt-br' : 'en')}
        disabled={isPending}
        className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={`Current language: ${currentLocaleData?.name}. Click to switch.`}
        suppressHydrationWarning
      >
        <span className='text-lg'>{currentLocaleData?.flag}</span>
      </button>
    );
  }

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      suppressHydrationWarning={true}
    >
      <select
        className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm leading-5 text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isPending}
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.name}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg
          className='fill-current h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
        </svg>
      </div>
    </div>
  );
}
```

## File: `components/Navigation.tsx`

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import LanguageSwitcher from './LanguageSwitcher';
import { ThemeToggle } from './theme-toggle';

export default function Navigation() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(`${path}/`) || false;

  // Define static navigation links to prevent hydration issues
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  // Fallback translations to prevent hydration mismatch
  const fallbackText = {
    login: mounted ? t('navigation.login') : 'Login',
    getStarted: mounted ? t('navigation.getStarted') : 'Get Started',
  };

  return (
    <nav className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-xl font-bold text-foreground'>
              CueTimer
            </Link>
          </div>

          {/* Main Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-8'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            <LanguageSwitcher />

            <Link
              href='/login'
              className='text-sm font-medium text-foreground hover:text-primary'
            >
              {fallbackText.login}
            </Link>

            <Link
              href='/pricing'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            >
              {fallbackText.getStarted}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu - Language switcher for mobile */}
      <div className='md:hidden border-t border-border px-4 py-2'>
        <div className='flex justify-between items-center'>
          <div className='flex space-x-2'>
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className='flex items-center space-x-2'>
            <ThemeToggle />
            <LanguageSwitcher variant='compact' />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

## File: `components/TailwindTest.tsx`

```tsx
export default function TailwindTest() {
  return (
    <div className='min-h-screen bg-red-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-blue-600 mb-6'>
          Tailwind CSS Test
        </h1>

        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Basic Colors
          </h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-red-500 text-white p-4 rounded'>Red 500</div>
            <div className='bg-blue-500 text-white p-4 rounded'>Blue 500</div>
            <div className='bg-green-500 text-white p-4 rounded'>Green 500</div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Layout Classes
          </h2>
          <div className='flex flex-wrap gap-2 mb-4'>
            <span className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm'>
              Flex
            </span>
            <span className='px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm'>
              Flex Wrap
            </span>
            <span className='px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm'>
              Gap
            </span>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='bg-gray-100 p-4 text-center rounded'>1</div>
            <div className='bg-gray-200 p-4 text-center rounded'>2</div>
            <div className='bg-gray-300 p-4 text-center rounded'>3</div>
            <div className='bg-gray-400 p-4 text-center rounded text-white'>
              4
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            Spacing & Typography
          </h2>
          <p className='text-lg text-gray-600 mb-2'>
            Large text with margin bottom
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            Small text with different color
          </p>
          <div className='border-2 border-dashed border-gray-300 p-4 rounded'>
            <p className='font-mono text-xs'>
              Dashed border with monospace font
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File: `components/theme-toggle.tsx`

```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className='inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200'
        aria-label='Toggle theme'
        suppressHydrationWarning
      >
        <div className='h-5 w-5' />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className='inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200 relative group'
      aria-label='Toggle theme'
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className='relative overflow-hidden'>
        <div
          className={`transition-all duration-300 transform ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0 absolute'}`}
        >
          <Sun className='h-5 w-5' />
        </div>
        <div
          className={`transition-all duration-300 transform ${theme === 'dark' ? '-rotate-90 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'}`}
        >
          <Moon className='h-5 w-5' />
        </div>
      </div>
      <span className='sr-only'>
        {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
}
```
