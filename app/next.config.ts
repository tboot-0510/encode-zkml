import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.module.rules.push({
  //     test: /\.wasm$/,
  //     type: 'asset/resource',
  //   });
  //   config.experiments = {
  //     asyncWebAssembly: true, syncWebAssembly: true, layers: true, topLevelAwait: true 
  //   };
  //   return config;
  // },
};

export default nextConfig;
