const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: isProduction ? "/auto-git-message" : undefined,
  assetPrefix: isProduction ? "/auto-git-message" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
