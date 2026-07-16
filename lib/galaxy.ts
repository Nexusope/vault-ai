import type { Idea } from "./data";

export type RelationshipKind = "Similar Topic" | "Similar Audience" | "Similar Hook" | "Similar Editing Style" | "Similar Storytelling" | "Shared Creator" | "Trending Together" | "Complements" | "High Semantic Similarity";

export type GalaxyNode = Idea & {
  platform: string;
  topic: string;
  niche: string;
  keywords: string[];
  emotionalTone: string;
  storytellingStyle: string;
  editingStyle: string;
  hookAnalysis: string;
  audience: string;
  confidence: number;
  virality: number;
  importance: number;
  favorite: boolean;
  collections: string[];
  savedOrder: number;
  position: [number, number, number];
};

export type GalaxyEdge = { source: number; target: number; strength: number; type: RelationshipKind };
export type GalaxyCluster = { name: string; color: string; count: number; center: [number, number, number]; averageTrend: number };
export type GalaxyGraph = { nodes: GalaxyNode[]; edges: GalaxyEdge[]; clusters: GalaxyCluster[] };

const tones = ["Curiosity", "Contrarian", "Aspirational", "Reflective", "Urgent", "Calm confidence"];
const stories = ["Open loop", "Myth vs. reality", "Proof-first", "Personal confession", "Transformation", "Tutorial arc"];
const edits = ["Single take", "Fast-cut montage", "Text-led", "Tactile macro", "Quiet cinematic", "Carousel rhythm"];
const audiences = ["Startup founders", "Independent creators", "Design leaders", "Growth teams", "Curious builders", "Creative strategists"];
const categoryColors = ["#b6ff3b", "#7bf1ff", "#ff6b2c", "#c792ff", "#ffd166", "#ff85a1", "#8fb6ff", "#80ffce"];

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) value = Math.imul(value ^ input.charCodeAt(index), 16777619);
  return value >>> 0;
}

function platformFor(idea: Idea) {
  const url = idea.sourceUrl?.toLowerCase() || "";
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("tiktok")) return "TikTok";
  if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("x.com") || url.includes("twitter")) return "X";
  if (url.includes("reddit")) return "Reddit";
  if (url) return "Web";
  return idea.category === "Captured" ? "Note" : idea.category;
}

function tokens(value: string) {
  return [...new Set(value.toLowerCase().replace(/[^a-z0-9@]+/g, " ").split(" ").filter((token) => token.length > 2))];
}

export function enrichIdeas(ideas: Idea[]): GalaxyNode[] {
  const groups = new Map<string, Idea[]>();
  ideas.forEach((idea) => groups.set(idea.category, [...(groups.get(idea.category) || []), idea]));
  const categories = [...groups.keys()];
  const centers = new Map(categories.map((category, index) => {
    const angle = (index / Math.max(categories.length, 1)) * Math.PI * 2;
    const ring = 2.6 + (index % 3) * 0.7;
    return [category, [Math.cos(angle) * ring, Math.sin(angle) * ring * 0.65, Math.sin(angle * 1.7) * 1.4] as [number, number, number]];
  }));
  const categoryOffsets = new Map<string, number>();

  return ideas.map((idea, index) => {
    const seed = hash(idea.id + idea.title);
    const within = categoryOffsets.get(idea.category) || 0;
    categoryOffsets.set(idea.category, within + 1);
    const center = centers.get(idea.category) || [0, 0, 0];
    const angle = within * 2.399963 + (seed % 90) / 90;
    const radius = 0.35 + Math.sqrt(within + 1) * 0.42;
    const position: [number, number, number] = [
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius * 0.72,
      center[2] + (((seed >> 5) % 100) / 100 - 0.5) * 1.4,
    ];
    const keywords = [...new Set([...idea.tags, ...tokens(`${idea.title} ${idea.insight}`)].slice(0, 9))];
    const confidence = idea.confidence && idea.confidence > 0 ? Math.round(idea.confidence) : 66 + (seed % 33);
    const virality = Math.min(99, Math.round(idea.trend * 0.76 + (seed % 24)));
    return {
      ...idea,
      accent: idea.accent || categoryColors[categories.indexOf(idea.category) % categoryColors.length],
      platform: platformFor(idea),
      topic: idea.category,
      niche: idea.tags[0] || idea.category,
      keywords,
      emotionalTone: tones[seed % tones.length],
      storytellingStyle: stories[(seed >> 3) % stories.length],
      editingStyle: edits[(seed >> 6) % edits.length],
      hookAnalysis: `${stories[(seed >> 3) % stories.length]} opening with a ${tones[seed % tones.length].toLowerCase()} tension pattern.`,
      audience: audiences[(seed >> 9) % audiences.length],
      confidence,
      virality,
      importance: Math.round((idea.trend + confidence + virality) / 3),
      favorite: idea.trend >= 90,
      collections: idea.tags.slice(0, 2).map((tag) => tag.toUpperCase()),
      savedOrder: index,
      position,
    };
  });
}

