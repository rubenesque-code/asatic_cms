/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "localhost", "127.0.0.1"],
    formats: ["image/avif", "image/webp"],
  },
};
