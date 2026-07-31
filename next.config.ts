/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // ⭐ ΑΥΤΟ ΕΔΩ ΕΙΝΑΙ ΤΟ ΜΑΓΙΚΟ
  devServer: {
    host: "0.0.0.0",
    port: 3002,
  },

  turbopack: {},

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
