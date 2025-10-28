'use client';

import { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export default function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const lang = language || className?.replace('language-', '') || 'text';

  const handleCopy = async () => {
    const codeText =
      typeof children === 'object' && children && 'props' in children
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (children as any).props?.children || ''
        : String(children);

    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='mb-4 mt-6 overflow-x-auto rounded-lg border bg-black'>
      <div className='flex items-center justify-between px-4 py-2 text-sm text-gray-400 border-b border-gray-700'>
        <span className='font-mono'>{lang}</span>
        <button
          className='px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors'
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className='py-4 px-4 text-white overflow-x-auto'>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
