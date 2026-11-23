/** @type {import('next').NextConfig} */
const bffBaseUrl = process.env.BFF_INTERNAL_URL || 'http://localhost:8084';

const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api-bff/:path*',
        destination: `${bffBaseUrl}/api/v1/bff/web/:path*`,
      },
      {
        source: '/api/v1/bff/:path*',
        destination: `${bffBaseUrl}/api/v1/bff/:path*`,
      },
    ];
  },
};

export default nextConfig;