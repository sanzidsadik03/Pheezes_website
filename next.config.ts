import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudinary — all uploaded product/review images
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // Picsum — placeholder images used in seed data
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        // Unsplash — optional placeholder images
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // Ensure Vercel/Edge compatibility
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  // Disable powered-by header
  poweredByHeader: false,

  // Compress responses
  compress: true,
}

export default nextConfig
