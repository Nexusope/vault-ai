import { asc } from "drizzle-orm";
import { z } from "zod";
import { ensureSchema, getDb } from "../../../db";
import { ideaReviewActions } from "../../../db/schema";

const reviewAction = z.object({
  ideaId: z.string().trim().min(1).max(128),
  decision: z.enum(["pending", "keep", "clean"]),
  important: z.boolean(),
}).strict();

export async function GET() {
  try {
    await ensureSchema();
    const actions = await getDb().select().from(ideaReviewActions).orderBy(asc(ideaReviewActions.updatedAt));
    return Response.json({ actions });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load review actions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const parsed = reviewAction.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid review action", details: parsed.error.flatten() }, { status: 400 });
  try {
    await ensureSchema();
    const updatedAt = new Date().toISOString();
    const [action] = await getDb().insert(ideaReviewActions).values({ ...parsed.data, updatedAt }).onConflictDoUpdate({
      target: ideaReviewActions.ideaId,
      set: { decision: parsed.data.decision, important: parsed.data.important, updatedAt },
    }).returning();
    return Response.json({ action });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to save review action" }, { status: 500 });
  }
}
