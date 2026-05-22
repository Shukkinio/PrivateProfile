import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['ui', 'db', 'types', 'validators', 'config'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
