import LiveTVApp from "@/components/LiveTVApp";
import channels from "@/data/channels.json";
import type { Channel } from "@/types/channel";

export default function Home() {
  return <LiveTVApp channels={channels as Channel[]} />;
}
