import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
