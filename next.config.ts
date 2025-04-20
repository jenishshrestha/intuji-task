import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Optional: you can specify subpaths like `/images/**`
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/team-:slug",
        destination: "/team/:slug", // Points to your [slug] dynamic route
      },
    ];
  },
};

export default nextConfig;
