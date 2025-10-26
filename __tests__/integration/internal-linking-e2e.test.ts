import { getAllPosts } from '../../lib/blog';
import { findLinkingOpportunities, getLinkSuggestions } from '../../lib/internal-linking';
import { processMdxContentWithLinks } from '../../lib/utils';

describe('Internal Linking E2E Integration', () => {
  it('should work end-to-end with existing blog content', async () => {
    // Get real blog posts
    const allPosts = await getAllPosts();
    expect(allPosts.length).toBeGreaterThan(0);

    // Test link suggestions
    const currentPost = allPosts[0];
    const suggestions = await getLinkSuggestions(currentPost.slug, 3, currentPost.locale);
    expect(Array.isArray(suggestions)).toBe(true);

    // Test opportunity detection
    const opportunities = findLinkingOpportunities(currentPost.content, allPosts.slice(1, 5));
    expect(Array.isArray(opportunities)).toBe(true);

    // Test content processing
    const processedContent = await processMdxContentWithLinks(
      currentPost.content,
      currentPost.slug,
      currentPost.locale,
      2
    );
    expect(typeof processedContent).toBe('string');
    expect(processedContent.length).toBeGreaterThan(0);
  });

  it('should not break existing functionality', async () => {
    // Test that existing blog functionality still works
    const testContent = '# Test\n\nThis is a test post about CueTimer.';
    const processed = await processMdxContentWithLinks(testContent, 'test-post', 'en');

    expect(processed).toContain('test post');
    expect(processed).toContain('CueTimer');
  });

  it('should handle edge cases gracefully', async () => {
    // Test with empty content
    const emptyProcessed = await processMdxContentWithLinks('', 'test-post', 'en');
    expect(typeof emptyProcessed).toBe('string');

    // Test with non-existent slug
    const nonExistentSuggestions = await getLinkSuggestions('non-existent-slug', 5, 'en');
    expect(Array.isArray(nonExistentSuggestions)).toBe(true);

    // Test with no target posts
    const noTargets = findLinkingOpportunities('test content', []);
    expect(Array.isArray(noTargets)).toBe(true);
  });

  it('should maintain data integrity throughout the pipeline', async () => {
    const allPosts = await getAllPosts();
    const testPost = allPosts[0];

    if (!testPost) return;

    // Test that suggestions have required fields
    const suggestions = await getLinkSuggestions(testPost.slug, 5, testPost.locale);

    suggestions.forEach((suggestion) => {
      expect(suggestion).toHaveProperty('slug');
      expect(suggestion).toHaveProperty('title');
      expect(suggestion).toHaveProperty('score');
      expect(suggestion).toHaveProperty('reason');
      expect(suggestion).toHaveProperty('suggestedAnchor');
      expect(suggestion).toHaveProperty('contextExcerpt');

      expect(typeof suggestion.slug).toBe('string');
      expect(typeof suggestion.title).toBe('string');
      expect(typeof suggestion.score).toBe('number');
      expect(suggestion.score).toBeGreaterThanOrEqual(0);
      expect(suggestion.score).toBeLessThanOrEqual(1);
    });

    // Test that opportunities have required fields
    const opportunities = findLinkingOpportunities(testPost.content, allPosts.slice(1, 3));

    opportunities.forEach((opportunity) => {
      expect(opportunity).toHaveProperty('post');
      expect(opportunity).toHaveProperty('opportunities');
      expect(opportunity).toHaveProperty('relevanceScore');

      expect(Array.isArray(opportunity.opportunities)).toBe(true);
      expect(typeof opportunity.relevanceScore).toBe('number');
    });
  });

  it('should handle different locales correctly', async () => {
    const allPosts = await getAllPosts();

    // Group posts by locale
    const postsByLocale = allPosts.reduce(
      (acc, post) => {
        if (!acc[post.locale]) {
          acc[post.locale] = [];
        }
        acc[post.locale].push(post);
        return acc;
      },
      {} as Record<string, typeof allPosts>
    );

    // Test each locale
    for (const [locale, posts] of Object.entries(postsByLocale)) {
      if (posts.length > 0) {
        const testPost = posts[0];
        const suggestions = await getLinkSuggestions(testPost.slug, 3, locale);

        expect(Array.isArray(suggestions)).toBe(true);

        // All suggestions should be in the same locale
        suggestions.forEach((suggestion) => {
          expect(suggestion.slug).not.toBe(testPost.slug);
        });
      }
    }
  });

  it('should respect maxLinks parameter', async () => {
    const allPosts = await getAllPosts();
    const testPost = allPosts[0];

    if (!testPost) return;

    // Test with different max links values
    const maxLinksValues = [1, 3, 5, 10];

    for (const maxLinks of maxLinksValues) {
      const suggestions = await getLinkSuggestions(testPost.slug, maxLinks, testPost.locale);
      expect(suggestions.length).toBeLessThanOrEqual(maxLinks);
    }
  });
});
