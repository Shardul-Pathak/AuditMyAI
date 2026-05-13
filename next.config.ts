import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "puppeteer-core",
    "@sparticuz/chromium"
  ],
  outputFileTracingIncludes: {
    "app/api/**": [
      "node_modules/@sparticuz/chromium/bin/**",
      "node_modules/.pnpm/**/node_modules/@sparticuz/chromium/bin/**"
    ],
  },
};

export default nextConfig;