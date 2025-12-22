/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["designingmedia.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
