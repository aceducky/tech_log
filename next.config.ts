import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    staleTimes: {
      dynamic: 60, //1 minute
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "w3yuyq3w93.ufs.sh",
        pathname: "/f/*",
      },
    ],
  },
};

export default nextConfig;
