/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimization on so hero images can be served at full quality and right size
    // unoptimized: true,
    localPatterns: [
      {
        pathname: "/images/**",
        // No search restriction so query strings (e.g. ?v=2 for cache busting) are allowed
      },
    ],
  },
}

export default nextConfig
