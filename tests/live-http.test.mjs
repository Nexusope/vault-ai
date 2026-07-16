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
  const title = `QA capture ${Date.now()}`;
  const created = await fetch(base + "/api/ideas", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title, summary: "Automated persistence verification", tags: ["qa"] }) });
  assert.equal(created.status, 201); assert.equal((await created.json()).idea.title, title);
  const list = await fetch(base + "/api/ideas"); assert.equal(list.status, 200);
  assert.ok((await list.json()).ideas.some((idea) => idea.title === title));
});
