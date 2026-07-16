import { env } from "cloudflare:workers";

type Provider = "openrouter" | "groq" | "nvidia" | "gemini" | "cerebras";

const endpoints: Record<Exclude<Provider, "gemini">, { url: string; model: string; key: string }> = {
  openrouter: { url: "https://openrouter.ai/api/v1/chat/completions", model: "openai/gpt-4.1-mini", key: "OPENROUTER_API_KEY" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile", key: "GROQ_API_KEY" },
  nvidia: { url: "https://integrate.api.nvidia.com/v1/chat/completions", model: "meta/llama-3.3-70b-instruct", key: "NVIDIA_API_KEY" },
  cerebras: { url: "https://api.cerebras.ai/v1/chat/completions", model: "llama-3.3-70b", key: "CEREBRAS_API_KEY" },
};

const runtimeEnv = () => env as unknown as Record<string, string | undefined>;

async function callOpenAICompatible(provider: Exclude<Provider, "gemini">, prompt: string) {
  const config = endpoints[provider];
  const key = runtimeEnv()[config.key];
  if (!key) throw new Error(`${config.key} is not configured`);
  const response = await fetch(config.url, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: config.model, temperature: 0.5, max_tokens: 700, messages: [
      { role: "system", content: "You are Vault AI, a precise creative intelligence analyst. Return useful, concrete guidance without hype." },
      { role: "user", content: prompt },
    ] }),
  });
  if (!response.ok) throw new Error(`${provider} returned ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${provider} returned an empty result`);
  return content;
}

async function callGemini(prompt: string) {
  const key = runtimeEnv().GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 700 } }),
  });
  if (!response.ok) throw new Error(`gemini returned ${response.status}`);
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
  if (!content) throw new Error("gemini returned an empty result");
  return content;
}

export async function routeAI(prompt: string, preferred?: Provider, enabled?: Provider[]) {
  const base: Provider[] = ["openrouter", "groq", "gemini", "cerebras", "nvidia"];
  const allowed = enabled ? new Set(enabled) : null;
  const candidates = allowed ? base.filter((provider) => allowed.has(provider)) : base;
  const order = preferred && candidates.includes(preferred) ? [preferred, ...candidates.filter((item) => item !== preferred)] : candidates;
  const failures: string[] = [];
  for (const provider of order) {
    try {
      const content = provider === "gemini" ? await callGemini(prompt) : await callOpenAICompatible(provider, prompt);
      return { provider, content, fallbackCount: failures.length };
    } catch (error) { failures.push(error instanceof Error ? error.message : `${provider} failed`); }
  }
  return { provider: "local" as const, content: "Provider credentials are not available in this runtime yet. The routing layer is healthy; add one server-side provider secret to enable live generation.", fallbackCount: failures.length, failures };
}
