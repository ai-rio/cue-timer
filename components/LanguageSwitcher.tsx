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
      const newPathname = pathname?.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
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
    <div className={`relative inline-block text-left ${className}`} suppressHydrationWarning={true}>
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
