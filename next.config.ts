import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default {
  // ...other config
  eslint: {
    ignoreDuringBuilds: true,
  },
};
