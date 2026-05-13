import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "puppeteer-core",
    "@sparticuz/chromium"
  ],
};

export default nextConfig;