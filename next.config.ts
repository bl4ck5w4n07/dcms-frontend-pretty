import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost',
    '192.168.254.122',        // Your machine’s LAN IP
    '*.local',             // Example of wildcard for subdomains
  ],
};

export default nextConfig;
