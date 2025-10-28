import { getAllPosts } from '../../lib/blog';
import { findLinkingOpportunities } from '../../lib/internal-linking';

describe('findLinkingOpportunities', () => {
  it('should return opportunities array', async () => {
    const sourceContent = 'This is about CueTimer features and event management capabilities.';
    const allPosts = await getAllPosts();
    const opportunities = findLinkingOpportunities(sourceContent, allPosts);

    expect(Array.isArray(opportunities)).toBe(true);
  });

  it('should handle empty posts array', () => {
    const sourceContent = 'This is about CueTimer features.';
    const opportunities = findLinkingOpportunities(sourceContent, []);

    expect(opportunities).toEqual([]);
  });

  it('should return proper structure for each opportunity', async () => {
    const sourceContent = 'CueTimer event management timer productivity';
    const allPosts = await getAllPosts();
    const opportunities = findLinkingOpportunities(sourceContent, allPosts);

    opportunities.forEach((opportunity) => {
      expect(opportunity).toHaveProperty('post');
      expect(opportunity).toHaveProperty('opportunities');
      expect(opportunity).toHaveProperty('relevanceScore');
      expect(Array.isArray(opportunity.opportunities)).toBe(true);
      expect(typeof opportunity.relevanceScore).toBe('number');
      expect(opportunity.relevanceScore >= 0).toBe(true);
      expect(opportunity.relevanceScore <= 1).toBe(true);
    });
  });

  it('should find relevant opportunities', async () => {
    const sourceContent = 'event management and productivity tools';
    const allPosts = await getAllPosts();
    const opportunities = findLinkingOpportunities(sourceContent, allPosts);

    // Should find some opportunities since we have posts about event management and productivity
    expect(opportunities.length).toBeGreaterThan(0);

    // Check that at least one opportunity has linking contexts
    const hasValidOpportunities = opportunities.some(
      (opp) => Array.isArray(opp.opportunities) && opp.opportunities.length > 0
    );
    expect(hasValidOpportunities).toBe(true);
  });
});
