'use client';

import { useMemo } from 'react';

interface MDXRendererProps {
  content: string;
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  const renderedContent = useMemo(() => {
    return processMarkdown(content);
  }, [content]);

  return (
    <div
      className='prose prose-gray max-w-none'
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}

// Enhanced markdown processor with better styling
function processMarkdown(markdown: string): string {
  let html = markdown;

  // Process custom components first
  html = processCustomComponents(html);

  // Headers with proper IDs and anchors
  html = html.replace(/^### (.*$)/gim, (match, content) => {
    const id = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h3 id="${id}" class="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">
      <a href="#${id}" class="hover:text-primary text-inherit no-underline">${content}</a>
    </h3>`;
  });

  html = html.replace(/^## (.*$)/gim, (match, content) => {
    const id = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h2 id="${id}" class="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2">
      <a href="#${id}" class="hover:text-primary text-inherit no-underline">${content}</a>
    </h2>`;
  });

  html = html.replace(/^# (.*$)/gim, (match, content) => {
    const id = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h1 id="${id}" class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
      <a href="#${id}" class="hover:text-primary text-inherit no-underline">${content}</a>
    </h1>`;
  });

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Inline code
  html = html.replace(
    /`([^`]*)`/g,
    '<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono">$1</code>'
  );

  // Links
  html = html.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    '<a href="$2" class="text-primary underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Lists
  html = html.replace(/^\* (.*)$/gim, '<li class="leading-7">$1</li>');
  html = html.replace(
    /(<li[\s\S]*?<\/li>)/g,
    '<ul class="my-6 ml-6 list-disc [&>li]:mt-2">$1</ul>'
  );

  html = html.replace(/^\d+\. (.*)$/gim, '<li class="leading-7">$1</li>');
  html = html.replace(
    /(<li[\s\S]*?<\/li>)/g,
    '<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">$1</ol>'
  );

  // Blockquotes
  html = html.replace(
    /^> (.*)$/gim,
    '<blockquote class="mt-6 border-l-2 pl-6 italic text-muted-foreground">$1</blockquote>'
  );

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-4 border-0 border-t">');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4 text-white">
      <code class="block px-4 text-sm ${lang ? `language-${lang}` : ''}">${escapeHtml(code.trim())}</code>
    </pre>`;
  });

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, src) => {
    return `<img src="${src}" alt="${alt || ''}" class="rounded-lg border shadow-md w-full max-w-2xl mx-auto my-6" loading="lazy" />`;
  });

  // Paragraphs (process last to avoid interfering with other elements)
  html = html.replace(/\n\n/g, '</p><p class="leading-7 [&:not(:first-child)]:mt-6 text-base">');
  html = `<p class="leading-7 [&:not(:first-child)]:mt-6 text-base">${html}</p>`;

  // Clean up any double tags
  html = html.replace(/<p[^>]*>\s*<(h[1-6]|ul|ol|blockquote|hr|pre)/g, '<$1');
  html = html.replace(/<\/(h[1-6]|ul|ol|blockquote|hr|pre)>\s*<\/p>/g, '</$1>');

  return html;
}

// Process custom markdown components
function processCustomComponents(markdown: string): string {
  let html = markdown;

  // Info cards: {{info:Title}}Content{{/info}}
  html = html.replace(/\{\{info:([^}]+)\}\}([\s\S]*?)\{\{\/info\}\}/g, (match, title, content) => {
    return `<div class="my-6">
      <div class="border border-blue-200 bg-blue-50/50 rounded-lg p-4">
        <h4 class="text-blue-800 font-semibold mb-2">${title}</h4>
        <div class="text-blue-700">${processMarkdown(content)}</div>
      </div>
    </div>`;
  });

  // Tip cards: {{tip}}Content{{/tip}}
  html = html.replace(/\{\{tip\}\}([\s\S]*?)\{\{\/tip\}\}/g, (match, content) => {
    return `<div class="my-6">
      <div class="border border-green-200 bg-green-50/50 rounded-lg p-4">
        <h4 class="text-green-800 font-semibold mb-2">💡 Pro Tip</h4>
        <div class="text-green-700">${processMarkdown(content)}</div>
      </div>
    </div>`;
  });

  // Warning cards: {{warning}}Content{{/warning}}
  html = html.replace(/\{\{warning\}\}([\s\S]*?)\{\{\/warning\}\}/g, (match, content) => {
    return `<div class="my-6">
      <div class="border border-yellow-200 bg-yellow-50/50 rounded-lg p-4">
        <h4 class="text-yellow-800 font-semibold mb-2">⚠️ Important</h4>
        <div class="text-yellow-700">${processMarkdown(content)}</div>
      </div>
    </div>`;
  });

  // Callouts: {{callout:type}}Content{{/callout}}
  html = html.replace(
    /\{\{callout:([^}]+)\}\}([\s\S]*?)\{\{\/callout\}\}/g,
    (match, type, content) => {
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

      const style = typeStyles[type as keyof typeof typeStyles] || typeStyles.info;
      const icon = typeIcons[type as keyof typeof typeIcons] || typeIcons.info;

      return `<div class="my-6">
      <div class="border ${style} rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <span class="text-xl">${icon}</span>
          <div class="flex-1">${processMarkdown(content)}</div>
        </div>
      </div>
    </div>`;
    }
  );

  // Tags: {{tag:label}}
  html = html.replace(/\{\{tag:([^}]+)\}\}/g, (match, label) => {
    return `<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mr-2 mb-2">#${label}</span>`;
  });

  return html;
}

// Utility function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m as keyof typeof map] || m);
}
