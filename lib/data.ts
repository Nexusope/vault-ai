export type Idea = {
  id: string; title: string; creator: string; category: string; tags: string[];
  trend: number; saved: string; accent: string; insight: string;
  sourceUrl?: string;
  transcript?: string | null;
  mediaType?: string;
  confidence?: number;
  createdAt?: string;
};

export const ideas: Idea[] = [
  { id: "idea-01", title: "The 3-second tension hook", creator: "@framecraft", category: "Storytelling", tags: ["hook", "retention"], trend: 94, saved: "12m", accent: "#b6ff3b", insight: "Pattern interrupt in the first 18 frames lifts retention." },
  { id: "idea-02", title: "No-cut product reveal", creator: "@objects.daily", category: "Editing", tags: ["product", "one-take"], trend: 88, saved: "43m", accent: "#7bf1ff", insight: "The reveal pays off at 0:07 after tactile setup." },
  { id: "idea-03", title: "Founder myth vs. reality", creator: "@buildinpublic", category: "Business", tags: ["contrast", "founder"], trend: 91, saved: "1h", accent: "#ff6b2c", insight: "Contrarian text framing drives saves over likes." },
  { id: "idea-04", title: "Quiet luxury sound map", creator: "@sonicforms", category: "Audio", tags: ["audio", "aesthetic"], trend: 77, saved: "3h", accent: "#c792ff", insight: "Low-BPM foley is resurfacing across design niches." },
  { id: "idea-05", title: "Build a ritual, not a habit", creator: "@slow.systems", category: "Wellness", tags: ["ritual", "essay"], trend: 83, saved: "5h", accent: "#ffd166", insight: "Comment velocity is 2.4× the creator baseline." },
  { id: "idea-06", title: "Five frames of proof", creator: "@proofstack", category: "Education", tags: ["proof", "carousel"], trend: 72, saved: "1d", accent: "#ff85a1", insight: "Each frame resolves one objection before the CTA." },
];

export const activity = [
  ["TRANSCRIPT", "idea-01", "Completed", "00:18"],
  ["EMBED", "idea-03", "Indexed", "00:41"],
  ["GRAPH", "idea-02", "7 links", "01:03"],
  ["TREND", "idea-05", "+18.4%", "02:12"],
];
