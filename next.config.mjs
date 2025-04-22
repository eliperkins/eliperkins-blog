/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  experimental: {
    webVitalsAttribution: ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"],
    reactCompiler: true,
  },
};

export default nextConfig;
