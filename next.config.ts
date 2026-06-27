import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: [
    "192.168.1.10",
    "localhost",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**", // ✅ required
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**", // ✅ required
      },
    ],
  },
};

export default nextConfig;
