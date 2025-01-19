import type { NextConfig } from "next";
import { version } from './package.json';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    version,
    googleAnalyticsID: 'G-1X7Y30KPPK',
    searchDefaultPlaceholder: 'Mașină mâna a 2 sub 3000 euro',
  },
};

export default nextConfig;
