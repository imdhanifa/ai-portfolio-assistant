/** @type {import('next').NextConfig} */
const nextConfig = {
  // Traces only the files each page actually needs into .next/standalone, including a
  // minimal server.js - deployable on a bare VPS with `node server.js`, no `npm install`
  // or full node_modules needed there. Doesn't copy public/ or .next/static automatically
  // (see deploy docs) - the deploy step handles that.
  output: "standalone",
};

export default nextConfig;
