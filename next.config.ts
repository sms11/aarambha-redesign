import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'aarambha.school',
      },
      {
        protocol: 'http',
        hostname: 'beta.aarambha.school',
        port: '5554',
      },
    ],
  },
};

export default nextConfig;
