import Link from 'next/link';
import React from 'react';

interface SmartLinkProps {
  href: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  isInternal?: boolean;
}

export function SmartLink({
  href,
  title,
  children,
  className = '',
  isInternal = false,
}: SmartLinkProps) {
  const linkClasses = `
    text-blue-600 hover:text-blue-800
    underline decoration-2 underline-offset-2
    hover:decoration-blue-400
    transition-colors duration-200
    ${isInternal ? 'font-medium' : ''}
    ${className}
  `.trim();

  if (isInternal || href.startsWith('/')) {
    return (
      <Link href={href} className={linkClasses} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={linkClasses} title={title} target='_blank' rel='noopener noreferrer'>
      {children}
    </a>
  );
}

export default SmartLink;
