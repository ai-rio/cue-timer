# Chunk 15: components_root

## Metadata

- **Files**: 2
- **Size**: 8,168 characters (~2,042 tokens)
- **Categories**: components

## Files in this chunk

- `components.json`
- `mdx-components.tsx`

---

## File: `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## File: `mdx-components.tsx`

```tsx
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Custom MDX components using shadcn/ui
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Heading styles with anchor links
    h1: ({ children, ...props }) => (
      <h1
        className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2'
        id={children?.toString().toLowerCase().replace(/\s+/g, '-')}
        {...props}
      >
        <a
          href={`#${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
          className='hover:text-primary'
        >
          {children}
        </a>
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className='scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6'
        id={children?.toString().toLowerCase().replace(/\s+/g, '-')}
        {...props}
      >
        <a
          href={`#${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
          className='hover:text-primary'
        >
          {children}
        </a>
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className='scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4'
        id={children?.toString().toLowerCase().replace(/\s+/g, '-')}
        {...props}
      >
        <a
          href={`#${children?.toString().toLowerCase().replace(/\s+/g, '-')}`}
          className='hover:text-primary'
        >
          {children}
        </a>
      </h4>
    ),

    // Text elements
    p: ({ children, ...props }) => (
      <p className='leading-7 [&:not(:first-child)]:mt-6 text-base' {...props}>
        {children}
      </p>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul className='my-6 ml-6 list-disc [&>li]:mt-2' {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className='my-6 ml-6 list-decimal [&>li]:mt-2' {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className='leading-7' {...props}>
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className='mt-6 border-l-2 pl-6 italic text-muted-foreground'
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code elements
    code: ({ className, children, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono'
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code
          className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono ${className}`}
          {...props}
        >
          {children}
        </code>
      );
    },

    pre: ({ children, ...props }) => (
      <pre className='mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4 text-white'>
        <code className='block px-4 text-sm' {...props}>
          {children}
        </code>
      </pre>
    ),

    // Links
    a: ({ children, href, ...props }) => (
      <a
        className='text-primary underline-offset-4 hover:underline'
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Tables
    table: ({ children, ...props }) => (
      <div className='my-6 w-full overflow-y-auto'>
        <table className='w-full border-collapse border-spacing-0' {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className='[&_tr]:border-b' {...props}>
        {children}
      </thead>
    ),

    tbody: ({ children, ...props }) => (
      <tbody className='[&_tr:last-child]:border-0' {...props}>
        {children}
      </tbody>
    ),

    tr: ({ children, ...props }) => (
      <tr
        className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
        {...props}
      >
        {children}
      </tr>
    ),

    th: ({ children, ...props }) => (
      <th
        className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0' {...props}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: ({ ...props }) => <hr className='my-4 border-0 border-t' {...props} />,

    // Images
    img: ({ src, alt, ...props }) => (
      <Image
        className='rounded-lg border shadow-md w-full max-w-2xl mx-auto my-6'
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        {...props}
      />
    ),

    // Custom components for special content types
    // Info cards
    InfoCard: ({
      title,
      children,
      ...props
    }: {
      title: string;
      children: React.ReactNode;
    }) => (
      <Card className='my-6 border-blue-200 bg-blue-50/50' {...props}>
        <CardHeader>
          <CardTitle className='text-blue-800'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='text-blue-700'>{children}</CardContent>
      </Card>
    ),

    // Tip cards
    TipCard: ({ children, ...props }: { children: React.ReactNode }) => (
      <Card className='my-6 border-green-200 bg-green-50/50' {...props}>
        <CardHeader>
          <CardTitle className='text-green-800 text-lg'>💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent className='text-green-700'>{children}</CardContent>
      </Card>
    ),

    // Warning cards
    WarningCard: ({ children, ...props }: { children: React.ReactNode }) => (
      <Card className='my-6 border-yellow-200 bg-yellow-50/50' {...props}>
        <CardHeader>
          <CardTitle className='text-yellow-800 text-lg'>
            ⚠️ Important
          </CardTitle>
        </CardHeader>
        <CardContent className='text-yellow-700'>{children}</CardContent>
      </Card>
    ),

    // Badge for tags or categories
    Tag: ({ children, ...props }: { children: React.ReactNode }) => (
      <Badge variant='secondary' className='mr-2 mb-2' {...props}>
        {children}
      </Badge>
    ),

    // Custom callout component
    Callout: ({
      type,
      children,
      ...props
    }: {
      type: 'info' | 'warning' | 'error' | 'success';
      children: React.ReactNode;
    }) => {
      const typeStyles = {
        info: 'border-blue-200 bg-blue-50/50 text-blue-800',
        warning: 'border-yellow-200 bg-yellow-50/50 text-yellow-800',
        error: 'border-red-200 bg-red-50/50 text-red-800',
        success: 'border-green-200 bg-green-50/50 text-green-800',
      };

      const typeIcons = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        success: '✅',
      };

      return (
        <Card className={`my-6 ${typeStyles[type]}`} {...props}>
          <CardContent className='pt-6'>
            <div className='flex items-start space-x-3'>
              <span className='text-xl'>{typeIcons[type]}</span>
              <div className='flex-1'>{children}</div>
            </div>
          </CardContent>
        </Card>
      );
    },

    // Pass through any custom components
    ...components,
  };
}
```
