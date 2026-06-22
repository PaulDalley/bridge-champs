/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for a small Cloud Run container.
  output: "standalone",
  // Legacy -> new 301s live in Firebase Hosting (firebase.json), because the old
  // URLs are OUTSIDE /learn and never reach this app. This app only serves /learn/**.
  poweredByHeader: false,
};

module.exports = nextConfig;
