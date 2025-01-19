import type { NextConfig } from "next";
import { version } from './package.json';

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    version,
    searchDefaultPlaceholder: 'Mașină mâna a 2 sub 3000 euro',
  },
};

export default nextConfig;
