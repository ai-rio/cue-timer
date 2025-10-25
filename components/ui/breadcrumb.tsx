// import { useTranslations } from 'next-intl';

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  className?: string;
}

export function Breadcrumb({ children, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}
    >
      {children}
    </nav>
  );
}

export function BreadcrumbItem({ children, className = '' }: BreadcrumbItemProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {children}
      <svg
        className='w-4 h-4 text-gray-400 mx-2'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
      </svg>
    </div>
  );
}

export function BreadcrumbPage({ children, className = '' }: BreadcrumbPageProps) {
  // const t = useTranslations('Common');

  return (
    <span className={`font-medium text-gray-900 ${className}`} aria-current='page'>
      {children}
    </span>
  );
}
