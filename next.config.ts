import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
