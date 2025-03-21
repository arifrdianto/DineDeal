import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.grab.com" },
      { protocol: "https", hostname: "*.gojekapi.com" },
    ],
  },
};

export default nextConfig;
