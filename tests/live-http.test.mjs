import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.VAULT_BASE_URL || "http://localhost:3000";

test("live routes and health respond", async () => {
  for (const route of ["/", "/library", "/galaxy", "/fusion", "/assistant", "/search", "/collections", "/analytics", "/notifications", "/settings"]) {
    const response = await fetch(base + route); assert.equal(response.status, 200, route);
    const html = await response.text(); assert.match(html, /VAULT\/\/AI/, route);
  }
  const health = await fetch(base + "/api/health"); assert.equal(health.status, 200);
  assert.equal((await health.json()).service, "vault-ai");
});

test("live API rejects invalid input and persists a valid idea", async () => {
  const invalidIdea = await fetch(base + "/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "" }) });
  assert.equal(invalidIdea.status, 400);
  const invalidAI = await fetch(base + "/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: "" }) });
  assert.equal(invalidAI.status, 400);
  const unknownField = await fetch(base + "/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "Strict payload", unexpected: true }) });
  assert.equal(unknownField.status, 400);
  const disabledProviders = await fetch(base + "/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: "Verify disabled routing", providers: [] }) });
  assert.equal(disabledProviders.status, 503); assert.equal((await disabledProviders.json()).fallbackCount, 0);
  const title = `QA capture ${Date.now()}`;
  const sourceUrl = `https://example.com/vault-qa/${Date.now()}`;
  const created = await fetch(base + "/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, sourceUrl, summary: "Automated persistence verification", tags: ["qa"] }) });
  assert.equal(created.status, 201); const createdIdea = (await created.json()).idea; assert.equal(createdIdea.title, title); assert.equal(createdIdea.sourceUrl, sourceUrl);
  const list = await fetch(base + "/api/ideas"); assert.equal(list.status, 200);
  assert.ok((await list.json()).ideas.some((idea) => idea.title === title && idea.sourceUrl === sourceUrl));
});

test("server-rendered collection filters do not leak unrelated ideas", async () => {
  const hook = await (await fetch(base + "/library?q=hook")).text();
  assert.match(hook, /3-second tension hook/); assert.doesNotMatch(hook, /Quiet luxury sound map/);
  const empty = await (await fetch(base + "/library?q=__empty_collection__")).text();
  assert.match(empty, /NO MATCHING SIGNAL/); assert.doesNotMatch(empty, /Quiet luxury sound map/);
});

test("local Instagram bridge health is installed, bounded, and credential-safe", async () => {
  const started = performance.now();
  const response = await fetch("http://127.0.0.1:4317/health", { signal: AbortSignal.timeout(2_000) });
  assert.equal(response.status, 200); assert.ok(performance.now() - started < 2_000);
  const health = await response.json(); assert.equal(health.ok, true); assert.equal(typeof health.authenticated, "boolean");
  assert.equal(Object.hasOwn(health, "password"), false); assert.equal(Object.hasOwn(health, "session"), false);
});
