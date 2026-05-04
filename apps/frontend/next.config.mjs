import path from 'path';
import { fileURLToPath } from 'url';
import bundleAnalyzer from '@next/bundle-analyzer';
/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';
const SERVER_API_BASE_URL = process.env.SERVER_API_BASE_URL;
// recreate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true, // Set to false to avoid hydration errors with Clerk
  output: 'standalone', // Use standalone output for better performance in production

  // Pin the workspace root to the repo root (Yarn 4 hoists deps there).
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production (keep error and warn)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  env: {
    // Build-time fallback so static prerender (e.g. /_not-found) doesn't crash
    // when no real Clerk key is set. Clerk's docs publishable-key format —
    // decodes to clerk.example.com$. Override at deploy time.
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_Y2xlcmsuZXhhbXBsZS5jb20k',
    CLERK_SECRET_KEY: process.env.NEXT_PUBLIC_CLERK_SECRET_KEY,
    CLERK_FRONTEND_API: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
    CLERK_REDIRECT_URI: process.env.NEXT_PUBLIC_CLERK_REDIRECT_URI,
    NEXT_HTTP_URL: process.env.NEXT_HTTP_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow images from any HTTPS domain
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Enable modern image formats
    minimumCacheTTL: 60,
  },

  async rewrites() {
    if (isDev && SERVER_API_BASE_URL) {
      console.log('[Rewrites] Proxying /api →', `${SERVER_API_BASE_URL}/api`);
    }
    return isDev && SERVER_API_BASE_URL // Only apply rewrites in development mode
      ? [
          {
            source: '/api/(.*)',
            destination: `${SERVER_API_BASE_URL}/api/$1`,
          },
          {
            source: '/api/:path*',
            destination: `${SERVER_API_BASE_URL}/api/:path*`,
          },
          {
            source: '/api/v1/:path*',
            destination: `${SERVER_API_BASE_URL}/api/v1/:path*`,
          },
        ]
      : [];
  },
};

export default withBundleAnalyzer(nextConfig);
