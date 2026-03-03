import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3iova6424vljy.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Optimize build output to reduce size
  productionBrowserSourceMaps: false, // Tắt source maps cho production
  compress: true,
  // Exclude unnecessary files from build
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '.next/dev/**',
        '.next/cache/**',
        'node_modules/**',
      ],
    },
  },
};

export default nextConfig;
