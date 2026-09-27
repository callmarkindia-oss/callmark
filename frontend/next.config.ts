import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vgvmufmldgmthuoxqrum.supabase.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://qrstay-1.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;