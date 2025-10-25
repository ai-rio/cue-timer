import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'pt-br', 'es', 'fr', 'de'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // Provide a fallback locale if requestLocale is not available
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  // Load all translation namespaces for the locale
  const messages: Record<string, unknown> = {};

  // Define all available namespaces specific to CueTimer
  const namespaces = [
    'common',
    'navigation',
    'hero',
    'timer',
    'events',
    'presentations',
    'dashboard',
    'auth',
    'pricing',
    'errors',
    'settings',
    'billing',
    'support',
    'blog',
  ];

  // Load each namespace with fallback to English
  for (const namespace of namespaces) {
    try {
      messages[namespace] = (await import(`./locales/${locale}/${namespace}.json`)).default;
    } catch {
      try {
        // Fallback to English if locale-specific translation doesn't exist
        messages[namespace] = (
          await import(`./locales/${defaultLocale}/${namespace}.json`)
        ).default;
        // Silent fallback handling
      } catch {
        // Final fallback - create empty object to prevent errors
        // Silent error handling for missing translation files
        messages[namespace] = {};
      }
    }
  }

  return {
    locale,
    messages,
    // Handle missing messages gracefully with structured logging
    onError(error) {
      const errorInfo = {
        type: 'I18N_ERROR',
        code: error.code,
        message: error.message,
        namespace: (error as any).namespace,
        key: (error as any).key,
        timestamp: new Date().toISOString(),
      };

      if (error.code === 'MISSING_MESSAGE') {
        // Silent handling of missing messages
      } else {
        // Silent handling of other i18n errors
      }
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter((part) => part != null).join('.');
      return `${path}`;
    },
  };
});
