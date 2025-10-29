import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { BlogFilterErrorBoundary } from '../../components/contexts/blog-filter-error-boundary';

// Component that throws an error for testing
const ThrowErrorComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Component that throws a different error type
const ThrowTypeErrorComponent = () => {
  throw new TypeError('Type error occurred');
};

// Component that throws an object instead of Error
const ThrowObjectComponent = () => {
  throw { message: 'Object error' };
};

// Custom fallback component
const CustomFallbackComponent = () => {
  return <div data-testid='custom-fallback'>Custom error fallback</div>;
};

describe('BlogFilterErrorBoundary', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error to avoid test output pollution
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Error Handling', () => {
    it('should catch and display error when child component throws', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should display custom fallback when provided', () => {
      render(
        <BlogFilterErrorBoundary fallback={<CustomFallbackComponent />}>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();
    });

    it('should handle different error types', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowTypeErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('Type error occurred')).toBeInTheDocument();
    });

    it('should handle non-Error objects thrown', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowObjectComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while filtering blog posts.')).toBeInTheDocument();
    });

    it('should log error to console', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'BlogFilter Error Boundary caught an error:',
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Recovery Mechanisms', () => {
    it('should reset error state when "Try Again" button is clicked', () => {
      const { rerender } = render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      // Should show error state
      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();

      // Click "Try Again" button
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      // Should render children again
      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();
    });

    it('should reload page when "Reload Page" button is clicked', () => {
      // Mock window.location.reload
      const reloadSpy = jest.fn();
      Object.defineProperty(window.location, 'reload', {
        value: reloadSpy,
        writable: true,
      });

      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const reloadButton = screen.getByText('Reload Page');
      fireEvent.click(reloadButton);

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when provided', () => {
      const onErrorCallback = jest.fn();

      render(
        <BlogFilterErrorBoundary onError={onErrorCallback}>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(onErrorCallback).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should handle onError callback that throws', () => {
      const onErrorCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      expect(() => {
        render(
          <BlogFilterErrorBoundary onError={onErrorCallback}>
            <ThrowErrorComponent />
          </BlogFilterErrorBoundary>
        );
      }).not.toThrow();
    });
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <BlogFilterErrorBoundary>
          <div data-testid='child-content'>Normal content</div>
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <BlogFilterErrorBoundary>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<BlogFilterErrorBoundary>{null}</BlogFilterErrorBoundary>);

      // Should not crash and should not show error UI
      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();
    });

    it('should handle children that render conditionally', () => {
      const { rerender } = render(
        <BlogFilterErrorBoundary>
          <div data-testid='conditional-content'>Visible</div>
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByTestId('conditional-content')).toBeInTheDocument();

      // Re-render with throwing component
      rerender(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should recover from error and handle new errors', () => {
      const { rerender } = render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      // Should show error state
      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();

      // Reset error
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      // Should render children again (and throw again)
      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
    });

    it('should handle errors in componentDidUpdate', () => {
      const ProblematicComponent = ({ throwError }: { throwError: boolean }) => {
        React.useEffect(() => {
          if (throwError) {
            throw new Error('Effect error');
          }
        }, [throwError]);

        return <div>Component content</div>;
      };

      const { rerender } = render(
        <BlogFilterErrorBoundary>
          <ProblematicComponent throwError={false} />
        </BlogFilterErrorBoundary>
      );

      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();

      // Re-render with error
      rerender(
        <BlogFilterErrorBoundary>
          <ProblematicComponent throwError={true} />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('Effect error')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Blog Filter Error');
    });

    it('should have accessible button labels', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
      const reloadButton = screen.getByRole('button', { name: 'Reload Page' });

      expect(tryAgainButton).toBeInTheDocument();
      expect(reloadButton).toBeInTheDocument();
    });

    it('should have appropriate ARIA attributes for icon', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Styling and Visual Structure', () => {
    it('should have proper CSS classes for styling', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const container = screen.getByText('Blog Filter Error').closest('div');
      expect(container).toHaveClass('text-xl', 'font-semibold', 'text-gray-900');

      const iconContainer = screen.getByRole('img').closest('div');
      expect(iconContainer).toHaveClass('mb-4');

      const buttonContainer = screen.getByText('Try Again').closest('div');
      expect(buttonContainer).toHaveClass('flex', 'gap-3');
    });

    it('should have responsive layout classes', () => {
      render(
        <BlogFilterErrorBoundary>
          <ThrowErrorComponent />
        </BlogFilterErrorBoundary>
      );

      const mainContainer = screen.getByText('Blog Filter Error').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'p-8',
        'text-center'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors with no message', () => {
      const ErrorNoMessageComponent = () => {
        const error = new Error();
        delete error.message;
        throw error;
      };

      render(
        <BlogFilterErrorBoundary>
          <ErrorNoMessageComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while filtering blog posts.')).toBeInTheDocument();
    });

    it('should handle asynchronous errors', async () => {
      const AsyncErrorComponent = () => {
        React.useEffect(() => {
          setTimeout(() => {
            throw new Error('Async error');
          }, 0);
        }, []);

        return <div>Loading...</div>;
      };

      render(
        <BlogFilterErrorBoundary>
          <AsyncErrorComponent />
        </BlogFilterErrorBoundary>
      );

      // Wait for async error
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Note: React Error Boundaries don't catch errors in event handlers or async code
      // This test documents current behavior
      expect(screen.queryByText('Blog Filter Error')).not.toBeInTheDocument();
    });

    it('should handle deeply nested errors', () => {
      const NestedErrorComponent = () => {
        throw new Error('Deep nested error');
      };

      const WrapperComponent = () => (
        <div>
          <span>
            <NestedErrorComponent />
          </span>
        </div>
      );

      render(
        <BlogFilterErrorBoundary>
          <WrapperComponent />
        </BlogFilterErrorBoundary>
      );

      expect(screen.getByText('Blog Filter Error')).toBeInTheDocument();
      expect(screen.getByText('Deep nested error')).toBeInTheDocument();
    });
  });
});
