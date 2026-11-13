import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const candidates = [
  process.env.SPICETIFY_EXTENSIONS,
  join(process.env.APPDATA ?? join(homedir(), ".config"), "spicetify", "Extensions"),
  join(homedir(), ".config", "spicetify", "Extensions"),
].filter(Boolean);

const target = candidates.find((dir) => existsSync(dir));
if (!target) {
  console.error("Dossier Extensions de Spicetify introuvable (définis SPICETIFY_EXTENSIONS).");
  process.exit(1);
}

mkdirSync(target, { recursive: true });
copyFileSync("dist/bonk.js", join(target, "bonk.js"));
console.log(`bonk.js installé dans ${target}`);
console.log("Puis : spicetify config extensions bonk.js && spicetify apply");
