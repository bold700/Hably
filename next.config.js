/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Voor statische export naar GitHub Pages
  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' ? 'export' : undefined,
  images: {
    unoptimized: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true',
  },
  // Base path voor GitHub Pages (uncomment als je subdirectory gebruikt)
  // basePath: '/Hably',
  // trailingSlash: true,
}

module.exports = nextConfig

