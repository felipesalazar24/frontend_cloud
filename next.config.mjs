/** @type {import('next').NextConfig} */
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
        destination: `${process.env.BFF_INTERNAL_URL || 'https://ih20amtq1d.execute-api.us-east-1.amazonaws.com/api/v1/bff/web/:path*'}`,
      },
    ];
  },
}

export default nextConfig;