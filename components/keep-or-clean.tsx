/* eslint-disable @next/next/no-img-element -- saved posts can use external media URLs */
"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, RotateCcw, Sparkles, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Idea } from "../lib/data";
import { useVaultStore } from "../lib/store";

type Decision = "pending" | "keep" | "clean";
type ReviewAction = { ideaId: string; decision: Decision; important: boolean; updatedAt?: string };
type HistoryEntry = { ideaId: string; previous: ReviewAction; next: ReviewAction };

const pendingAction = (ideaId: string): ReviewAction => ({ ideaId, decision: "pending", important: false });
const imageFor = (idea: Idea) => idea.thumbnail || (idea.mediaType === "image" ? idea.sourceUrl : undefined);

export function KeepOrCleanView() {
  const ideas = useVaultStore((state) => state.ideas);
  const [actions, setActions] = useState<Record<string, ReviewAction>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [exitDirection, setExitDirection] = useState<1 | -1>(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/review-actions").then(async (response) => {
      if (!response.ok) throw new Error("Review history is unavailable");
      const data = await response.json() as { actions: ReviewAction[] };
      if (!cancelled) setActions(Object.fromEntries(data.actions.map((action) => [action.ideaId, action])));
    }).catch(() => { if (!cancelled) setMessage("REVIEW HISTORY COULD NOT BE LOADED"); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const queue = useMemo(() => ideas.filter((idea) => (actions[idea.id]?.decision || "pending") === "pending"), [actions, ideas]);
  const current = queue[0];
  const reviewed = ideas.length - queue.length;
  const kept = ideas.filter((idea) => actions[idea.id]?.decision === "keep").length;
  const cleaned = ideas.filter((idea) => actions[idea.id]?.decision === "clean").length;
  const important = ideas.filter((idea) => actions[idea.id]?.important).length;

  const persist = async (action: ReviewAction) => {
    const response = await fetch("/api/review-actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(action) });
    if (!response.ok) throw new Error("Decision could not be saved");
  };

  const decide = async (decision: Exclude<Decision, "pending">) => {
    if (!current || saving) return;
    const previous = actions[current.id] || pendingAction(current.id);
    const next = { ...previous, decision };
    setExitDirection(decision === "keep" ? 1 : -1);
    setDragX(0);
    setActions((state) => ({ ...state, [current.id]: next }));
    setHistory((state) => [...state, { ideaId: current.id, previous, next }]);
    setMessage(decision === "keep" ? "KEPT IN YOUR CREATIVE VAULT" : "CLEANED FROM THIS REVIEW QUEUE");
    setSaving(true);
    try { await persist(next); }
    catch {
      setActions((state) => ({ ...state, [current.id]: previous }));
      setHistory((state) => state.slice(0, -1));
      setMessage("DECISION COULD NOT BE SAVED — CARD RESTORED");
    } finally { setSaving(false); }
  };

  const toggleImportant = async () => {
    if (!current || saving) return;
    const previous = actions[current.id] || pendingAction(current.id);
    const next = { ...previous, important: !previous.important };
    setActions((state) => ({ ...state, [current.id]: next }));
    setMessage(next.important ? "MARKED IMPORTANT" : "REMOVED IMPORTANT MARK");
    setSaving(true);
    try { await persist(next); }
    catch { setActions((state) => ({ ...state, [current.id]: previous })); setMessage("IMPORTANT MARK COULD NOT BE SAVED"); }
    finally { setSaving(false); }
  };

  const undo = async () => {
    if (!history.length || saving) return;
    const last = history[history.length - 1];
    setHistory((state) => state.slice(0, -1));
    setActions((state) => ({ ...state, [last.ideaId]: last.previous }));
    setMessage(`UNDID ${last.next.decision.toUpperCase()}`);
    setSaving(true);
    try { await persist(last.previous); }
    catch { setActions((state) => ({ ...state, [last.ideaId]: last.next })); setHistory((state) => [...state, last]); setMessage("UNDO COULD NOT BE SAVED"); }
    finally { setSaving(false); }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches("input, textarea, select") || target.isContentEditable) return;
      if (event.key === "ArrowRight") { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-review-action="keep"]')?.click(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-review-action="clean"]')?.click(); }
      if (event.key.toLowerCase() === "s") { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-review-action="important"]')?.click(); }
      if (event.key.toLowerCase() === "z" || event.key === "Backspace") { event.preventDefault(); document.querySelector<HTMLButtonElement>('[data-review-action="undo"]')?.click(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 110) { setDragX(0); return; }
    void decide(info.offset.x > 0 ? "keep" : "clean");
  };

  return <>
    <header className="view-header standard keep-clean-header"><div className="kicker">03 / DECISION ENGINE</div><h1>KEEP <em>OR</em> CLEAN.</h1><p>Review every saved post from every source. Swipe right to keep the signal, left to clean the noise.</p></header>
    <section className="review-console" aria-label="Keep or Clean review queue">
      <div className="review-stats"><span><b>{queue.length}</b> TO REVIEW</span><span><b>{kept}</b> KEPT</span><span><b>{cleaned}</b> CLEANED</span><span><b>{important}</b> IMPORTANT</span></div>
      <div className="review-progress" aria-label={`${reviewed} of ${ideas.length} reviewed`}><i style={{ width: `${ideas.length ? reviewed / ideas.length * 100 : 0}%` }} /></div>
      <div className="review-stage">
        {loading ? <div className="review-empty"><Sparkles/><b>LOADING YOUR SAVED POSTS</b></div> : queue.length === 0 ? <div className="review-empty"><Sparkles/><b>REVIEW COMPLETE</b><p>{kept} ideas kept · {cleaned} cleaned · {important} marked important.</p></div> : <AnimatePresence custom={exitDirection} initial={false}>
          {queue.slice(0, 3).reverse().map((idea, reverseIndex, visible) => {
            const stackIndex = visible.length - reverseIndex - 1;
            const top = stackIndex === 0;
            const image = imageFor(idea);
            const marked = Boolean(actions[idea.id]?.important);
            return <motion.article key={idea.id} className={`review-card ${top ? "is-top" : ""}`} style={{ "--card-accent": idea.accent, zIndex: 10 - stackIndex } as React.CSSProperties}
              initial={{ opacity: 0, scale: .92, y: 30 }} animate={{ opacity: 1, scale: 1 - stackIndex * .035, y: stackIndex * 16 }} exit={{ opacity: 0, x: exitDirection * 760, rotate: exitDirection * 16 }} transition={{ type: "spring", stiffness: 280, damping: 28 }}
              drag={top && !saving ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.82} onDrag={(_event, info) => setDragX(info.offset.x)} onDragEnd={onDragEnd}>
              <div className="review-media">{image ? <img src={image} alt={`${idea.title} by ${idea.creator}`} draggable={false}/> : <div className="review-fallback"><span>{idea.category.slice(0, 3).toUpperCase()}</span><Sparkles/></div>}<span className="review-platform">{(idea.platform || idea.category).toUpperCase()}</span>{marked && <span className="important-flag"><Star fill="currentColor"/> IMPORTANT</span>}<div className={`swipe-verdict keep ${dragX > 36 ? "visible" : ""}`}>KEEP</div><div className={`swipe-verdict clean ${dragX < -36 ? "visible" : ""}`}>CLEAN</div></div>
              <div className="review-copy"><span className="review-creator">{idea.creator} · {idea.saved.toUpperCase()} AGO</span><h2>{idea.title}</h2><blockquote><span>HOOK / FIRST 3 SECONDS</span>“{idea.hook || idea.title}”</blockquote><p>{idea.savedNote || idea.insight}</p><div>{idea.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>{idea.sourceUrl && <a href={idea.sourceUrl} target="_blank" rel="noopener noreferrer">OPEN ORIGINAL <ExternalLink/></a>}</div>
            </motion.article>;
          })}
        </AnimatePresence>}
      </div>
      <div className="review-actions" aria-label="Review actions"><button data-review-action="undo" aria-label="Undo last decision" onClick={() => void undo()} disabled={!history.length || saving}><RotateCcw/><span>UNDO<kbd>Z</kbd></span></button><button className="clean-action" data-review-action="clean" aria-label="Clean this idea" onClick={() => void decide("clean")} disabled={!current || saving}><X/><span>CLEAN<kbd>←</kbd></span></button><button className={`important-action ${current && actions[current.id]?.important ? "active" : ""}`} data-review-action="important" aria-label="Mark this idea important" aria-pressed={Boolean(current && actions[current.id]?.important)} onClick={() => void toggleImportant()} disabled={!current || saving}><Star fill={current && actions[current.id]?.important ? "currentColor" : "none"}/><span>IMPORTANT<kbd>S</kbd></span></button><button className="keep-action" data-review-action="keep" aria-label="Keep this idea" onClick={() => void decide("keep")} disabled={!current || saving}><ArrowRight/><span>KEEP<kbd>→</kbd></span></button></div>
      <p className="review-message" aria-live="polite">{message || "DRAG THE TOP CARD OR USE THE CONTROLS"}</p>
      <div className="review-legend"><span><ArrowLeft/> LEFT SWIPE CLEANS</span><span><ArrowRight/> RIGHT SWIPE KEEPS</span><span><Star/> STAR MARKS IMPORTANT</span></div>
    </section>
  </>;
}
