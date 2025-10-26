import { BlogPost, getAllPosts, getRelatedPosts } from './blog';
import { generateExcerpt } from './blog-utils';

export interface LinkSuggestion {
  slug: string;
  title: string;
  score: number;
  reason: 'semantic' | 'category' | 'tag' | 'keyword';
  suggestedAnchor: string;
  contextExcerpt: string;
}

export async function getLinkSuggestions(
  currentSlug: string,
  maxSuggestions: number = 5,
  _locale?: string
): Promise<LinkSuggestion[]> {
  const allPosts = await getAllPosts();
  const currentPost = allPosts.find((post) => post.slug === currentSlug);

  if (!currentPost) return [];

  // Leverage existing getRelatedPosts for base similarity
  const relatedPosts = await getRelatedPosts(currentPost, maxSuggestions * 2);

  const suggestions: LinkSuggestion[] = relatedPosts
    .filter((post) => post.slug !== currentSlug && post.locale === currentPost.locale)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      score: calculateLinkingScore(currentPost, post),
      reason: determineLinkReason(currentPost, post),
      suggestedAnchor: generateOptimalAnchor(currentPost.content, post),
      contextExcerpt: generateExcerpt(post.content, 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);

  return suggestions;
}

function calculateLinkingScore(source: BlogPost, target: BlogPost): number {
  // Build on existing category/tag matching from getRelatedPosts
  const categoryMatch = source.category === target.category ? 0.3 : 0;
  const tagMatches = source.tags.filter((tag: string) => target.tags.includes(tag)).length;
  const tagScore = Math.min(tagMatches * 0.1, 0.3);

  // Leverage existing similarity scoring
  const semanticScore = calculateContentSimilarity(source.content, target.content);
  const keywordScore = calculateKeywordOverlap(source, target);

  return Math.min(categoryMatch + tagScore + semanticScore + keywordScore, 1.0);
}

function determineLinkReason(source: BlogPost, target: BlogPost): LinkSuggestion['reason'] {
  if (source.category === target.category) return 'category';
  if (source.tags.some((tag: string) => target.tags.includes(tag))) return 'tag';
  if (calculateKeywordOverlap(source, target) > 0.1) return 'keyword';
  return 'semantic';
}

function generateOptimalAnchor(sourceContent: string, targetPost: BlogPost): string {
  // Simple anchor generation - use target post title words
  return targetPost.title.toLowerCase().split(' ').slice(0, 3).join(' ');
}

function calculateKeywordOverlap(source: BlogPost, target: BlogPost): number {
  // Simple keyword overlap calculation
  const sourceWords = source.content.toLowerCase().split(/\s+/);
  const targetWords = target.content.toLowerCase().split(/\s+/);
  const sourceSet = new Set(sourceWords);
  const targetSet = new Set(targetWords);

  const intersection = new Set([...sourceSet].filter((x) => targetSet.has(x)));
  return intersection.size / Math.max(sourceSet.size, targetSet.size);
}

function calculateContentSimilarity(content1: string, content2: string): number {
  // Simple similarity based on common words
  const words1 = content1.toLowerCase().split(/\s+/);
  const words2 = content2.toLowerCase().split(/\s+/);
  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}
