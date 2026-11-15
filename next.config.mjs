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
        destination: 'https://vtfhilb6xc.execute-api.us-east-1.amazonaws.com/api/v1/bff/web/:path*',
      },
      {
        source: '/api/v1/bff/:path*',
        destination: 'https://vtfhilb6xc.execute-api.us-east-1.amazonaws.com/api/v1/bff/:path*',
      },
    ];
  },
}

export default nextConfig;