import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors вместо X-Frame-Options: разрешаем Prismic (симулятор слайсов)
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://images.prismic.io",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
      "connect-src 'self' https://*.prismic.io",
      "frame-ancestors 'self' https://*.prismic.io",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["three"],
  headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
