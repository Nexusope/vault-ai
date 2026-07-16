import { notFound } from "next/navigation";
import { VaultApp } from "../../components/vault-app";
import { type ViewName, views } from "../../lib/views";

export default async function ViewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  if (!views.includes(view as ViewName)) notFound();
  return <VaultApp initialView={view as ViewName} />;
}
