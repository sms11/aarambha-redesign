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
    ],
    // MinIO runs on localhost (private IP) which Next.js image optimizer blocks.
    // MinIO images use unoptimized mode in the components instead.
  },
};

export default nextConfig;
