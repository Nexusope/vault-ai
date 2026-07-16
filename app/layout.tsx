import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("host") ?? "localhost:3000";
  const protocol = incoming.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const image = new URL("/og-galaxy.png", base).toString();
  return {
    metadataBase: base,
    title: { default: "VAULT//AI", template: "%s — VAULT//AI" },
    description: "The creative intelligence operating system for capturing, connecting, and compounding ideas.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title: "VAULT//AI — Idea Galaxy", description: "Explore your creative mind as a living universe of intelligent, connected ideas.", images: [{ url: image, width: 1728, height: 960, alt: "VAULT//AI Idea Galaxy — Explore your creative mind." }] },
    twitter: { card: "summary_large_image", title: "VAULT//AI — Idea Galaxy", description: "Explore your creative mind as a living universe of intelligent, connected ideas.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
