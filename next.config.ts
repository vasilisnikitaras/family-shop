/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // ❌ devServer πρέπει να φύγει — δεν υποστηρίζεται στο Next.js 16
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 3002,
  // },

  turbopack: {},

  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
