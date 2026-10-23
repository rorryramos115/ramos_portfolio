/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 otherwise writes an AGENTS.md into the project on `next dev`.
  agentRules: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
