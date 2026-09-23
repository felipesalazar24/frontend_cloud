/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: 'http://api-gateway:8086/api/v1/bff/web/:path*',
      },
    ];
  },
}

export default nextConfig;