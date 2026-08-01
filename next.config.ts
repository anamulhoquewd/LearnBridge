import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2e90dc7bd73149bdadf769f061a6f397.r2.dev",
      },
      {
        protocol: "https",
        hostname: "pub-e4bff183853a4153b77097918c463364.r2.dev",
      },
    ],
  },
}

export default nextConfig
