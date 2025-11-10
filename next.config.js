/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production configuration for SmarterASP.NET
  // output: 'export', // Commented out for server-side rendering
  // distDir: 'out',   // Using default .next for server deployment
  trailingSlash: false, // Better for API routes
  allowedDevOrigins: ["*.preview.same-app.com"],

  // Disable type checking during build to avoid Next.js 15 issues
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optimize for production
  compress: true,
  poweredByHeader: false,

  // Fix chunk loading issues
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  images: {
    unoptimized: false, // Enable optimization in production
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "psu-gatsby-files-prod.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.dlrgroup.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
