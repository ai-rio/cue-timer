'use client';

import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BlogErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface BlogErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BlogErrorBoundaryClass extends React.Component<
  BlogErrorBoundaryProps,
  BlogErrorBoundaryState
> {
  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): BlogErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Blog Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // reportError(error, errorInfo);
      console.error('Blog rendering error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      // Default fallback UI
      return (
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <Card className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
              <CardHeader className='pb-4'>
                <div className='flex items-center space-x-3'>
                  <ExclamationTriangleIcon className='h-6 w-6 text-red-600 dark:text-red-400' />
                  <h2 className='text-xl font-semibold text-red-800 dark:text-red-200'>
                    Content Loading Error
                  </h2>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-red-700 dark:text-red-300'>
                  We encountered an error while loading this blog content. This might be due to:
                </p>
                <ul className='list-disc list-inside text-red-600 dark:text-red-400 space-y-1 text-sm'>
                  <li>Invalid content format</li>
                  <li>Missing or corrupted data</li>
                  <li>Temporary server issues</li>
                </ul>

                {process.env.NODE_ENV === 'development' && (
                  <details className='mt-4'>
                    <summary className='cursor-pointer text-sm font-medium text-red-800 dark:text-red-200'>
                      Error Details (Development Only)
                    </summary>
                    <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 rounded border border-red-200 dark:border-red-700'>
                      <p className='text-xs font-mono text-red-800 dark:text-red-200 mb-2'>
                        {this.state.error.name}: {this.state.error.message}
                      </p>
                      <pre className='text-xs text-red-700 dark:text-red-300 overflow-x-auto'>
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                  <Button onClick={this.resetErrorBoundary} className='flex items-center space-x-2'>
                    <ArrowPathIcon className='h-4 w-4' />
                    <span>Try Again</span>
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => (window.location.href = '/blog')}
                    className='flex items-center space-x-2'
                  >
                    <span>Back to Blog</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for consistency with other components
export default function BlogErrorBoundary({ children, fallback }: BlogErrorBoundaryProps) {
  return <BlogErrorBoundaryClass fallback={fallback}>{children}</BlogErrorBoundaryClass>;
}

// Export a specialized fallback for MDX errors
export function MDXErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isMDXError =
    error.message.toLowerCase().includes('mdx') || error.message.toLowerCase().includes('compile');

  return (
    <div className='prose prose-gray max-w-none'>
      <div className='border border-orange-200 bg-orange-50 rounded-lg p-6 dark:border-orange-800 dark:bg-orange-950'>
        <div className='flex items-start space-x-3'>
          <ExclamationTriangleIcon className='h-6 w-6 text-orange-600 dark:text-orange-400 mt-1' />
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2'>
              {isMDXError ? 'MDX Compilation Error' : 'Content Rendering Error'}
            </h3>
            <p className='text-orange-700 dark:text-orange-300 mb-4'>
              {isMDXError
                ? 'There was an error processing the MDX content. This might be due to invalid syntax or unsupported components.'
                : 'There was an error rendering this content. Please try refreshing the page.'}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className='mb-4'>
                <summary className='cursor-pointer text-sm font-medium text-orange-800 dark:text-orange-200'>
                  Technical Details
                </summary>
                <div className='mt-2 p-3 bg-orange-100 dark:bg-orange-900 rounded border border-orange-200 dark:border-orange-700'>
                  <p className='text-xs font-mono text-orange-800 dark:text-orange-200'>
                    {error.message}
                  </p>
                </div>
              </details>
            )}

            <div className='flex space-x-3'>
              <button
                onClick={resetErrorBoundary}
                className='px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center space-x-2'
              >
                <ArrowPathIcon className='h-4 w-4' />
                <span>Retry</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 border border-orange-300 text-orange-700 rounded hover:bg-orange-100 transition-colors'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
