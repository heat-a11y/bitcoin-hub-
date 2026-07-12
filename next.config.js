/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/erph-moe",
  assetPrefix: "/erph-moe/",
}

module.exports = nextConfig
