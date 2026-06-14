"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { getProxyUrl } from "@/lib/channels";

interface VideoPlayerProps {
  streamUrl: string;
  channelName: string;
}

export default function VideoPlayer({ streamUrl, channelName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setStatus("loading");
    setErrorMessage("");

    const proxyUrl = getProxyUrl(streamUrl);

    const cleanup = () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeAttribute("src");
      video.load();
    };

    cleanup();

    const canPlayNatively =
      video.canPlayType("application/vnd.apple.mpegurl") !== "" ||
      video.canPlayType("application/x-mpegURL") !== "";

    if (canPlayNatively) {
      video.src = proxyUrl;
      video.addEventListener("loadedmetadata", () => setStatus("playing"), { once: true });
      video.addEventListener(
        "error",
        () => {
          setStatus("error");
          setErrorMessage("Stream failed to load. Try another channel.");
        },
        { once: true }
      );
      video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(proxyUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStatus("playing");
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setStatus("error");
          setErrorMessage("Stream unavailable. Select a different channel.");
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else {
      setStatus("error");
      setErrorMessage("HLS playback is not supported in this browser.");
    }

    return cleanup;
  }, [streamUrl]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
      <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm font-medium text-white/90">LIVE</span>
          <span className="ml-2 truncate text-sm text-white/70">{channelName}</span>
        </div>
      </div>

      <video
        ref={videoRef}
        className="aspect-video w-full bg-black"
        controls
        playsInline
        autoPlay
        muted
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
            <p className="text-sm text-white/70">Connecting to stream…</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
          <div className="max-w-sm text-center">
            <p className="text-lg font-medium text-white">Unable to play stream</p>
            <p className="mt-2 text-sm text-white/60">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
