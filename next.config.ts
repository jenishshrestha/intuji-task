import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
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
