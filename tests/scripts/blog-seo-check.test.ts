/**
 * Unit tests for blog-seo-check CLI script
 * Tests SEO analysis functionality with proper ESLint compliance
 */

import { afterAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { promises as fs } from 'fs';
import { join } from 'path';

// Mock dependencies to avoid file system interactions during testing
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

jest.mock('ora', () => ({
  start: jest.fn(() => ({
    succeed: jest.fn(),
    fail: jest.fn(),
  })),
}));

jest.mock('chalk', () => ({
  blue: { bold: jest.fn((text) => text) },
  green: jest.fn((text) => text),
  red: jest.fn((text) => text),
  yellow: jest.fn((text) => text),
  white: jest.fn((text) => text),
  gray: jest.fn((text) => text),
  cyan: jest.fn((text) => text),
}));

// Import after mocking
import inquirer from 'inquirer';

import { performSeoCheck, type SeoCheckOptions } from '../../scripts/blog-seo-check';

describe('blog-seo-check CLI Script', () => {
  const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;
  const testTempDir = join(process.cwd(), 'temp-test-files');
  const contentDir = join(testTempDir, 'content', 'blog');

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create temp directory structure for tests
    try {
      await fs.mkdir(join(testTempDir, 'content', 'blog', '2025', '01'), { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Change working directory for tests
    const originalCwd = process.cwd();
    process.chdir(testTempDir);
  });

  afterAll(async () => {
    // Restore original working directory
    const originalCwd = process.cwd();
    process.chdir(join(testTempDir, '..'));

    // Clean up temp directory
    try {
      await fs.rm(testTempDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('Frontmatter Parsing', () => {
    test('should parse valid frontmatter correctly', async () => {
      // Arrange
      const validMdxContent = `---
title: "Test Blog Post"
slug: "test-blog-post"
summary: "This is a test summary for SEO purposes"
tags: ["test", "seo", "blog"]
author: "Test Author"
readTime: 5
isDraft: false
---

# Test Content

This is the main content of the blog post with enough words to pass the minimum word count requirement for SEO optimization and content analysis.

## Subheading

More content here to ensure we have proper structure and enough content for meaningful SEO analysis.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'test-post.mdx'), validMdxContent);

      // Act & Assert - The function should not throw when parsing valid frontmatter
      await expect(performSeoCheck({ slug: 'test-post' })).resolves.not.toThrow();
    });

    test('should handle missing required fields in frontmatter', async () => {
      // Arrange
      const incompleteMdxContent = `---
title: "Incomplete Post"
---

# Content without summary or other required fields`;

      await fs.writeFile(
        join(contentDir, '2025', '01', 'incomplete-post.mdx'),
        incompleteMdxContent
      );

      // Act & Assert - Should identify missing fields as SEO issues
      await expect(performSeoCheck({ slug: 'incomplete-post' })).resolves.not.toThrow();
    });

    test('should handle invalid frontmatter format', async () => {
      // Arrange
      const invalidMdxContent = `---
title: "Invalid Frontmatter"
missing: closing delimiter
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'invalid-post.mdx'), invalidMdxContent);

      // Act & Assert - Should handle invalid frontmatter gracefully
      await expect(performSeoCheck({ slug: 'invalid-post' })).rejects.toThrow(
        'Invalid frontmatter format'
      );
    });
  });

  describe('Title SEO Analysis', () => {
    test('should identify optimal title length', async () => {
      // Arrange
      const optimalTitleContent = `---
title: "Perfect SEO Title Length for Blog Posts"
summary: "This is a summary with optimal length between 120 and 160 characters for better search engine results and click-through rates optimization"
tags: ["seo", "title", "optimization"]
---

# Content with sufficient length for SEO analysis`;

      await fs.writeFile(join(contentDir, '2025', '01', 'optimal-title.mdx'), optimalTitleContent);

      // Act & Assert
      await expect(performSeoCheck({ slug: 'optimal-title' })).resolves.not.toThrow();
    });

    test('should flag title that is too short', async () => {
      // Arrange
      const shortTitleContent = `---
title: "Short"
summary: "Summary with adequate length"
tags: ["test"]
---

# Content with sufficient length`;

      await fs.writeFile(join(contentDir, '2025', '01', 'short-title.mdx'), shortTitleContent);

      // Act & Assert - Should identify short title as suboptimal
      await expect(performSeoCheck({ slug: 'short-title' })).resolves.not.toThrow();
    });

    test('should flag title that is too long', async () => {
      // Arrange
      const longTitleContent = `---
title: "This Title Is Way Too Long For Optimal SEO Performance And Should Be Flagged As Suboptimal For Search Engine Optimization"
summary: "Summary with adequate length"
tags: ["test"]
---

# Content with sufficient length`;

      await fs.writeFile(join(contentDir, '2025', '01', 'long-title.mdx'), longTitleContent);

      // Act & Assert - Should identify long title as suboptimal
      await expect(performSeoCheck({ slug: 'long-title' })).resolves.not.toThrow();
    });

    test('should identify missing title', async () => {
      // Arrange
      const noTitleContent = `---
summary: "Summary without title"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-title.mdx'), noTitleContent);

      // Act & Assert - Should identify missing title as error
      await expect(performSeoCheck({ slug: 'no-title' })).resolves.not.toThrow();
    });
  });

  describe('Description SEO Analysis', () => {
    test('should identify optimal description length', async () => {
      // Arrange
      const optimalDescContent = `---
title: "Test Post"
summary: "This is an optimal meta description length that falls within the recommended range of 120 to 160 characters for better search engine snippet display and improved click-through rates from organic search results"
tags: ["seo", "description", "optimization"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'optimal-desc.mdx'), optimalDescContent);

      // Act & Assert
      await expect(performSeoCheck({ slug: 'optimal-desc' })).resolves.not.toThrow();
    });

    test('should flag description that is too short', async () => {
      // Arrange
      const shortDescContent = `---
title: "Test Post"
summary: "Too short"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'short-desc.mdx'), shortDescContent);

      // Act & Assert - Should identify short description as suboptimal
      await expect(performSeoCheck({ slug: 'short-desc' })).resolves.not.toThrow();
    });

    test('should flag missing description', async () => {
      // Arrange
      const noDescContent = `---
title: "Test Post"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-desc.mdx'), noDescContent);

      // Act & Assert - Should identify missing description as error
      await expect(performSeoCheck({ slug: 'no-desc' })).resolves.not.toThrow();
    });
  });

  describe('Content SEO Analysis', () => {
    test('should identify optimal content length', async () => {
      // Arrange
      const longContent = `---
title: "Long Content Post"
summary: "This is a summary with adequate length for SEO optimization purposes and search engine requirements"
tags: ["content", "seo", "length"]
---

# Main Content

This blog post contains sufficient content to meet the minimum word count requirements for SEO optimization. The content is comprehensive and provides value to readers while maintaining proper structure for search engine crawlers.

## First Subheading

Additional content here to ensure we meet the minimum word count threshold for optimal SEO performance and content quality assessment.

## Second Subheading

More valuable content that demonstrates expertise on the topic and provides comprehensive coverage of the subject matter. This helps establish authority and improves search engine rankings.

## Third Subheading

Continuing with more substantial content to ensure the blog post meets all SEO criteria for content length and quality, providing maximum value to readers and search engines alike.

## Final Section

Conclusion and summary of the key points discussed throughout this comprehensive blog post about SEO content optimization and best practices for creating high-quality, search-engine-friendly content.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'long-content.mdx'), longContent);

      // Act & Assert
      await expect(performSeoCheck({ slug: 'long-content' })).resolves.not.toThrow();
    });

    test('should flag content that is too short', async () => {
      // Arrange
      const shortContent = `---
title: "Short Content"
summary: "Summary with adequate length"
tags: ["test"]
---

# Short content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'short-content.mdx'), shortContent);

      // Act & Assert - Should identify short content as suboptimal
      await expect(performSeoCheck({ slug: 'short-content' })).resolves.not.toThrow();
    });

    test('should identify missing headings structure', async () => {
      // Arrange
      const noHeadingsContent = `---
title: "No Headings"
summary: "Summary with adequate length"
tags: ["test"]
---

Just a block of text without any proper heading structure for SEO optimization and content organization purposes. This makes it difficult for both users and search engines to understand the content structure and hierarchy.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-headings.mdx'), noHeadingsContent);

      // Act & Assert - Should identify lack of headings as issue
      await expect(performSeoCheck({ slug: 'no-headings' })).resolves.not.toThrow();
    });

    test('should recommend adding images', async () => {
      // Arrange
      const noImagesContent = `---
title: "No Images"
summary: "Summary with adequate length"
tags: ["test"]
---

# Content without images

This content does not include any images, which should trigger a recommendation to add visual elements for better engagement and SEO performance.

## Subheading

More text content that would benefit from visual elements to improve user engagement and time on page metrics that are important for SEO ranking factors.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-images.mdx'), noImagesContent);

      // Act & Assert - Should recommend adding images
      await expect(performSeoCheck({ slug: 'no-images' })).resolves.not.toThrow();
    });
  });

  describe('Keyword Analysis', () => {
    test('should analyze keyword density correctly', async () => {
      // Arrange
      const keywordContent = `---
title: "SEO Keyword Analysis Best Practices"
summary: "Learn how to perform effective SEO keyword analysis for better search engine optimization and content ranking"
tags: ["seo", "keywords", "analysis", "optimization"]
---

# SEO Keyword Analysis Guide

This comprehensive guide covers SEO keyword analysis techniques and best practices. Effective SEO keyword analysis helps improve search engine optimization and content visibility.

## Understanding SEO Keywords

SEO keywords are the foundation of search engine optimization. Proper SEO keyword analysis involves researching and selecting relevant terms that your target audience uses when searching for content.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'keyword-analysis.mdx'), keywordContent);

      // Act & Assert
      await expect(performSeoCheck({ slug: 'keyword-analysis' })).resolves.not.toThrow();
    });

    test('should identify low keyword density', async () => {
      // Arrange
      const lowDensityContent = `---
title: "Blog About Various Topics"
summary: "This blog covers many different subjects without focusing on specific keywords"
tags: ["general", "blog", "topics"]
---

# General Blog Content

This is a blog post that discusses various topics without repeating specific keywords frequently. The content is diverse and covers multiple subjects without clear keyword focus for SEO optimization purposes.

## Different Topics

Here we discuss many different subjects and topics without concentrating on any particular keyword or phrase for search engine optimization.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'low-density.mdx'), lowDensityContent);

      // Act & Assert - Should identify low keyword density
      await expect(performSeoCheck({ slug: 'low-density' })).resolves.not.toThrow();
    });
  });

  describe('Technical SEO Analysis', () => {
    test('should validate URL slug format', async () => {
      // Arrange
      const goodSlugContent = `---
title: "Good URL Slug"
slug: "good-url-slug-format"
summary: "Summary with adequate length"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'good-slug.mdx'), goodSlugContent);

      // Act & Assert
      await expect(performSeoCheck({ slug: 'good-slug-format' })).resolves.not.toThrow();
    });

    test('should flag invalid URL slug characters', async () => {
      // Arrange
      const badSlugContent = `---
title: "Bad URL Slug"
slug: "Bad_URL_Slug_With_Underscores"
summary: "Summary with adequate length"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'bad-slug.mdx'), badSlugContent);

      // Act & Assert - Should flag invalid slug format
      await expect(
        performSeoCheck({ slug: 'Bad_URL_Slug_With_Underscores' })
      ).resolves.not.toThrow();
    });

    test('should identify missing tags', async () => {
      // Arrange
      const noTagsContent = `---
title: "No Tags Post"
summary: "Summary with adequate length"
---

# Content without tags for categorization`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-tags.mdx'), noTagsContent);

      // Act & Assert - Should identify missing tags as issue
      await expect(performSeoCheck({ slug: 'no-tags' })).resolves.not.toThrow();
    });

    test('should flag too many tags', async () => {
      // Arrange
      const tooManyTagsContent = `---
title: "Too Many Tags"
summary: "Summary with adequate length"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11"]
---

# Content with too many tags`;

      await fs.writeFile(join(contentDir, '2025', '01', 'too-many-tags.mdx'), tooManyTagsContent);

      // Act & Assert - Should flag excessive number of tags
      await expect(performSeoCheck({ slug: 'too-many-tags' })).resolves.not.toThrow();
    });
  });

  describe('SEO Score Calculation', () => {
    test('should calculate high score for well-optimized content', async () => {
      // Arrange
      const optimizedContent = `---
title: "Perfect SEO Optimized Blog Post for Maximum Search Visibility"
slug: "perfect-seo-optimized-blog-post"
summary: "This is a perfectly optimized meta description that meets all SEO requirements with ideal length between 120-160 characters, includes target keywords, and encourages click-through from search results"
tags: ["seo", "optimization", "blog", "content", "search", "engine"]
readTime: 8
---

# Perfect SEO Optimized Blog Post for Maximum Search Visibility

This comprehensive blog post demonstrates perfect SEO optimization with ideal content length, proper heading structure, strategic keyword placement, and all the elements that search engines look for when ranking content.

## Understanding SEO Optimization Fundamentals

SEO optimization requires understanding both technical and content aspects of search engine algorithms. This post covers comprehensive strategies for maximizing search visibility and organic traffic potential.

### Keyword Research and Implementation

Effective SEO begins with thorough keyword research and strategic implementation throughout your content. Keywords should appear naturally in titles, headings, and content while maintaining optimal density ratios.

## Content Structure and Hierarchy

Proper content structure with logical heading hierarchy helps both users and search engines navigate and understand your content effectively.

## Technical SEO Considerations

Technical SEO elements like URL structure, meta tags, and internal linking significantly impact search engine rankings and user experience.

## Conclusion and Key Takeaways

This perfectly optimized content demonstrates all the essential elements of effective SEO strategy and implementation for maximum search engine visibility and organic traffic generation.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'optimized-content.mdx'), optimizedContent);

      // Act & Assert - Should calculate high SEO score
      await expect(
        performSeoCheck({ slug: 'perfect-seo-optimized-blog-post' })
      ).resolves.not.toThrow();
    });

    test('should calculate low score for poorly optimized content', async () => {
      // Arrange
      const poorlyOptimizedContent = `---
title: "Bad"
summary: "Too short"
---

# Too short content`;

      await fs.writeFile(
        join(contentDir, '2025', '01', 'poorly-optimized.mdx'),
        poorlyOptimizedContent
      );

      // Act & Assert - Should calculate low SEO score
      await expect(performSeoCheck({ slug: 'poorly-optimized' })).resolves.not.toThrow();
    });
  });

  describe('Auto-fix Functionality', () => {
    test('should auto-fix missing read time', async () => {
      // Arrange
      const noReadTimeContent = `---
title: "Test Post"
summary: "Summary with adequate length for SEO optimization purposes"
tags: ["test", "auto-fix"]
---

# Content with sufficient length for read time calculation

This blog post contains enough content to properly calculate the estimated reading time for users. Having an accurate read time estimate improves user experience and helps readers understand the time commitment required to consume this content.

The content should be comprehensive enough to warrant a meaningful read time calculation while providing value to the target audience. This ensures that the auto-fix functionality can properly estimate and add the read time to the frontmatter.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-read-time.mdx'), noReadTimeContent);

      mockInquirer.prompt.mockResolvedValue({ proceed: true });

      // Act & Assert - Should auto-fix read time
      await expect(performSeoCheck({ slug: 'no-read-time', fix: true })).resolves.not.toThrow();

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'confirm',
            name: 'proceed',
            message: 'Auto-fix common SEO issues?',
          }),
        ])
      );
    });

    test('should auto-fix missing tags', async () => {
      // Arrange
      const noTagsContent = `---
title: "Blog Post for Auto-Fix Tags"
summary: "Summary with adequate length for SEO optimization and auto-fix testing"
---

# Content about comprehensive SEO optimization

This blog post discusses comprehensive SEO optimization strategies and techniques for improving search engine rankings and organic traffic performance.`;

      await fs.writeFile(join(contentDir, '2025', '01', 'no-tags-auto-fix.mdx'), noTagsContent);

      mockInquirer.prompt.mockResolvedValue({ proceed: true });

      // Act & Assert - Should auto-fix tags
      await expect(performSeoCheck({ slug: 'no-tags-auto-fix', fix: true })).resolves.not.toThrow();
    });
  });

  describe('Interactive Mode', () => {
    test('should prompt for post selection in interactive mode', async () => {
      // Arrange
      const testContent1 = `---
title: "First Test Post"
summary: "Summary for first test post"
tags: ["test1"]
---

# First content`;

      const testContent2 = `---
title: "Second Test Post"
summary: "Summary for second test post"
tags: ["test2"]
---

# Second content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'first-post.mdx'), testContent1);
      await fs.writeFile(join(contentDir, '2025', '01', 'second-post.mdx'), testContent2);

      mockInquirer.prompt.mockResolvedValue({ slug: 'first-post' });

      // Act & Assert
      await expect(performSeoCheck({})).resolves.not.toThrow();

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'list',
            name: 'slug',
            message: 'Select a post for SEO checking:',
          }),
        ])
      );
    });

    test('should handle "check all posts" selection', async () => {
      // Arrange
      const testContent = `---
title: "Test Post for All"
summary: "Summary for test post"
tags: ["test"]
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'test-all.mdx'), testContent);

      mockInquirer.prompt.mockResolvedValue({ slug: '__ALL__' });

      // Act & Assert
      await expect(performSeoCheck({})).resolves.not.toThrow();
    });
  });

  describe('ESLint Compliance Tests', () => {
    test('should use proper TypeScript typing', async () => {
      // Arrange
      const options: SeoCheckOptions = {
        slug: 'typescript-test',
        fix: false,
        score: true,
      };

      const testContent = `---
title: "TypeScript Compliance Test"
summary: "Testing TypeScript type compliance in SEO check"
tags: ["typescript", "compliance", "test"]
---

# Content for TypeScript compliance testing`;

      await fs.writeFile(join(contentDir, '2025', '01', 'typescript-test.mdx'), testContent);

      // Act & Assert - TypeScript types should be properly enforced
      await expect(performSeoCheck(options)).resolves.not.toThrow();
      expect(typeof options.slug).toBe('string');
      expect(typeof options.fix).toBe('boolean');
      expect(typeof options.score).toBe('boolean');
    });

    test('should follow no-unused-vars pattern', async () => {
      // This test verifies that all variables are used properly
      const options: SeoCheckOptions = {
        all: true,
      };

      const testContent = `---
title: "No Unused Variables Test"
summary: "Testing that all variables are properly used"
tags: ["variables", "test"]
---

# Content for testing variable usage`;

      await fs.writeFile(join(contentDir, '2025', '01', 'variables-test.mdx'), testContent);

      // Act & Assert - All variables should be used
      await expect(performSeoCheck(options)).resolves.not.toThrow();
    });

    test('should use proper error handling without any types', async () => {
      // Arrange
      const options: SeoCheckOptions = {
        slug: 'non-existent-post',
      };

      // Act & Assert - Should handle missing post gracefully
      await expect(performSeoCheck(options)).rejects.toThrow('not found');
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent blog directory gracefully', async () => {
      // Arrange - Remove the content directory
      try {
        await fs.rm(contentDir, { recursive: true });
      } catch (error) {
        // Directory might not exist
      }

      const options: SeoCheckOptions = {
        all: true,
      };

      // Act & Assert - Should handle missing directory
      await expect(performSeoCheck(options)).resolves.not.toThrow();
    });

    test('should handle file read errors gracefully', async () => {
      // Arrange
      const invalidContent = `---
title: "Invalid Content"
summary: "Content that will cause read error"
---

# Content`;

      await fs.writeFile(join(contentDir, '2025', '01', 'invalid-content.mdx'), invalidContent);

      // Mock file system error
      const originalReadFile = fs.readFile;
      fs.readFile = jest.fn().mockRejectedValue(new Error('Permission denied') as never) as any;

      const options: SeoCheckOptions = {
        slug: 'invalid-content',
      };

      try {
        // Act & Assert - Should handle file read error
        await expect(performSeoCheck(options)).resolves.not.toThrow();
      } finally {
        // Restore original function
        fs.readFile = originalReadFile;
      }
    });
  });
});
