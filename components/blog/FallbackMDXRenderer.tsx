import { generateSlug } from '@/lib/utils';

import BlogErrorBoundary, { MDXErrorFallback } from './BlogErrorBoundary';

interface FallbackMDXRendererProps {
  content: string;
}

// Server Component for processing markdown without MDX
export default async function FallbackMDXRenderer({ content }: FallbackMDXRendererProps) {
  // Simple markdown processing for basic formatting
  let processedContent = content;

  // Remove frontmatter if it exists
  processedContent = processedContent.replace(/^---[\s\S]*?---\n/, '');

  // Basic markdown to HTML conversion with proper ID generation
  processedContent = processedContent
    .replace(/^# (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h1 id="${id}" class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">${text}</h1>`;
    })
    .replace(/^## (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h2 id="${id}" class="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2">${text}</h2>`;
    })
    .replace(/^### (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h3 id="${id}" class="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">${text}</h3>`;
    })
    .replace(/^#### (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h4 id="${id}" class="scroll-m-20 text-xl font-semibold tracking-tight mb-2 mt-4">${text}</h4>`;
    })
    .replace(/^##### (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h5 id="${id}" class="scroll-m-20 text-lg font-semibold tracking-tight mb-2 mt-3">${text}</h5>`;
    })
    .replace(/^###### (.*$)/gim, (match, text) => {
      const id = generateSlug(text);
      return `<h6 id="${id}" class="scroll-m-20 text-base font-semibold tracking-tight mb-2 mt-2">${text}</h6>`;
    })
    .replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em className="italic">$1</em>')
    .replace(/\n\n/g, '</p><p className="leading-7 [&:not(:first-child)]:mt-6 text-base">')
    .replace(/^/, '<p className="leading-7 [&:not(:first-child)]:mt-6 text-base">')
    .replace(/$/, '</p>');

  return (
    <BlogErrorBoundary fallback={MDXErrorFallback}>
      <div className='prose prose-gray max-w-none'>
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>
    </BlogErrorBoundary>
  );
}
