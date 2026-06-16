/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Genera un servidor autónomo con node_modules mínimo para imágenes Docker livianas
  output: 'standalone',
  allowedDevOrigins: ['localhost:3000', '26.166.58.21'],
};

module.exports = nextConfig;
