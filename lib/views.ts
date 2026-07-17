export const views = [
  "dashboard",
  "library",
  "keep-clean",
  "galaxy",
  "fusion",
  "assistant",
  "search",
  "collections",
  "analytics",
  "notifications",
  "settings",
] as const;

export type ViewName = (typeof views)[number];
