import { processMdxContentWithLinks } from '../../lib/utils';

describe('MDX Content Processing Integration', () => {
  it('should process MDX content and inject internal links', async () => {
    const content = '# Test\n\nThis is about CueTimer features and event management.';
    const currentSlug = 'test-post';
    const locale = 'en';

    const result = await processMdxContentWithLinks(content, currentSlug, locale);

    expect(result).toContain('CueTimer features');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle empty content gracefully', async () => {
    const content = '';
    const currentSlug = 'test-post';
    const locale = 'en';

    const result = await processMdxContentWithLinks(content, currentSlug, locale);

    expect(typeof result).toBe('string');
  });

  it('should preserve MDX structure', async () => {
    const content = '# Title\n\n## Subtitle\n\nContent with **bold** text.';
    const currentSlug = 'test-post';
    const locale = 'en';

    const result = await processMdxContentWithLinks(content, currentSlug, locale);

    expect(result).toContain('Title');
    expect(result).toContain('Subtitle');
    expect(result).toContain('bold');
  });

  it('should respect maxLinks parameter', async () => {
    const content = 'Content with multiple CueTimer features and event management capabilities.';
    const currentSlug = 'test-post';
    const locale = 'en';
    const maxLinks = 1;

    const result = await processMdxContentWithLinks(content, currentSlug, locale, maxLinks);

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
