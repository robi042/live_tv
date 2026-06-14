"use client";

import { useState } from "react";
import type { Channel } from "@/types/channel";
import ChannelList from "@/components/ChannelList";
import VideoPlayer from "@/components/VideoPlayer";

interface LiveTVAppProps {
  channels: Channel[];
}

export default function LiveTVApp({ channels }: LiveTVAppProps) {
  const defaultChannel =
    channels.find((ch) => ch.name.toLowerCase().includes("mundial")) ?? channels[0] ?? null;

  const [selected, setSelected] = useState<Channel | null>(defaultChannel);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = (channel: Channel) => {
    setSelected(channel);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-lg font-bold text-white shadow-lg">
              ⚽
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                FIFA World Cup 2026
              </h1>
              <p className="text-xs text-white/50">Live TV Streams</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 lg:hidden"
          >
            {sidebarOpen ? "Hide Channels" : "Channels"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section>
            {selected ? (
              <VideoPlayer streamUrl={selected.url} channelName={selected.name} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5">
                <p className="text-white/50">Select a channel to start watching</p>
              </div>
            )}

            {selected && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="font-semibold text-white">{selected.name}</h2>
                <p className="mt-1 text-xs text-white/40">
                  Streams are provided via M3U playlist. Availability may vary by region and provider.
                </p>
              </div>
            )}
          </section>

          <aside
            className={`lg:block ${sidebarOpen ? "block" : "hidden"} h-[calc(100vh-8rem)] lg:h-[calc(100vh-10rem)]`}
          >
            <ChannelList
              channels={channels}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
            />
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center">
        <p className="text-xs text-white/30">
          Built for FIFA World Cup 2026 · Developed by Robi
        </p>
        <p className="mt-2 text-xs text-white/40">
          Reach me on{" "}
          <a
            href="https://www.facebook.com/officialrabiulrobi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 underline-offset-2 transition hover:text-emerald-400 hover:underline"
          >
            Facebook
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/rabiul-hasan-robi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 underline-offset-2 transition hover:text-emerald-400 hover:underline"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
