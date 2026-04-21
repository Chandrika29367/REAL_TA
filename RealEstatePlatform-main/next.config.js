/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "imagecdn.99acres.com",
      "images.weserv.nl",
      "maps.googleapis.com",
      "maps.gstatic.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.housingcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.housing.com',
      },
    ],
  },
}

module.exports = nextConfig