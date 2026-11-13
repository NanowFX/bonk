import { build } from "esbuild";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

await build({
  entryPoints: ["src/bonk.js"],
  outfile: "dist/bonk.js",
  bundle: true,
  format: "iife",
  target: "chrome100",
  minify: true,
  legalComments: "none",
  loader: { ".css": "text", ".woff2": "dataurl" },
  define: { __BONK_VERSION__: JSON.stringify(pkg.version) },
  logLevel: "info",
});
