/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimization on so hero images can be served at full quality and right size
    // unoptimized: true,
  },
}

export default nextConfig
