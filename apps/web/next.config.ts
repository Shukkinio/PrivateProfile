import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['ui', 'db', 'types', 'validators', 'config'],
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
