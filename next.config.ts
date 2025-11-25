/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.w3schools.com',
      },
      {
        protocol: 'https',
        hostname: 'samplelib.com',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      },
    ],
  },
  // Next.js 16 optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig