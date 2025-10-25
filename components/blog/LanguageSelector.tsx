'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  isRTL?: boolean;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  availableLanguages: string[];
  onLanguageChange: (language: string) => void;
  showFlag?: boolean;
  compact?: boolean;
  variant?: 'dropdown' | 'popover';
  className?: string;
}

// Language configurations
const LANGUAGE_CONFIGS: Record<string, LanguageOption> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  'pt-br': {
    code: 'pt-br',
    name: 'Português',
    flag: '🇧🇷',
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
  },
  ja: {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
  },
  'zh-cn': {
    code: 'zh-cn',
    name: '简体中文',
    flag: '🇨🇳',
  },
};

interface TranslationStatus {
  language: string;
  status: 'complete' | 'in-progress' | 'missing' | 'outdated';
  wordCount?: number;
  lastUpdated?: string;
  translator?: string;
}

interface LanguageStatusProps {
  currentSlug: string;
  availableTranslations: TranslationStatus[];
  onLanguageSelect: (language: string) => void;
  className?: string;
}

function LanguageStatus({
  currentSlug: _currentSlug,
  availableTranslations,
  onLanguageSelect,
  className = '',
}: LanguageStatusProps) {
  const currentLanguage = availableTranslations.find((t) => t.language === 'en')?.language || 'en';

  const getStatusColor = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outdated':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'complete':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'outdated':
        return '⚠️';
      case 'missing':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='flex items-center gap-2 mb-3'>
        <Globe className='h-5 w-5' />
        <h3 className='font-semibold'>Available Languages</h3>
        <Badge variant='secondary' className='ml-2'>
          {availableTranslations.length} languages
        </Badge>
      </div>

      <div className='grid gap-3'>
        {availableTranslations.map((translation) => {
          const config = LANGUAGE_CONFIGS[translation.language] || LANGUAGE_CONFIGS['en']!;
          const isActive = translation.language === currentLanguage;

          return (
            <div
              key={translation.language}
              className={`border rounded-lg p-4 cursor-pointer transition-colors hover:border-primary ${
                isActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onLanguageSelect(translation.language)}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{config?.flag || ''}</span>
                  <span className='font-medium'>{config?.name || ''}</span>
                  {isActive && <Check className='h-4 w-4 text-primary ml-2' />}
                </div>

                <Badge
                  variant='outline'
                  className={`text-xs ${getStatusColor(translation.status)}`}
                >
                  <span className='mr-1'>{getStatusIcon(translation.status)}</span>
                  {translation.status.replace('-', ' ')}
                </Badge>
              </div>

              {/* Translation details */}
              <div className='text-sm text-muted-foreground space-y-1'>
                {translation.wordCount && <p>{translation.wordCount.toLocaleString()} words</p>}
                {translation.lastUpdated && (
                  <p>Updated {new Date(translation.lastUpdated).toLocaleDateString()}</p>
                )}
                {translation.translator && <p>Translated by {translation.translator}</p>}
              </div>

              {/* Translation action button */}
              {isActive && (
                <div className='mt-3'>
                  <Button size='sm' variant='outline' className='w-full'>
                    View {config.name} Version
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LanguageSelector({
  currentLanguage,
  availableLanguages,
  onLanguageChange,
  showFlag = true,
  compact = false,
  variant = 'dropdown',
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = useMemo(
    () => LANGUAGE_CONFIGS[currentLanguage] || LANGUAGE_CONFIGS['en']!,
    [currentLanguage]
  );

  const availableConfigs = useMemo(
    () =>
      availableLanguages
        .map((lang) => LANGUAGE_CONFIGS[lang])
        .filter((config): config is NonNullable<typeof config> => Boolean(config)),
    [availableLanguages]
  );

  if (compact) {
    return (
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 ${className}`}
      >
        {showFlag && <span>{currentConfig?.flag || ''}</span>}
        <span>{currentConfig?.name || ''}</span>
        <ChevronDown className='h-4 w-4' />
      </Button>
    );
  }

  if (variant === 'popover') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' className={`flex items-center gap-2 ${className}`}>
            {showFlag && <span>{currentConfig?.flag || ''}</span>}
            <span>{currentConfig?.name || ''}</span>
            <ChevronDown className='h-4 w-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-56 p-0'>
          <div className='max-h-96 overflow-y-auto'>
            {availableConfigs.map((config) => (
              <button
                key={config.code}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors ${
                  config.code === currentLanguage ? 'bg-accent' : ''
                }`}
                onClick={() => {
                  onLanguageChange(config.code);
                  setIsOpen(false);
                }}
              >
                <span className='text-lg'>{config?.flag || ''}</span>
                <span>{config?.name || ''}</span>
                {config.code === currentLanguage && (
                  <Check className='h-4 w-4 ml-auto text-primary' />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Dropdown variant (default)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className={`flex items-center gap-2 ${className}`}>
          {showFlag && <span>{currentConfig?.flag || ''}</span>}
          <span>{currentConfig?.name || ''}</span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        {availableConfigs.map((config) => (
          <DropdownMenuItem
            key={config.code}
            onClick={() => {
              onLanguageChange(config.code);
              setIsOpen(false);
            }}
            className='flex items-center gap-3 cursor-pointer'
          >
            <span className='text-lg'>{config?.flag || ''}</span>
            <span>{config?.name || ''}</span>
            {config.code === currentLanguage && <Check className='h-4 w-4 ml-auto text-primary' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export language status component for detailed language views
export { LanguageStatus };

// Export language configurations for use in other components
export { LANGUAGE_CONFIGS };
export type { LanguageOption, TranslationStatus };
