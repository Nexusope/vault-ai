import { desc } from "drizzle-orm";
import { z } from "zod";
import { ensureSchema, getDb } from "../../../db";
import { ideas } from "../../../db/schema";

const createIdea = z.object({ title: z.string().trim().min(2).max(180), summary: z.string().trim().max(4000).default(""), sourceUrl: z.string().url().max(2048).optional(), creator: z.string().trim().max(100).default("unknown"), mediaType: z.enum(["post", "pdf", "image", "voice-note"]).default("post"), tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]) }).strict();
const listIdeas = z.object({ limit: z.coerce.number().int().min(1).max(500).default(250), offset: z.coerce.number().int().min(0).max(100_000).default(0) });
const routeError = (error: unknown) => { const message = error instanceof Error ? error.message : "Unexpected database error"; return message.includes("no such table") ? "Database schema is not initialized. Apply the generated D1 migration." : message; };
const sourceFromUrl = (sourceUrl?: string) => {
  if (!sourceUrl) return "manual";
  const parsed = new URL(sourceUrl);
  if (parsed.pathname === "/api/media") return "upload";
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host.includes("instagram")) return "instagram";
  if (host.includes("tiktok")) return "tiktok";
  if (host.includes("youtube") || host === "youtu.be") return "youtube";
  if (host === "x.com" || host.includes("twitter")) return "x";
  if (host.includes("threads")) return "threads";
  if (host.includes("pinterest") || host === "pin.it") return "pinterest";
  if (host.includes("reddit")) return "reddit";
  if (host.includes("facebook") || host === "fb.watch") return "facebook";
  return "web";
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = listIdeas.safeParse({ limit: url.searchParams.get("limit") || undefined, offset: url.searchParams.get("offset") || undefined });
  if (!parsed.success) return Response.json({ error: "Invalid pagination", details: parsed.error.flatten() }, { status: 400 });
  try {
    await ensureSchema();
    const rows = await getDb().select().from(ideas).orderBy(desc(ideas.createdAt)).limit(parsed.data.limit + 1).offset(parsed.data.offset);
    const hasMore = rows.length > parsed.data.limit;
    return Response.json({ ideas: rows.slice(0, parsed.data.limit), pagination: { offset: parsed.data.offset, limit: parsed.data.limit, nextOffset: hasMore ? parsed.data.offset + parsed.data.limit : null, hasMore } });
  }
  catch (error) { return Response.json({ error: routeError(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  const parsed = createIdea.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid idea", details: parsed.error.flatten() }, { status: 400 });
  try {
    await ensureSchema();
    const [idea] = await getDb().insert(ideas).values({ id: crypto.randomUUID(), ...parsed.data, source: sourceFromUrl(parsed.data.sourceUrl), tags: JSON.stringify(parsed.data.tags) }).returning();
    return Response.json({ idea }, { status: 201 });
  } catch (error) { return Response.json({ error: routeError(error) }, { status: 500 }); }
}
