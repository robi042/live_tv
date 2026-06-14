import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_PROTOCOLS = ["http:", "https:"];

function resolveUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

function rewritePlaylist(body: string, baseUrl: string, origin: string): string {
  const base = new URL(baseUrl);
  const proxyBase = `${origin}/api/proxy?url=`;

  return body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        if (trimmed.startsWith("#EXT-X-KEY")) {
          const uriMatch = trimmed.match(/URI="([^"]+)"/);
          if (uriMatch) {
            const keyUrl = resolveUrl(base.href, uriMatch[1]);
            return trimmed.replace(uriMatch[1], `${proxyBase}${encodeURIComponent(keyUrl)}`);
          }
        }
        return line;
      }
      const absolute = resolveUrl(base.href, trimmed);
      return `${proxyBase}${encodeURIComponent(absolute)}`;
    })
    .join("\n");
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return NextResponse.json({ error: "Protocol not allowed" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LiveTV/1.0)",
        Accept: "*/*",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    const origin = request.nextUrl.origin;

    if (
      contentType.includes("mpegurl") ||
      contentType.includes("m3u") ||
      contentType.includes("text/plain") ||
      contentType.includes("application/vnd.apple.mpegurl")
    ) {
      const body = await upstream.text();
      if (body.trim().startsWith("#EXTM3U")) {
        const rewritten = rewritePlaylist(body, url, origin);
        return new NextResponse(rewritten, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.apple.mpegurl",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store",
          },
        });
      }
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
