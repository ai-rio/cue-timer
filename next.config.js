import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set workspace root for git worktree environments
  outputFileTracingRoot: '/home/carlos/projects/cue-timer/.worktrees/cue-timer-toc-complete',
  experimental: {
    // Enable server actions with proper configuration
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
    // Optimize webpack chunks to prevent vendor chunk issues
    optimizePackageImports: ['next-intl'],
  },
  // Enable transpilation of packages
  transpilePackages: ['@radix-ui/react-slot', '@ionic/react'],
  // Configure webpack to handle vendor chunks properly
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
      };

      // Fix module concatenation issues that cause "Cannot read properties of undefined (reading 'call')"
      config.optimization.concatenateModules = false;

      // Handle dynamic imports properly
      config.externals = config.externals || [];
      config.resolve.alias = {
        ...config.resolve.alias,
        // Ensure proper module resolution
      };

      // Fix React server components issues
      config.resolve.extensionAlias = {
        '.js': ['.js', '.jsx', '.ts', '.tsx'],
        '.jsx': ['.jsx', '.tsx'],
        '.ts': ['.ts', '.tsx'],
        '.tsx': ['.tsx'],
      };
    }
    return config;
  },
  // Configure images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
        ],
      },
      {
        source: '/_next/static/chunks/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
  // Enable compression for better performance
  compress: true,
  // Enable powered by header removal for security
  poweredByHeader: false,
  // Generate source maps for production debugging (optional)
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
