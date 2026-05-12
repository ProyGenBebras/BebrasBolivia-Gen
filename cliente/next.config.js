/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

experimental: {
    allowedDevOrigins: ['localhost:3000', '26.166.58.21'],
  },
};

module.exports = nextConfig;
