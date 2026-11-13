import { build } from "esbuild";

await build({
  entryPoints: ["src/bonk.js"],
  outfile: "dist/bonk.js",
  bundle: true,
  format: "iife",
  target: "chrome100",
  minify: true,
  legalComments: "none",
  loader: { ".css": "text", ".woff2": "dataurl" },
  logLevel: "info",
});
