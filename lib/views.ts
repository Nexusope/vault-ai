export const views = [
  "dashboard",
  "library",
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
