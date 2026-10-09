/** @type {import('next').NextConfig} */
const nextConfig = {
  // A stray package-lock.json higher up the tree confuses root detection.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
