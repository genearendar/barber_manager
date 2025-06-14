import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        ".app.github.dev", // This allows all Codespaces domains
        "replit.dev",
        "myclipmate.com",
        "*.myclipmate.com",
      ],
    },
  },
};

export default nextConfig;
