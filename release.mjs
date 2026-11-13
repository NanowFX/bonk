// Construit l'extension puis publie la métadonnée lue par update.ps1 :
// version + empreinte SHA1 du fichier distribué.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = import.meta.dirname;

execFileSync(process.execPath, [path.join(root, "build.mjs")], { stdio: "inherit" });

const dist = readFileSync(path.join(root, "dist/bonk.js"));
const sha1 = createHash("sha1").update(dist).digest("hex");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

const meta = {
  version: pkg.version,
  sha1,
  size: dist.length,
  builtAt: new Date().toISOString(),
};

writeFileSync(path.join(root, "version.json"), `${JSON.stringify(meta, null, 2)}\n`);
console.log(`version.json → ${meta.version} · ${sha1.slice(0, 12)} · ${Math.round(meta.size / 1024)} Ko`);
