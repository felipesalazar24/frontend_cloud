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
        destination: 'http://localhost:8084/api/v1/bff/web/:path*',
      },
    ];
  },
}

export default nextConfig;