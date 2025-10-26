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

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`) || false;

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

            <Link href='/login' className='text-sm font-medium text-foreground hover:text-primary'>
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
