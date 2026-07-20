import assert from "node:assert/strict";
import test from "node:test";
import { ideas, type Idea } from "../lib/data.ts";
import { buildGalaxyGraph, enrichIdeas, galaxyContextForAI, semanticScore } from "../lib/galaxy.ts";

test("Galaxy enrichment is deterministic and never emits missing analysis fields", () => {
  const first = enrichIdeas(ideas);
  const second = enrichIdeas(ideas);
  assert.equal(first.length, ideas.length);
  assert.deepEqual(first.map((node) => node.position), second.map((node) => node.position));
  for (const node of first) {
    assert.ok(node.emotionalTone);
    assert.ok(node.storytellingStyle);
    assert.ok(node.editingStyle);
    assert.ok(node.audience);
    assert.match(node.hookAnalysis, /opening with a/i);
    assert.ok(node.position.every(Number.isFinite));
  }
});

test("Galaxy graph normalizes incomplete runtime records instead of crashing", () => {
  const malformed = [
    { id: "duplicate", title: "", creator: null, category: null, tags: null, trend: Number.NaN, saved: null, accent: "", insight: null },
    { id: "duplicate", title: "Partial capture", creator: "", category: "", tags: { bad: true }, trend: "91", saved: "", accent: "", insight: "" },
    { id: "third", title: "Audio proof", creator: "@creator", category: "Audio", tags: ["audio", "", 4, "proof"], trend: 82, saved: "now", accent: "#ff2d31", insight: "A usable record." },
  ] as unknown as Idea[];

  const graph = buildGalaxyGraph(malformed);
  assert.equal(graph.nodes.length, 3);
  assert.equal(new Set(graph.nodes.map((node) => node.id)).size, 3);
  assert.equal(graph.nodes[0].title, "Untitled signal");
  assert.equal(graph.nodes[0].topic, "Captured");
  assert.deepEqual(graph.nodes[1].keywords.includes("bad"), false);
  assert.deepEqual(graph.nodes[2].keywords.includes("audio"), true);
  for (const edge of graph.edges) {
    assert.ok(graph.nodes[edge.source]);
    assert.ok(graph.nodes[edge.target]);
    assert.ok(Number.isFinite(edge.strength));
    assert.ok(Number.isFinite(edge.confidence));
    assert.ok(edge.evidence.length > 0);
  }
  assert.doesNotThrow(() => semanticScore(graph.nodes[0], "emotional startup video"));
});

test("Galaxy graph handles empty input and produces bounded explainable AI context", () => {
  assert.deepEqual(buildGalaxyGraph([]), { nodes: [], edges: [], clusters: [] });
  const graph = buildGalaxyGraph(ideas);
  assert.ok(graph.edges.length > 0);
  assert.ok(graph.edges.every((edge) => edge.strength >= 0.25 && edge.strength <= 0.99));
  assert.ok(graph.edges.every((edge) => edge.confidence >= 0.68 && edge.confidence <= 0.99));
  const context = JSON.parse(galaxyContextForAI(ideas));
  assert.equal(context.nodeCount, ideas.length);
  assert.ok(context.nodes.length <= 16);
  assert.ok(context.relationships.length <= 24);
  assert.ok(context.relationships.every((relationship: { evidence?: string }) => relationship.evidence));
});
