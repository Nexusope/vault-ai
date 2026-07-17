type LinkEnrichment = { title?: string; description?: string; thumbnailUrl?: string; creator?: string; hook?: string };

const privateHost = /^(localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|::1$|\[::1\]$)/i;

function decode(value: string) {
  return value
    .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ").trim();
}

function attribute(tag: string, name: string) {
  const quoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  if (quoted?.[2]) return decode(quoted[2]);
  return decode(tag.match(new RegExp(`\\b${name}\\s*=\\s*([^\\s>]+)`, "i"))?.[1] || "");
}

function meta(html: string, keys: string[]) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const key = attribute(tag, "property") || attribute(tag, "name");
    if (keys.some((candidate) => candidate.toLowerCase() === key.toLowerCase())) {
      const content = attribute(tag, "content");
      if (content) return content;
    }
  }
}

function hookFrom(description?: string, title?: string) {
  const cleaned = decode(description || "")
    .replace(/^[\d,.KkMm]+\s+likes?,?\s+[\d,.KkMm]+\s+comments?\s*[-–—:]?\s*/i, "")
    .replace(/^.*?\bon Instagram:\s*/i, "")
    .replace(/^[“”"']+|[“”"']+$/g, "");
  const candidate = cleaned || decode(title || "");
  if (!candidate) return undefined;
  const first = candidate.match(/^.{1,220}?(?:[.!?](?:\s|$)|$)/)?.[0] || candidate.slice(0, 220);
  return first.trim();
}

export async function enrichLink(sourceUrl: string): Promise<LinkEnrichment> {
  try {
    const url = new URL(sourceUrl);
    if (!/^https?:$/.test(url.protocol) || privateHost.test(url.hostname) || url.hostname.endsWith(".local")) return {};
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; VaultAI/1.0; +https://creator-vault.app)" },
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return {};
    const length = Number(response.headers.get("content-length") || 0);
    if (length > 1_500_000) return {};
    const html = (await response.text()).slice(0, 750_000);
    const title = meta(html, ["og:title", "twitter:title"]) || decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "") || undefined;
    const description = meta(html, ["og:description", "twitter:description", "description"]);
    const image = meta(html, ["og:image:secure_url", "og:image", "twitter:image"]);
    const creator = meta(html, ["author", "twitter:creator"]);
    return {
      title,
      description,
      thumbnailUrl: image ? new URL(image, response.url).toString() : undefined,
      creator,
      hook: hookFrom(description, title),
    };
  } catch {
    return {};
  }
}
