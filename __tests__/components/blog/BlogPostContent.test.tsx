import { render } from '@testing-library/react';

import BlogPostContent from '@/components/blog/BlogPostContent';

describe('BlogPostContent with Internal Links', () => {
  it('should render blog post content with internal links enabled', async () => {
    const content = 'This is about CueTimer features.';
    const currentSlug = 'test-post';
    const locale = 'en';

    // Mock the MDXServerRenderer and InternalLinkInjector to avoid dependency issues
    jest.mock('@/components/blog/MDXServerRenderer', () => ({
      default: ({ content }: { content: string }) => <div data-testid='mdx-content'>{content}</div>,
    }));

    jest.mock('@/components/blog/InternalLinkInjector', () => ({
      InternalLinkInjector: ({ content }: { content: string }) => (
        <div data-testid='internal-link-content'>{content}</div>
      ),
    }));

    const BlogPostContentWithProps = () => (
      <BlogPostContent
        content={content}
        enableInternalLinks={true}
        currentSlug={currentSlug}
        locale={locale}
      />
    );

    const { container } = render(await BlogPostContentWithProps());

    expect(container.textContent).toContain('CueTimer features');
  });

  it('should render blog post content without internal links', async () => {
    const content = 'This is about CueTimer features.';

    // Mock the MDXServerRenderer to avoid dependency issues
    jest.mock('@/components/blog/MDXServerRenderer', () => ({
      default: ({ content }: { content: string }) => <div data-testid='mdx-content'>{content}</div>,
    }));

    const BlogPostContentWithProps = () => <BlogPostContent content={content} />;

    const { container } = render(await BlogPostContentWithProps());

    expect(container.textContent).toContain('CueTimer features');
  });

  it('should handle maxInternalLinks parameter', async () => {
    const content = 'Content with multiple CueTimer features and event management.';
    const currentSlug = 'test-post';
    const locale = 'en';

    // Mock the InternalLinkInjector to avoid dependency issues
    jest.mock('@/components/blog/InternalLinkInjector', () => ({
      InternalLinkInjector: ({ content }: { content: string }) => (
        <div data-testid='internal-link-content'>{content}</div>
      ),
    }));

    const BlogPostContentWithProps = () => (
      <BlogPostContent
        content={content}
        enableInternalLinks={true}
        currentSlug={currentSlug}
        locale={locale}
        maxInternalLinks={2}
      />
    );

    const { container } = render(await BlogPostContentWithProps());

    expect(container.textContent).toContain('CueTimer features');
  });
});
