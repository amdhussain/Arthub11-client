/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/:path*`,
      },
      {
        source: '/api/artworks/:id/comments',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/artworks/:id/comments`,
      },
    ];
  },
};

export default nextConfig;
