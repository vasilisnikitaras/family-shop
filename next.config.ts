/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  turbopack: {},

  webpack: (config: any) => {
    return config;
  },
};

export default nextConfig;
