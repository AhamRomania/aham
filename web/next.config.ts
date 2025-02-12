import type { NextConfig } from "next";
import { version } from './package.json';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    version,
    searchDefaultPlaceholder: 'Mașină mâna a 2 sub 3000 euro',
  },
  reactStrictMode: true,
  linkPrefetch: false,
  compiler: {
    emotion: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {hostname: 'cdn.aham.ro'},
      {hostname: 'localhost'}
    ],
  },
  // its a qs param for js/css
  //deploymentId: '2'
};

export default nextConfig;
