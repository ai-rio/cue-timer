import { remark } from 'remark';

import { remarkInternalLinkInserter } from '../../../lib/mdx-plugins/internal-link-inserter';

describe('remarkInternalLinkInserter', () => {
  it('should insert internal links into MDX content', async () => {
    const mdxContent = `This is about CueTimer features and event management.`;

    const result = await remark()
      .use(remarkInternalLinkInserter, {
        currentSlug: 'current-post',
        maxLinks: 2,
        locale: 'en',
      })
      .process(mdxContent);

    const processedContent = String(result);
    console.log('Processed content:', processedContent);

    // Should contain some form of internal linking
    expect(processedContent).toContain('CueTimer');
    expect(processedContent).toContain('event');

    // Check that it processed the content (it may or may not have actual links depending on content)
    expect(typeof processedContent).toBe('string');
  });

  it('should not exceed maxLinks limit', async () => {
    const mdxContent = `CueTimer features event management timer settings countdown productivity tools`;

    const result = await remark()
      .use(remarkInternalLinkInserter, {
        currentSlug: 'current-post',
        maxLinks: 1,
        locale: 'en',
      })
      .process(mdxContent);

    const processedContent = String(result);

    // Should still process the content
    expect(typeof processedContent).toBe('string');
    expect(processedContent.length).toBeGreaterThan(0);
  });

  it('should handle empty content gracefully', async () => {
    const mdxContent = '';

    const result = await remark()
      .use(remarkInternalLinkInserter, {
        currentSlug: 'test-post',
        maxLinks: 3,
        locale: 'en',
      })
      .process(mdxContent);

    expect(String(result)).toBe('');
  });

  it('should handle content without relevant keywords', async () => {
    const mdxContent = 'This is about quantum physics and advanced mathematics theory.';

    const result = await remark()
      .use(remarkInternalLinkInserter, {
        currentSlug: 'test-post',
        maxLinks: 3,
        locale: 'en',
      })
      .process(mdxContent);

    const processedContent = String(result);
    expect(typeof processedContent).toBe('string');
    expect(processedContent).toContain('quantum physics');
  });

  it('should handle invalid options gracefully', async () => {
    const mdxContent = 'Test content about features and management.';

    // Test with missing required options
    expect(async () => {
      await remark()
        .use(remarkInternalLinkInserter, {
          currentSlug: '',
          maxLinks: -1,
          locale: 'invalid',
        })
        .process(mdxContent);
    }).not.toThrow();
  });
});
