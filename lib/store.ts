"use client";

import { create } from "zustand";
import { ideas as seedIdeas, type Idea } from "./data";

type StoredIdea = { id: string; title: string; creator: string; summary: string; source: string; tags: string };

type VaultState = {
  selectedIds: string[];
  ideas: Idea[];
  commandOpen: boolean;
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  setCommandOpen: (open: boolean) => void;
  hydrateIdeas: (records: StoredIdea[]) => void;
  addIdea: (idea: Idea) => void;
  enabledProviders: Record<string, boolean>;
  setEnabledProviders: (providers: Record<string, boolean>) => void;
  toggleProvider: (provider: string) => void;
  dismissedNotifications: string[];
  dismissNotification: (title: string) => void;
};

export const useVaultStore = create<VaultState>((set) => ({
  selectedIds: [],
  ideas: seedIdeas,
  enabledProviders: { openrouter: true, nvidia: true, groq: true, gemini: true, cerebras: true },
  dismissedNotifications: [],
  commandOpen: false,
  toggleSelected: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter((item) => item !== id)
      : [...state.selectedIds, id],
  })),
  clearSelected: () => set({ selectedIds: [] }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  hydrateIdeas: (records) => set((state) => {
    const remote = records.map((record, index): Idea => ({
      id: record.id,
      title: record.title,
      creator: record.creator || "unknown",
      category: record.source === "instagram" ? "Instagram" : "Captured",
      tags: (() => { try { return JSON.parse(record.tags || "[]") as string[]; } catch { return []; } })(),
      trend: 50,
      saved: "now",
      accent: ["#b6ff3b", "#7bf1ff", "#ff6b2c"][index % 3],
      insight: record.summary || "Captured signal awaiting enrichment.",
    }));
    const remoteIds = new Set(remote.map((idea) => idea.id));
    return { ideas: [...remote, ...state.ideas.filter((idea) => !remoteIds.has(idea.id))] };
  }),
  addIdea: (idea) => set((state) => ({ ideas: [idea, ...state.ideas.filter((item) => item.id !== idea.id)] })),
  setEnabledProviders: (enabledProviders) => set({ enabledProviders }),
  toggleProvider: (provider) => set((state) => {
    const enabledProviders = { ...state.enabledProviders, [provider]: !state.enabledProviders[provider] };
    if (typeof localStorage !== "undefined") localStorage.setItem("vault-ai:providers", JSON.stringify(enabledProviders));
    return { enabledProviders };
  }),
  dismissNotification: (title) => set((state) => {
    const dismissedNotifications = [...new Set([...state.dismissedNotifications, title])];
    if (typeof localStorage !== "undefined") localStorage.setItem("vault-ai:dismissed-notifications", JSON.stringify(dismissedNotifications));
    return { dismissedNotifications };
  }),
}));
