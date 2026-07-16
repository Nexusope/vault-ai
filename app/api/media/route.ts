import { env } from "cloudflare:workers";

type StoredMedia = { body: ReadableStream; customMetadata?: Record<string, string> };
type MediaBucket = { put: (key: string, value: ArrayBuffer, options?: { customMetadata?: Record<string, string>; httpMetadata?: { contentType?: string } }) => Promise<void>; get: (key: string) => Promise<StoredMedia | null> };
const bucket = () => (env as unknown as { MEDIA?: MediaBucket }).MEDIA;
const allowed = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "image/gif", "audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/ogg"]);
const extension = (file: File) => (file.name.split(".").pop() || file.type.split("/").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);

export async function POST(request: Request) {
  const media = bucket();
  if (!media) return Response.json({ error: "Media storage is unavailable" }, { status: 503 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "A media file is required" }, { status: 400 });
  if (!allowed.has(file.type)) return Response.json({ error: "Unsupported media type" }, { status: 415 });
  if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Media must be 20 MB or smaller" }, { status: 413 });
  const key = `vault/${crypto.randomUUID()}.${extension(file)}`;
  await media.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { name: file.name.slice(0, 180), type: file.type } });
  const origin = new URL(request.url).origin;
  const kind = file.type === "application/pdf" ? "pdf" : file.type.startsWith("audio/") ? "voice-note" : "image";
  return Response.json({ key, kind, name: file.name, mediaUrl: `${origin}/api/media?key=${encodeURIComponent(key)}` }, { status: 201 });
}

export async function GET(request: Request) {
  const media = bucket();
  if (!media) return Response.json({ error: "Media storage is unavailable" }, { status: 503 });
  const key = new URL(request.url).searchParams.get("key");
  if (!key || !/^vault\/[a-f0-9-]+\.[a-z0-9]{1,8}$/.test(key)) return Response.json({ error: "Invalid media key" }, { status: 400 });
  const object = await media.get(key);
  if (!object) return Response.json({ error: "Media not found" }, { status: 404 });
  return new Response(object.body, { headers: { "content-type": object.customMetadata?.type || "application/octet-stream", "cache-control": "private, max-age=3600", "content-disposition": `inline; filename="${(object.customMetadata?.name || "vault-media").replace(/["\r\n]/g, "")}"` } });
}
