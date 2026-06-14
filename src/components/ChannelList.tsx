"use client";

import { useMemo, useState } from "react";
import type { Channel } from "@/types/channel";
import { filterChannels, groupChannelsByCategory } from "@/lib/channels";

interface ChannelListProps {
  channels: Channel[];
  selectedId: string | null;
  onSelect: (channel: Channel) => void;
}

export default function ChannelList({ channels, selectedId, onSelect }: ChannelListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => filterChannels(channels, search), [channels, search]);
  const grouped = useMemo(() => groupChannelsByCategory(filtered), [filtered]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="border-b border-white/10 p-4">
        <h2 className="text-lg font-semibold text-white">Channels</h2>
        <p className="mt-1 text-xs text-white/50">{channels.length} streams available</p>
        <div className="relative mt-3">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search channels…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-white/50">No channels match your search.</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((channel) => {
                  const isSelected = channel.id === selectedId;
                  return (
                    <li key={channel.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(channel)}
                        className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="line-clamp-2">{channel.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
