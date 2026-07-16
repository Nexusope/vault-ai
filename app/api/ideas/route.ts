import { desc } from "drizzle-orm";
import { z } from "zod";
import { ensureSchema, getDb } from "../../../db";
import { ideas } from "../../../db/schema";

const createIdea = z.object({ title: z.string().trim().min(2).max(180), summary: z.string().trim().max(4000).default(""), sourceUrl: z.string().url().max(2048).optional(), creator: z.string().trim().max(100).default("unknown"), tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]) }).strict();
const routeError = (error: unknown) => { const message = error instanceof Error ? error.message : "Unexpected database error"; return message.includes("no such table") ? "Database schema is not initialized. Apply the generated D1 migration." : message; };

export async function GET() {
  try { await ensureSchema(); return Response.json({ ideas: await getDb().select().from(ideas).orderBy(desc(ideas.createdAt)).limit(100) }); }
  catch (error) { return Response.json({ error: routeError(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  const parsed = createIdea.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid idea", details: parsed.error.flatten() }, { status: 400 });
  try {
    await ensureSchema();
    const [idea] = await getDb().insert(ideas).values({ id: crypto.randomUUID(), ...parsed.data, source: parsed.data.sourceUrl?.includes("instagram.com") ? "instagram" : "manual", tags: JSON.stringify(parsed.data.tags) }).returning();
    return Response.json({ idea }, { status: 201 });
  } catch (error) { return Response.json({ error: routeError(error) }, { status: 500 }); }
}
