import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const m3uPath = join(root, "fifa_world_cup_2026.m3u");
const outputPath = join(root, "src", "data", "channels.json");

const content = readFileSync(m3uPath, "utf-8");
const lines = content.split(/\r?\n/);

const channels = [];
let currentName = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed === "#EXTM3U") continue;

  if (trimmed.startsWith("#EXTINF:")) {
    const commaIndex = trimmed.indexOf(",");
    currentName = commaIndex >= 0 ? trimmed.slice(commaIndex + 1).trim() : "Unknown";
  } else if (currentName && (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
    channels.push({
      id: `ch-${channels.length + 1}`,
      name: currentName,
      url: trimmed,
    });
    currentName = null;
  }
}

mkdirSync(join(root, "src", "data"), { recursive: true });
writeFileSync(outputPath, JSON.stringify(channels, null, 2));
console.log(`Parsed ${channels.length} channels → ${outputPath}`);
