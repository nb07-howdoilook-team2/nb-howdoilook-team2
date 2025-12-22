/ @type {import('next').NextConfig} /
const path = require('path')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "src/styles/utils.scss" as *;`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/',
      },
      {
        protocol: 'https',
        hostname: 'sprint-be-project.s3.ap-northeast-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'nb-howdoilook-team2-2neu.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
  protocol: 'https',
  hostname: 'res.cloudinary.com',
      },
    ],
  },
}
