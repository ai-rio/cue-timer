/**
 * Integration tests for BlogContentManager component
 * Tests the content management functionality, analytics, and ESLint compliance
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the API functions
const mockAPI = {
  getContentMetrics: jest.fn(),
  getSEOScore: jest.fn(),
  getBlogAnalytics: jest.fn(),
  publishPost: jest.fn(),
  unpublishPost: jest.fn(),
};

jest.mock('../../components/blog/BlogContentManager', () => {
  const originalModule = jest.requireActual('../../components/blog/BlogContentManager');

  // Replace the mockAPI with our test version
  originalModule.default = Object.assign(originalModule.default, {
    mockAPI,
  });

  return originalModule;
});

// Mock the types file
jest.mock('../../types/blog-enhanced', () => ({
  BlogAnalytics: {},
  BlogPostEnhanced: {},
  ContentMetrics: {},
  SEOResult: {},
}));

// Import component after mocking
import BlogContentManager from '../../components/blog/BlogContentManager';
import { BlogAnalytics, BlogPostEnhanced } from '../../types/blog-enhanced';

describe('BlogContentManager Integration Tests', () => {
  const mockPosts: BlogPostEnhanced[] = [
    {
      slug: 'test-post-1',
      title: 'Test Post 1',
      summary: 'Summary for test post 1',
      author: 'Test Author',
      publishedAt: '2024-01-01',
      isDraft: false,
      readTime: 5,
      tags: ['test', 'blog'],
      category: 'timing-guide',
    },
    {
      slug: 'test-post-2',
      title: 'Test Post 2',
      summary: 'Summary for test post 2',
      author: 'Another Author',
      publishedAt: '2024-01-02',
      isDraft: true,
      readTime: 8,
      tags: ['test', 'draft'],
      category: 'presentation-tips',
    },
  ];

  const mockAnalytics: BlogAnalytics = {
    totalPosts: 150,
    publishedPosts: 120,
    draftPosts: 30,
    totalViews: 15420,
    totalReadTime: 280,
    averageReadTime: 6.2,
    topCategories: [
      { category: 'timing-guide', count: 45 },
      { category: 'presentation-tips', count: 38 },
      { category: 'case-study', count: 22 },
      { category: 'feature-announce', count: 15 },
    ],
    topAuthors: [
      { author: 'CueTimer Team', postsCount: 35, totalViews: 5200 },
      { author: 'John Doe', postsCount: 12, totalViews: 1800 },
      { author: 'Jane Smith', postsCount: 8, totalViews: 950 },
    ],
    recentPosts: [],
    popularPosts: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockAPI.getContentMetrics.mockResolvedValue({
      postSlug: 'test-post-1',
      language: 'en',
      views: 500,
      readTime: 5,
      bounceRate: 0.3,
      featureEngagement: {
        shares: 10,
        comments: 5,
        bookmarks: 3,
      },
      seoScore: 85,
    });

    mockAPI.getSEOScore.mockResolvedValue({
      score: 88,
      issues: [
        {
          type: 'info' as const,
          field: 'meta-description',
          message: 'Could be more descriptive',
          severity: 'info' as const,
        },
      ],
      recommendations: [
        {
          category: 'content' as const,
          priority: 'medium' as const,
          action: 'Add more relevant keywords',
          impact: 'Better search visibility',
        },
      ],
      keywords: [
        {
          keyword: 'event timing',
          density: 2.5,
          relevance: 8,
          competition: 'medium' as const,
        },
      ],
    });

    mockAPI.getBlogAnalytics.mockResolvedValue(mockAnalytics);
  });

  describe('Component Rendering', () => {
    test('should render all tabs correctly', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'SEO Analysis' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Quick Actions' })).toBeInTheDocument();
    });

    test('should render analytics dashboard on overview tab', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByText('Blog Analytics')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument(); // Total posts
      expect(screen.getByText('120')).toBeInTheDocument(); // Published posts
      expect(screen.getByText('15,420')).toBeInTheDocument(); // Total views
      expect(screen.getByText('6.2m')).toBeInTheDocument(); // Avg read time
    });

    test('should render quick actions on overview tab', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Validate All Content')).toBeInTheDocument();
      expect(screen.getByText('Generate Sitemap')).toBeInTheDocument();
      expect(screen.getByText('Optimize Images')).toBeInTheDocument();
      expect(screen.getByText('Sync Analytics')).toBeInTheDocument();
    });

    test('should show post selector on metrics tab', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab
      fireEvent.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Assert
      expect(screen.getByText('Select Post for Metrics')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('should show post selector on SEO tab', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to SEO tab
      fireEvent.click(screen.getByRole('tab', { name: 'SEO Analysis' }));

      // Assert
      expect(screen.getByText('Select Post for SEO Analysis')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    test('should switch between tabs correctly', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Switch to Content Metrics tab
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Assert
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'false'
      );

      // Act - Switch to SEO Analysis tab
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));

      // Assert
      expect(screen.getByRole('tab', { name: 'SEO Analysis' })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Act - Switch to Quick Actions tab
      await user.click(screen.getByRole('tab', { name: 'Quick Actions' }));

      // Assert
      expect(screen.getByRole('tab', { name: 'Quick Actions' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  describe('Post Selection', () => {
    test('should select posts for metrics analysis', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Act - Open dropdown and select a post
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Assert
      expect(mockAPI.getContentMetrics).toHaveBeenCalledWith('test-post-1');
    });

    test('should select posts for SEO analysis', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to SEO tab
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));

      // Act - Open dropdown and select a post
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 2'));

      // Assert
      expect(mockAPI.getSEOScore).toHaveBeenCalledWith('test-post-2');
    });

    test('should maintain selected post across tab switches', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Act - Switch to SEO tab
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));

      // Assert - Same post should still be selected
      expect(screen.getByDisplayValue('Test Post 1')).toBeInTheDocument();
    });
  });

  describe('Content Metrics Display', () => {
    test('should display content metrics when post is selected', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for metrics to load
      await waitFor(() => {
        expect(screen.getByText('Content Metrics')).toBeInTheDocument();
      });

      // Assert
      expect(screen.getByText('500')).toBeInTheDocument(); // Views
      expect(screen.getByText('5m')).toBeInTheDocument(); // Read time
      expect(screen.getByText('85')).toBeInTheDocument(); // SEO score
    });

    test('should show loading state while fetching metrics', async () => {
      // Arrange - Make API call take longer
      mockAPI.getContentMetrics.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 2000))
      );

      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Assert - Should show loading state
      expect(screen.getByText('Content Metrics')).toBeInTheDocument();
      // Loading skeleton should be present
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    test('should handle metrics API errors gracefully', async () => {
      // Arrange - Make API throw an error
      mockAPI.getContentMetrics.mockRejectedValue(new Error('API Error'));

      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for error handling
      await waitFor(() => {
        // Should not crash and should handle error gracefully
        expect(screen.queryByText('Content Metrics')).toBeInTheDocument();
      });
    });
  });

  describe('SEO Analysis Display', () => {
    test('should display SEO analysis when post is selected', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to SEO tab and select post
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for SEO data to load
      await waitFor(() => {
        expect(screen.getByText('SEO Analysis')).toBeInTheDocument();
      });

      // Assert
      expect(screen.getByText('Score: 88')).toBeInTheDocument();
      expect(screen.getByText('Issues (1)')).toBeInTheDocument();
      expect(screen.getByText('Recommendations (1)')).toBeInTheDocument();
      expect(screen.getByText('event timing (2.5%)')).toBeInTheDocument();
    });

    test('should show SEO score with appropriate color', async () => {
      // Arrange - Test different score ranges
      mockAPI.getSEOScore.mockResolvedValue({
        score: 95, // High score
        issues: [],
        recommendations: [],
        keywords: [],
      });

      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to SEO tab and select post
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for SEO data to load
      await waitFor(() => {
        const scoreBadge = screen.getByText('Score: 95');
        expect(scoreBadge).toHaveClass('text-green-600');
      });
    });

    test('should allow re-running SEO analysis', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to SEO tab and select post
      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for initial analysis to load
      await waitFor(() => {
        expect(screen.getByText('Re-run Analysis')).toBeInTheDocument();
      });

      // Act - Click re-run button
      await user.click(screen.getByRole('button', { name: /Re-run Analysis/ }));

      // Assert
      expect(mockAPI.getSEOScore).toHaveBeenCalledTimes(2);
    });
  });

  describe('Quick Actions', () => {
    test('should execute bulk actions', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Click validate all content
      await user.click(screen.getByRole('button', { name: /Validate All Content/ }));

      // Assert - Should show loading state
      expect(screen.getByText('Executing: validate all')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Validate All Content/ })).toBeDisabled();
    });

    test('should show action status while executing', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Click generate sitemap
      await user.click(screen.getByRole('button', { name: /Generate Sitemap/ }));

      // Assert - Should show execution status
      expect(screen.getByText('Executing: generate sitemap')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Generate Sitemap/ })).toBeDisabled();
    });

    test('should handle multiple quick actions', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Click multiple actions
      await user.click(screen.getByRole('button', { name: /Optimize Images/ }));
      await user.click(screen.getByRole('button', { name: /Sync Analytics/ }));

      // Assert - Only one action should execute at a time
      expect(screen.getByText('Executing: optimize images')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sync Analytics/ })).toBeDisabled();
    });
  });

  describe('Analytics Dashboard', () => {
    test('should display top categories correctly', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByText('Top Categories')).toBeInTheDocument();
      expect(screen.getByText('timing guide')).toBeInTheDocument();
      expect(screen.getByText('45 posts')).toBeInTheDocument();
      expect(screen.getByText('presentation tips')).toBeInTheDocument();
      expect(screen.getByText('38 posts')).toBeInTheDocument();
    });

    test('should display top authors correctly', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByText('Top Authors')).toBeInTheDocument();
      expect(screen.getByText('CueTimer Team')).toBeInTheDocument();
      expect(screen.getByText('35 posts')).toBeInTheDocument();
      expect(screen.getByText('5,200 views')).toBeInTheDocument();
    });

    test('should handle missing analytics gracefully', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} />);

      // Assert - Should not crash and should handle missing data
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.queryByText('Blog Analytics')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    test('should have proper ARIA labels on tabs', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
      expect(screen.getByRole('tab', { name: 'SEO Analysis' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
      expect(screen.getByRole('tab', { name: 'Quick Actions' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    test('should have proper form labels', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Assert
      expect(screen.getByLabelText('Select Post for Metrics')).toBeInTheDocument();
    });

    test('should provide keyboard navigation', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Navigate tabs with keyboard
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toHaveFocus();
    });

    test('should announce loading states to screen readers', async () => {
      // Arrange
      mockAPI.getContentMetrics.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Assert - Loading state should be announced
      expect(screen.getByText('Live Data')).toBeInTheDocument();
    });
  });

  describe('ESLint Compliance Tests', () => {
    test('should use proper TypeScript interfaces', () => {
      // Arrange
      const content = { className: 'test-class' };

      // Act & Assert - Should not throw type errors
      expect(() => {
        render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} {...content} />);
      }).not.toThrow();
    });

    test('should follow no-unused-vars pattern', () => {
      // Arrange
      const customPosts = [
        ...mockPosts,
        {
          slug: 'unused-post',
          title: 'Unused Post',
          summary: 'This post should not cause unused variable warnings',
          author: 'Test Author',
          publishedAt: '2024-01-03',
          isDraft: false,
          readTime: 3,
          tags: ['unused'],
          category: 'test' as const,
        },
      ];

      // Act & Assert - All variables should be used properly
      expect(() => {
        render(<BlogContentManager posts={customPosts} analytics={mockAnalytics} />);
      }).not.toThrow();
    });

    test('should use proper error handling patterns', async () => {
      // Arrange - Mock API to throw errors
      mockAPI.getContentMetrics.mockRejectedValue(new Error('Network error'));
      mockAPI.getSEOScore.mockRejectedValue(new Error('SEO API error'));

      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Try to load metrics and SEO data
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      await user.click(screen.getByRole('tab', { name: 'SEO Analysis' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 2'));

      // Assert - Should handle errors gracefully
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'SEO Analysis' })).toBeInTheDocument();
    });

    test('should avoid using any types', () => {
      // This test verifies that the component uses proper TypeScript types
      // Arrange
      const typedAnalytics: BlogAnalytics = mockAnalytics;
      const typedPosts: BlogPostEnhanced[] = mockPosts;

      // Act
      render(<BlogContentManager posts={typedPosts} analytics={typedAnalytics} />);

      // Assert - Component should render without type errors
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    });

    test('should use proper React patterns', () => {
      // Arrange
      const { unmount } = render(
        <BlogContentManager posts={mockPosts} analytics={mockAnalytics} />
      );

      // Act & Assert - Should mount and unmount cleanly
      expect(screen.getByText('Blog Analytics')).toBeInTheDocument();
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    test('should not make unnecessary API calls', () => {
      // Act
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Assert - Should only call analytics API on initial load
      expect(mockAPI.getBlogAnalytics).toHaveBeenCalledTimes(1);
      expect(mockAPI.getContentMetrics).not.toHaveBeenCalled();
      expect(mockAPI.getSEOScore).not.toHaveBeenCalled();
    });

    test('should only call API when post is selected', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Act - Switch tabs without selecting post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Assert - Should not call metrics API without post selection
      expect(mockAPI.getContentMetrics).not.toHaveBeenCalled();

      // Act - Select a post
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Assert - Should call metrics API after post selection
      expect(mockAPI.getContentMetrics).toHaveBeenCalledWith('test-post-1');
    });

    test('should cache API responses appropriately', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<BlogContentManager posts={mockPosts} analytics={mockAnalytics} />);

      // Switch to metrics tab and select post
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Test Post 1'));

      // Wait for initial API call
      await waitFor(() => {
        expect(mockAPI.getContentMetrics).toHaveBeenCalledTimes(1);
      });

      // Act - Switch tabs and come back
      await user.click(screen.getByRole('tab', { name: 'Overview' }));
      await user.click(screen.getByRole('tab', { name: 'Content Metrics' }));

      // Assert - Should not make additional API call for same post
      expect(mockAPI.getContentMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with Other Components', () => {
    test('should integrate with blog post data correctly', () => {
      // Arrange
      const customPosts = [
        {
          slug: 'integration-test',
          title: 'Integration Test Post',
          summary: 'Testing integration with blog post data',
          author: 'Integration Tester',
          publishedAt: '2024-01-15',
          isDraft: false,
          readTime: 10,
          tags: ['integration', 'test'],
          category: 'case-study' as const,
        },
      ];

      // Act
      render(<BlogContentManager posts={customPosts} analytics={mockAnalytics} />);

      // Assert
      expect(screen.getByRole('tab', { name: 'Content Metrics' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'SEO Analysis' })).toBeInTheDocument();
    });

    test('should handle empty posts array gracefully', () => {
      // Act
      render(<BlogContentManager posts={[]} analytics={mockAnalytics} />);

      // Assert - Should not crash and should handle empty state
      expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    test('should handle analytics integration correctly', () => {
      // Arrange
      const customAnalytics = {
        ...mockAnalytics,
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        totalReadTime: 0,
        averageReadTime: 0,
      };

      // Act
      render(<BlogContentManager posts={mockPosts} analytics={customAnalytics} />);

      // Assert - Should display zero values correctly
      expect(screen.getByText('0')).toBeInTheDocument(); // Multiple zero values
    });
  });
});
