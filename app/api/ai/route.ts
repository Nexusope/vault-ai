import { z } from "zod";
import { routeAI } from "../../../lib/ai-providers";

const provider = z.enum(["openrouter", "groq", "nvidia", "gemini", "cerebras"]);
const requestSchema = z.object({ prompt: z.string().trim().min(2).max(8000), provider: provider.optional(), providers: z.array(provider).max(5).optional() }).strict();

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "A valid prompt is required", details: parsed.error.flatten() }, { status: 400 });
  const result = await routeAI(parsed.data.prompt, parsed.data.provider, parsed.data.providers);
  return Response.json(result, { status: result.provider === "local" ? 503 : 200 });
}
