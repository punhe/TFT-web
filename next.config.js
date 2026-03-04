/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // SEO: Custom headers for security and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },

  // SEO: Redirects for common URL variations
  async redirects() {
    return [
      // Redirect www to non-www (canonical)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.punhelabs.io.vn',
          },
        ],
        destination: 'https://punhelabs.io.vn/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
