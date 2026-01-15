/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  htmlLimitedBots: /.*/,
  trailingSlash: true,
  experimental: {
    webVitalsAttribution: ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"],
  },
};

export default nextConfig;
