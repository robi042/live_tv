import type { Channel } from "@/types/channel";

export function getProxyUrl(streamUrl: string): string {
  return `/api/proxy?url=${encodeURIComponent(streamUrl)}`;
}

export function filterChannels(channels: Channel[], query: string): Channel[] {
  const q = query.trim().toLowerCase();
  if (!q) return channels;
  return channels.filter((ch) => ch.name.toLowerCase().includes(q));
}

export function groupChannelsByCategory(channels: Channel[]): Record<string, Channel[]> {
  const groups: Record<string, Channel[]> = {};

  for (const channel of channels) {
    const category = detectCategory(channel.name);
    if (!groups[category]) groups[category] = [];
    groups[category].push(channel);
  }

  const order = [
    "World Cup / Mundial",
    "ESPN",
    "Fox Sports",
    "TUDN",
    "Win Sports",
    "TyC Sports",
    "DAZN",
    "BeIN Sports",
    "DirectTV / DSports",
    "Other Sports",
  ];

  const sorted: Record<string, Channel[]> = {};
  for (const key of order) {
    if (groups[key]) sorted[key] = groups[key];
  }
  for (const key of Object.keys(groups)) {
    if (!sorted[key]) sorted[key] = groups[key];
  }

  return sorted;
}

function detectCategory(name: string): string {
  const n = name.toLowerCase();

  if (n.includes("mundial") || n.includes("nbc") || n.includes("team usa") || n.includes("universo") || n.includes("azteca")) {
    return "World Cup / Mundial";
  }
  if (n.includes("espn")) return "ESPN";
  if (n.includes("fox")) return "Fox Sports";
  if (n.includes("tudn")) return "TUDN";
  if (n.includes("win")) return "Win Sports";
  if (n.includes("tyc")) return "TyC Sports";
  if (n.includes("dazn")) return "DAZN";
  if (n.includes("bein") || n.includes("bei n")) return "BeIN Sports";
  if (n.includes("dsport") || n.includes("directv") || n.includes("d sports")) return "DirectTV / DSports";

  return "Other Sports";
}
