import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.201"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xvhxczwmlupkqpzyfjke.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },
};

export default nextConfig;