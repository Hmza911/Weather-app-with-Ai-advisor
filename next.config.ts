import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.weatherapi.com",
        protocol: "https",
        port: "",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;
