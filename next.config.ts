import type {NextConfig} from 'next';

// Run seed script in development
// if (process.env.NODE_ENV === 'development') {
//   // We require it this way to avoid it being bundled in production.
//   // The script needs to be in the `src` folder for the paths to resolve correctly.
//   require('./src/lib/seed.ts');
// }

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
