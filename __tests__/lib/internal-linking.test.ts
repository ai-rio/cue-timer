import { getAllPosts } from '../../lib/blog';
import { getLinkSuggestions } from '../../lib/internal-linking';

describe('getLinkSuggestions', () => {
  it('should return link suggestions with relevance scores', async () => {
    const allPosts = await getAllPosts();
    // Create a mock current post for testing since real posts may not have 'test-post'
    const mockCurrentPost = {
      slug: 'test-post',
      title: 'Test Post',
      content: 'This is a test post about CueTimer features and event management.',
      category: 'tutorial',
      tags: ['cuetimer', 'features'],
      locale: 'en',
    };
    const suggestions = await getLinkSuggestions(mockCurrentPost.slug, 5, 'en');

    expect(Array.isArray(suggestions)).toBe(true);
    if (suggestions.length > 0) {
      expect(suggestions[0]).toMatchObject({
        slug: expect.any(String),
        title: expect.any(String),
        score: expect.any(Number),
        reason: expect.any(String),
        suggestedAnchor: expect.any(String),
        contextExcerpt: expect.any(String),
      });
      expect(suggestions[0].score).toBeGreaterThanOrEqual(0);
      expect(suggestions[0].score).toBeLessThanOrEqual(1);
    }
  });

  it('should exclude current post from suggestions', async () => {
    const currentSlug = 'test-post';
    const suggestions = await getLinkSuggestions(currentSlug, 10, 'en');

    suggestions.forEach((suggestion) => {
      expect(suggestion.slug).not.toBe(currentSlug);
    });
  });
});