function relationship(a: GalaxyNode, b: GalaxyNode): { strength: number; type: RelationshipKind } {
  const sharedKeywords = a.keywords.filter((keyword) => b.keywords.includes(keyword)).length;
  const sameCreator = a.creator !== "unknown" && a.creator === b.creator;
  const sameTopic = a.topic === b.topic;
  const sameAudience = a.audience === b.audience;
  const sameHook = a.storytellingStyle === b.storytellingStyle;
  const sameEdit = a.editingStyle === b.editingStyle;
  const trendAffinity = 1 - Math.min(1, Math.abs(a.trend - b.trend) / 40);
  let strength = sharedKeywords * 0.16 + (sameTopic ? 0.32 : 0) + (sameAudience ? 0.13 : 0) + (sameHook ? 0.12 : 0) + (sameEdit ? 0.09 : 0) + trendAffinity * 0.09;
  if (sameCreator) strength = Math.max(strength, 0.94);
  const type: RelationshipKind = sameCreator ? "Shared Creator" : sharedKeywords > 1 ? "High Semantic Similarity" : sameTopic ? "Similar Topic" : sameAudience ? "Similar Audience" : sameHook ? "Similar Hook" : sameEdit ? "Similar Editing Style" : trendAffinity > 0.85 ? "Trending Together" : "Complements";
  return { strength: Math.min(0.99, strength), type };
}

export function buildGalaxyGraph(ideas: Idea[]): GalaxyGraph {
  const nodes = enrichIdeas(ideas);
  const buckets = new Map<string, number[]>();
  nodes.forEach((node, index) => {
    [`topic:${node.topic}`, `audience:${node.audience}`, `hook:${node.storytellingStyle}`, ...node.keywords.map((keyword) => `keyword:${keyword}`)].forEach((key) => buckets.set(key, [...(buckets.get(key) || []), index]));
  });
  const edges: GalaxyEdge[] = [];
  const seen = new Set<string>();
  nodes.forEach((node, index) => {
    const candidates = new Set<number>();
    [`topic:${node.topic}`, `audience:${node.audience}`, `hook:${node.storytellingStyle}`, ...node.keywords.map((keyword) => `keyword:${keyword}`)].forEach((key) => {
      (buckets.get(key) || []).slice(0, 96).forEach((candidate) => { if (candidate !== index) candidates.add(candidate); });
    });
    if (nodes.length > 1) candidates.add((index + 1) % nodes.length);
    [...candidates]
      .map((candidate) => ({ candidate, ...relationship(node, nodes[candidate]) }))
      .filter((edge) => edge.strength >= 0.25)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 7)
      .forEach((edge) => {
        const key = index < edge.candidate ? `${index}:${edge.candidate}` : `${edge.candidate}:${index}`;
        if (!seen.has(key)) { seen.add(key); edges.push({ source: index, target: edge.candidate, strength: edge.strength, type: edge.type }); }
      });
  });
  const clusters = [...new Set(nodes.map((node) => node.topic))].map((name, index): GalaxyCluster => {
    const members = nodes.filter((node) => node.topic === name);
    const center = members.reduce<[number, number, number]>((sum, node) => [sum[0] + node.position[0], sum[1] + node.position[1], sum[2] + node.position[2]], [0, 0, 0]).map((value) => value / Math.max(1, members.length)) as [number, number, number];
    return { name, color: members[0]?.accent || categoryColors[index % categoryColors.length], count: members.length, center, averageTrend: Math.round(members.reduce((sum, node) => sum + node.trend, 0) / Math.max(1, members.length)) };
  });
  return { nodes, edges, clusters };
}

const semanticAliases: Record<string, string[]> = {
  emotional: ["confession", "reflective", "story", "tone", "founder"],
  startup: ["business", "founder", "build", "product"],
  ai: ["intelligence", "automation", "tutorial", "system"],
  psychology: ["ritual", "wellness", "behavior", "audience", "emotion"],
  viral: ["hook", "retention", "trend", "proof"],
  video: ["editing", "audio", "reveal", "frames", "take"],
};

export function semanticScore(node: GalaxyNode, query: string) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return 1;
  const expanded = queryTokens.flatMap((token) => [token, ...(semanticAliases[token] || [])]);
  const corpus = `${node.title} ${node.creator} ${node.topic} ${node.niche} ${node.keywords.join(" ")} ${node.insight} ${node.emotionalTone} ${node.storytellingStyle} ${node.editingStyle} ${node.audience}`.toLowerCase();
  const matches = expanded.filter((token) => corpus.includes(token)).length;
  return matches / Math.max(queryTokens.length, 1);
}

export function relationshipLabel(graph: GalaxyGraph, sourceId: string, targetId: string) {
  const source = graph.nodes.findIndex((node) => node.id === sourceId);
  const target = graph.nodes.findIndex((node) => node.id === targetId);
  return graph.edges.find((edge) => (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source));
}

export function galaxyContextForAI(ideas: Idea[]) {
  const graph = buildGalaxyGraph(ideas.slice(0, 240));
  const nodes = graph.nodes.slice(0, 16).map((node) => ({ id: node.id, title: node.title, topic: node.topic, creator: node.creator, tags: node.tags, tone: node.emotionalTone, hook: node.storytellingStyle, audience: node.audience, trend: node.trend }));
  const relationships = graph.edges.slice(0, 24).map((edge) => ({ from: graph.nodes[edge.source].title, to: graph.nodes[edge.target].title, type: edge.type, strength: Math.round(edge.strength * 100) }));
  return JSON.stringify({ nodeCount: ideas.length, clusterCount: graph.clusters.length, nodes, relationships });
}
