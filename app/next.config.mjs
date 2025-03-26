import path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Add rule for WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Copy WASM files to output directory
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              "node_modules/@ezkljs/engine/nodejs/ezkl_bg.wasm"
            ),
            to: path.join(__dirname, ".next/server/vendor-chunks/ezkl_bg.wasm"),
          },
        ],
      })
    );

    return config;
  },
};

export default nextConfig;
