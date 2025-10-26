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

  // Basic markdown to HTML conversion
  processedContent = processedContent
    .replace(
      /^# (.*$)/gim,
      '<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">$1</h1>'
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4 mt-8 border-b pb-2">$1</h2>'
    )
    .replace(
      /^### (.*$)/gim,
      '<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 mt-6">$1</h3>'
    )
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
