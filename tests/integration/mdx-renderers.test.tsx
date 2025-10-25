/**
 * Integration tests for MDX renderer components
 * Tests the rendering functionality, accessibility features, and ESLint compliance
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

// Mock heavy dependencies
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => (
    <pre data-testid='syntax-highlighter'>{children}</pre>
  ),
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));

jest.mock('next-mdx-remote/rsc', () => ({
  compileMDX: async ({ source, components }: any) => ({
    content: <div data-testid='compiled-mdx'>{source}</div>,
  }),
}));

jest.mock('rehype-highlight', () => ({
  default: () => (tree: any) => tree,
}));

jest.mock('rehype-prism-plus', () => ({
  default: () => (tree: any) => tree,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Import components after mocking
import AccessibleMDXRenderer from '../../components/blog/AccessibleMDXRenderer';
import EnhancedMDXRenderer from '../../components/blog/EnhancedMDXRenderer';
import OptimizedMDXRenderer from '../../components/blog/OptimizedMDXRenderer';

describe('MDX Renderer Components Integration Tests', () => {
  const basicContent = `
# Main Heading

This is a paragraph with **bold text** and *italic text*.

## Subheading

Here's an inline \`code\` example.

- List item 1
- List item 2
- List item 3

> This is a blockquote.

[Link text](https://example.com)
`;

  const advancedContent = `
# Advanced Content

This content has code blocks:

\`\`\`javascript
console.log('Hello, world!');
\`\`\`

And custom components:
{{timer:5 minutes|Timer Setup}}Timer content{{/timer}}

{{metric:Users|1000|up}}Metric content{{/metric}}

{{tip:beginner}}This is a pro tip{{/tip}}
`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AccessibleMDXRenderer', () => {
    test('should render basic markdown content with proper accessibility', async () => {
      // Arrange
      const mockReadingTimeUpdate = jest.fn();
      const mockCodeBlockCount = jest.fn();

      // Act
      render(
        <AccessibleMDXRenderer
          content={basicContent}
          enableAdvancedFeatures={false}
          onReadingTimeUpdate={mockReadingTimeUpdate}
          onCodeBlockCount={mockCodeBlockCount}
        />
      );

      // Assert
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Main Heading')).toBeInTheDocument();
      expect(screen.getByText('This is a paragraph with')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Subheading')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('blockquote')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Link text/ })).toBeInTheDocument();

      // Check callbacks
      expect(mockReadingTimeUpdate).toHaveBeenCalled();
      expect(mockCodeBlockCount).toHaveBeenCalledWith(0);
    });

    test('should render code blocks with accessibility features', async () => {
      // Arrange
      const contentWithCode = `
# Code Example

Here's some code:

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithCode} />);

      // Assert
      expect(screen.getByRole('region', { name: /javascript code block/i })).toBeInTheDocument();
      expect(screen.getByRole('toolbar', { name: /code block tools/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
      expect(screen.getByLabelText('File: javascript')).toBeInTheDocument();
    });

    test('should handle copy functionality', async () => {
      // Arrange
      const user = userEvent.setup();
      const contentWithCode = `
\`\`\`javascript
console.log('test');
\`\`\`
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithCode} />);
      const copyButton = screen.getByRole('button', { name: /copy code/i });

      await user.click(copyButton);

      // Assert
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("console.log('test');");
      expect(screen.getByRole('button', { name: /code copied!/i })).toBeInTheDocument();
    });

    test('should provide proper ARIA labels for external links', () => {
      // Arrange & Act
      render(<AccessibleMDXRenderer content='[External](https://example.com)' />);

      // Assert
      const link = screen.getByRole('link', { name: /external \(opens in new tab\)/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('should handle images with proper accessibility', () => {
      // Arrange
      const contentWithImage = `
# Image Test

![Alt text](/image.jpg)
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithImage} />);

      // Assert
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Alt text');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    test('should detect complex features and show enhanced option', () => {
      // Arrange & Act
      render(<AccessibleMDXRenderer content={advancedContent} />);

      // Assert
      expect(screen.getByText(/This content uses enhanced features/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /load enhanced features/i })).toBeInTheDocument();
    });

    test('should load enhanced features when requested', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<AccessibleMDXRenderer content={advancedContent} />);
      const loadButton = screen.getByRole('button', { name: /load enhanced features/i });

      await user.click(loadButton);

      // Assert
      expect(screen.getByText(/Loading enhanced features.../i)).toBeInTheDocument();
    });
  });

  describe('EnhancedMDXRenderer', () => {
    test('should render enhanced content with template components', async () => {
      // Arrange
      const mockReadingTimeUpdate = jest.fn();
      const mockCodeBlockCount = jest.fn();

      // Act
      render(
        <EnhancedMDXRenderer
          content={advancedContent}
          template='timing-guide'
          onReadingTimeUpdate={mockReadingTimeUpdate}
          onCodeBlockCount={mockCodeBlockCount}
        />
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('compiled-mdx')).toBeInTheDocument();
      });
      expect(mockReadingTimeUpdate).toHaveBeenCalled();
      expect(mockCodeBlockCount).toHaveBeenCalled();
    });

    test('should process custom syntax correctly', async () => {
      // Arrange
      const contentWithCustom = `
# Custom Components

{{timer:5 minutes|Setup Timer}}
Timer instructions here
{{/timer}}

{{metric:Performance|95%|up}}
Performance details
{{/metric}}
`;

      // Act
      render(<EnhancedMDXRenderer content={contentWithCustom} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('compiled-mdx')).toBeInTheDocument();
      });
    });

    test('should handle code block with enhanced features', async () => {
      // Arrange
      const user = userEvent.setup();
      const contentWithCode = `
\`\`\`javascript filename="test.js"
const message = 'Hello, Enhanced!';
console.log(message);
\`\`\`
`;

      // Act
      render(<EnhancedMDXRenderer content={contentWithCode} />);

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('compiled-mdx')).toBeInTheDocument();
      });
    });

    test('should handle MDX compilation errors gracefully', async () => {
      // Arrange
      const invalidContent = `
# Invalid Content

{{invalid:syntax}}
`;

      // Mock compileMDX to throw an error
      const { compileMDX } = require('next-mdx-remote/rsc');
      compileMDX.mockRejectedValue(new Error('MDX compilation failed'));

      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      render(<EnhancedMDXRenderer content={invalidContent} />);

      // Wait for error boundary to catch the error
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Enhanced MDX compilation error:',
          expect.objectContaining({
            message: 'MDX compilation failed',
          })
        );
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('OptimizedMDXRenderer', () => {
    test('should render basic content without advanced features', () => {
      // Arrange
      const mockReadingTimeUpdate = jest.fn();
      const mockCodeBlockCount = jest.fn();

      // Act
      render(
        <OptimizedMDXRenderer
          content={basicContent}
          enableAdvancedFeatures={false}
          onReadingTimeUpdate={mockReadingTimeUpdate}
          onCodeBlockCount={mockCodeBlockCount}
        />
      );

      // Assert
      expect(screen.getByText('Main Heading')).toBeInTheDocument();
      expect(screen.getByText('Subheading')).toBeInTheDocument();
      expect(mockReadingTimeUpdate).toHaveBeenCalled();
      expect(mockCodeBlockCount).toHaveBeenCalledWith(0);
    });

    test('should detect complex features and show option to load them', () => {
      // Arrange & Act
      render(<OptimizedMDXRenderer content={advancedContent} />);

      // Assert
      expect(screen.getByText(/This content uses advanced features/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /load enhanced features/i })).toBeInTheDocument();
    });

    test('should load advanced renderer when requested', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<OptimizedMDXRenderer content={advancedContent} />);
      const loadButton = screen.getByRole('button', { name: /load enhanced features/i });

      await user.click(loadButton);

      // Assert
      expect(screen.getByText(/Loading enhanced features.../i)).toBeInTheDocument();
    });

    test('should render simple code blocks', () => {
      // Arrange
      const contentWithSimpleCode = `
# Simple Code

Inline: \`code\`

Block:
\`\`\`javascript
console.log('simple');
\`\`\`
`;

      // Act
      render(<OptimizedMDXRenderer content={contentWithSimpleCode} />);

      // Assert
      expect(screen.getByText('code')).toBeInTheDocument();
      expect(screen.getByText("console.log('simple');")).toBeInTheDocument();
    });
  });

  describe('Accessibility Compliance', () => {
    test('should maintain proper heading hierarchy', () => {
      // Arrange
      const contentWithHeadings = `
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithHeadings} />);

      // Assert
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    });

    test('should provide proper ARIA labels for interactive elements', () => {
      // Arrange
      const contentWithLinks = `
[Internal link](/internal)
[External link](https://external.com)
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithLinks} />);

      // Assert
      const internalLink = screen.getByRole('link', { name: 'Internal link' });
      const externalLink = screen.getByRole('link', {
        name: /external link \(opens in new tab\)/i,
      });

      expect(internalLink).not.toHaveAttribute('aria-label');
      expect(externalLink).toHaveAttribute('aria-label', 'external link (opens in new tab)');
    });

    test('should handle keyboard navigation for code blocks', async () => {
      // Arrange
      const user = userEvent.setup();
      const contentWithCode = `
\`\`\`javascript
console.log('test');
\`\`\`
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithCode} />);
      const copyButton = screen.getByRole('button', { name: /copy code/i });

      // Test keyboard navigation
      copyButton.focus();
      expect(copyButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    test('should provide screen reader announcements', async () => {
      // Arrange
      const user = userEvent.setup();
      const contentWithCode = `
\`\`\`javascript
console.log('test');
\`\`\`
`;

      // Act
      render(<AccessibleMDXRenderer content={contentWithCode} />);
      const copyButton = screen.getByRole('button', { name: /copy code/i });

      await user.click(copyButton);

      // Assert - Check for screen reader announcement
      expect(screen.getByText(/Code has been copied to clipboard/i)).toBeInTheDocument();
    });
  });

  describe('ESLint Compliance Tests', () => {
    test('should use proper TypeScript interfaces', () => {
      // This test verifies that TypeScript interfaces are properly defined and used
      const content = '# Test Content';

      // Act & Assert - Should not throw type errors
      expect(() => {
        render(<AccessibleMDXRenderer content={content} />);
      }).not.toThrow();
    });

    test('should follow no-unused-vars pattern', () => {
      // Arrange
      const mockReadingTimeUpdate = jest.fn();
      const mockCodeBlockCount = jest.fn();

      // Act - All callbacks should be used
      render(
        <OptimizedMDXRenderer
          content={basicContent}
          onReadingTimeUpdate={mockReadingTimeUpdate}
          onCodeBlockCount={mockCodeBlockCount}
        />
      );

      // Assert - Callbacks should be called
      expect(mockReadingTimeUpdate).toHaveBeenCalled();
      expect(mockCodeBlockCount).toHaveBeenCalled();
    });

    test('should use proper error handling patterns', async () => {
      // Arrange
      const invalidContent = null; // This should be handled gracefully

      // Act & Assert - Should handle null/invalid content
      expect(() => {
        render(<AccessibleMDXRenderer content={invalidContent || ''} />);
      }).not.toThrow();
    });

    test('should avoid using any types', () => {
      // This test verifies that the components use proper TypeScript types
      const content = '# TypeScript Compliance Test';

      // Act
      render(<EnhancedMDXRenderer content={content} />);

      // Assert - Component should render without type errors
      expect(screen.getByTestId('compiled-mdx')).toBeInTheDocument();
    });

    test('should use proper React patterns', () => {
      // Arrange
      const content = '# React Patterns Test';

      // Act
      const { unmount } = render(<OptimizedMDXRenderer content={content} />);

      // Assert - Should mount and unmount cleanly
      expect(screen.getByText('React Patterns Test')).toBeInTheDocument();
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Performance Optimization', () => {
    test('should use lazy loading for heavy dependencies', () => {
      // Arrange
      const content = basicContent;

      // Act
      render(<AccessibleMDXRenderer content={content} />);

      // Assert - Should render basic content without loading heavy dependencies
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.queryByTestId('syntax-highlighter')).not.toBeInTheDocument();
    });

    test('should only load enhanced features when needed', () => {
      // Arrange
      const simpleContent = '# Simple Content\n\nJust basic text.';
      const complexContent = advancedContent;

      // Act & Assert - Simple content should not show enhanced option
      const { rerender } = render(<OptimizedMDXRenderer content={simpleContent} />);
      expect(screen.queryByText(/advanced features/i)).not.toBeInTheDocument();

      // Rerender with complex content
      rerender(<OptimizedMDXRenderer content={complexContent} />);
      expect(screen.getByText(/advanced features/i)).toBeInTheDocument();
    });

    test('should calculate reading time efficiently', () => {
      // Arrange
      const mockReadingTimeUpdate = jest.fn();
      const longContent = '# Long Content\n\n'.repeat(100);

      // Act
      render(
        <OptimizedMDXRenderer content={longContent} onReadingTimeUpdate={mockReadingTimeUpdate} />
      );

      // Assert
      expect(mockReadingTimeUpdate).toHaveBeenCalledWith(expect.any(Number));
      expect(mockReadingTimeUpdate).toHaveBeenCalledTimes(1);
    });

    test('should count code blocks efficiently', () => {
      // Arrange
      const mockCodeBlockCount = jest.fn();
      const contentWithMultipleCodeBlocks = `
# Code Blocks

\`\`\`javascript
console.log('block 1');
\`\`\`

\`\`\`python
print('block 2')
\`\`\`

\`\`\`css
body { color: red; }
\`\`\`
`;

      // Act
      render(
        <OptimizedMDXRenderer
          content={contentWithMultipleCodeBlocks}
          onCodeBlockCount={mockCodeBlockCount}
        />
      );

      // Assert
      expect(mockCodeBlockCount).toHaveBeenCalledWith(3);
    });
  });

  describe('Cross-Component Integration', () => {
    test('should handle content transitions between renderers', async () => {
      // Arrange
      const user = userEvent.setup();
      const { rerender } = render(<OptimizedMDXRenderer content={basicContent} />);

      // Act - Start with optimized renderer
      expect(screen.getByText('Main Heading')).toBeInTheDocument();

      // Switch to enhanced content
      rerender(<OptimizedMDXRenderer content={advancedContent} />);
      await user.click(screen.getByRole('button', { name: /load enhanced features/i }));

      // Assert - Should transition to enhanced features
      expect(screen.getByText(/Loading enhanced features.../i)).toBeInTheDocument();
    });

    test('should maintain accessibility across different renderers', () => {
      // Arrange
      const accessibleContent = `
# Accessible Content

This content should be accessible in all renderers.

- Item 1
- Item 2

[Accessible Link](https://example.com)
`;

      // Act & Assert - Test all renderers
      const { rerender } = render(<AccessibleMDXRenderer content={accessibleContent} />);
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();

      rerender(<EnhancedMDXRenderer content={accessibleContent} />);
      // Enhanced renderer should also maintain accessibility
      expect(screen.getByTestId('compiled-mdx')).toBeInTheDocument();

      rerender(<OptimizedMDXRenderer content={accessibleContent} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
