/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "avatars.githubusercontent.com"],
  },
  // Allow rewrites if developers want /api/v1 to proxy to the Express server in standalone mode
  async rewrites() {
    return [
      {
        source: "/api/express/:path*",
        destination: "http://localhost:5000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
