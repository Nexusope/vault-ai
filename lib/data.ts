export type Idea = {
  id: string; title: string; creator: string; category: string; tags: string[];
  trend: number; saved: string; accent: string; insight: string;
  thumbnail?: string;
  hook?: string;
  views?: number;
  likes?: number;
  comments?: number;
  duration?: string;
  savedNote?: string;
  platform?: string;
  sourceUrl?: string;
  transcript?: string | null;
  mediaType?: string;
  confidence?: number;
  createdAt?: string;
};

export const ideas: Idea[] = [
  { id: "idea-01", title: "The 3-second tension hook", creator: "@framecraft", category: "Storytelling", platform: "Instagram", tags: ["hook", "retention"], trend: 94, saved: "12m", accent: "#b6ff3b", thumbnail: "/saves/01-hook.jpg", duration: "0:18", views: 218400, likes: 17400, comments: 412, hook: "You have three seconds to make them need the answer.", savedNote: "Saved for the tension-first opening and immediate promise.", insight: "Pattern interrupt in the first 18 frames lifts retention." },
  { id: "idea-02", title: "No-cut product reveal", creator: "@objects.daily", category: "Editing", platform: "Instagram", tags: ["product", "one-take"], trend: 88, saved: "43m", accent: "#7bf1ff", thumbnail: "/saves/02-product.jpg", duration: "0:24", views: 146900, likes: 12800, comments: 207, hook: "This entire product reveal was filmed in one take.", savedNote: "The tactile setup makes the reveal feel earned, not advertised.", insight: "The reveal pays off at 0:07 after tactile setup." },
  { id: "idea-03", title: "Founder myth vs. reality", creator: "@buildinpublic", category: "Business", platform: "TikTok", tags: ["contrast", "founder"], trend: 91, saved: "1h", accent: "#ff6b2c", thumbnail: "/saves/03-founder.jpg", duration: "0:31", views: 388200, likes: 32100, comments: 1800, hook: "The founder story everyone tells you is wrong.", savedNote: "Use the contrarian first line before revealing the personal proof.", insight: "Contrarian text framing drives saves over likes." },
  { id: "idea-04", title: "Quiet luxury sound map", creator: "@sonicforms", category: "Audio", platform: "Instagram", tags: ["audio", "aesthetic"], trend: 77, saved: "3h", accent: "#c792ff", thumbnail: "/saves/04-audio.jpg", duration: "0:16", views: 82400, likes: 6700, comments: 164, hook: "Luxury is not what you see. It is what you hear.", savedNote: "Saved for its low-volume sound design and restrained pacing.", insight: "Low-BPM foley is resurfacing across design niches." },
  { id: "idea-05", title: "Build a ritual, not a habit", creator: "@slow.systems", category: "Wellness", platform: "TikTok", tags: ["ritual", "essay"], trend: 83, saved: "5h", accent: "#ffd166", thumbnail: "/saves/05-ritual.jpg", duration: "0:42", views: 264700, likes: 28900, comments: 2400, hook: "Stop building habits. Build a ritual you miss.", savedNote: "The reframe is simple enough to remember and specific enough to remix.", insight: "Comment velocity is 2.4× the creator baseline." },
  { id: "idea-06", title: "Five frames of proof", creator: "@proofstack", category: "Education", platform: "Instagram", tags: ["proof", "carousel"], trend: 72, saved: "1d", accent: "#ff85a1", thumbnail: "/saves/06-proof.jpg", duration: "5 slides", views: 57400, likes: 4900, comments: 93, hook: "Five frames. Five objections. Zero wasted motion.", savedNote: "Keep the objection-per-frame structure for the next product carousel.", insight: "Each frame resolves one objection before the CTA." },
];

export const activity = [
  ["TRANSCRIPT", "idea-01", "Completed", "00:18"],
  ["EMBED", "idea-03", "Indexed", "00:41"],
  ["GRAPH", "idea-02", "7 links", "01:03"],
  ["TREND", "idea-05", "+18.4%", "02:12"],
];
