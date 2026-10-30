import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins.push({
        apply(compiler: any) {
          compiler.hooks.afterEmit.tap("EnsurePagesDirPlugin", () => {
            const fs = require("fs");
            const serverDir = path.join(process.cwd(), ".next", "server");
            const pagesDir = path.join(serverDir, "pages");
            if (!fs.existsSync(pagesDir)) {
              fs.mkdirSync(pagesDir, { recursive: true });
            }
            const pagesManifest = path.join(serverDir, "pages-manifest.json");
            if (!fs.existsSync(pagesManifest)) {
              fs.writeFileSync(pagesManifest, "{}");
            }
          });
        },
      });
    }
    return config;
  },
};

export default nextConfig;
