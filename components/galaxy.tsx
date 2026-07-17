/* eslint-disable @next/next/no-img-element -- captures can come from arbitrary user-hosted media URLs */
"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, Line, OrbitControls, Sparkles } from "@react-three/drei";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Color, Object3D, type Group, type InstancedMesh } from "three";
import {
  Atom, Boxes, BrainCircuit, CalendarRange, Check, ChevronRight, CircleDot,
  Clock3, ExternalLink, Flame, Focus, Grid2X2, Heart, KanbanSquare,
  ListFilter, Network, Orbit, Plus, Radar, Search, Sparkles as SparklesIcon,
  Target, X,
} from "lucide-react";
import type { Idea } from "../lib/data";
import { buildGalaxyGraph, semanticScore, type GalaxyEdge, type GalaxyGraph, type GalaxyNode } from "../lib/galaxy";
import { useVaultStore } from "../lib/store";
import styles from "./galaxy.module.css";

type GalaxyMode = "GALAXY" | "NETWORK" | "TIMELINE" | "KANBAN" | "LIBRARY" | "HEATMAP" | "OPPORTUNITY" | "FOCUS";
type TrendFilter = "ALL SIGNALS" | "RISING" | "EVERGREEN" | "VIRAL" | "LOW COMPETITION" | "HIGH OPPORTUNITY";

const modes: { id: GalaxyMode; label: string; icon: typeof Atom }[] = [
  { id: "GALAXY", label: "Galaxy", icon: Orbit }, { id: "NETWORK", label: "Network", icon: Network },
  { id: "TIMELINE", label: "Timeline", icon: CalendarRange }, { id: "KANBAN", label: "Kanban", icon: KanbanSquare },
  { id: "LIBRARY", label: "Library", icon: Grid2X2 }, { id: "HEATMAP", label: "Heatmap", icon: Radar },
  { id: "OPPORTUNITY", label: "Opportunity", icon: Target }, { id: "FOCUS", label: "Focus", icon: Focus },
];
const trendFilters: TrendFilter[] = ["ALL SIGNALS", "RISING", "EVERGREEN", "VIRAL", "LOW COMPETITION", "HIGH OPPORTUNITY"];

function PlatformMark({ platform }: { platform: string }) {
  return <span className={styles.platformMark} aria-label={`Platform: ${platform}`}>{platform.slice(0, 2).toUpperCase()}</span>;
}

function savedWhen(saved: string) {
  return saved.toLowerCase() === "now" ? "SAVED JUST NOW" : `SAVED ${saved.toUpperCase()} AGO`;
}

function relationshipPoints(edges: GalaxyEdge[], nodes: GalaxyNode[], min: number, max: number) {
  return edges.filter((edge) => edge.strength >= min && edge.strength < max).flatMap((edge) => [nodes[edge.source].position, nodes[edge.target].position]);
}

function EdgeLayer({ graph, min, max, color, width, opacity }: { graph: GalaxyGraph; min: number; max: number; color: string; width: number; opacity: number }) {
  const points = useMemo(() => relationshipPoints(graph.edges.slice(0, Math.min(graph.edges.length, 1200)), graph.nodes, min, max), [graph, max, min]);
  if (!points.length) return null;
  return <Line points={points} segments color={color} lineWidth={width} transparent opacity={opacity} depthWrite={false} />;
}

function InstancedNodes({ graph, activeIds, selectedId, onSelect, onHover }: { graph: GalaxyGraph; activeIds: Set<string>; selectedId?: string; onSelect: (id: string) => void; onHover: (id?: string) => void }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const dim = useMemo(() => new Color("#182018"), []);

  useLayoutEffect(() => {
    if (!ref.current) return;
    graph.nodes.forEach((node, index) => {
      const active = activeIds.has(node.id);
      const scale = (0.22 + node.importance / 310) * (active ? 1 : 0.34);
      dummy.position.set(...node.position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(index, dummy.matrix);
      const color = new Color(node.accent);
      if (!active) color.lerp(dim, 0.86);
      if (node.id === selectedId) color.lerp(new Color("#ffffff"), 0.24);
      ref.current?.setColorAt(index, color);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [activeIds, dim, dummy, graph, selectedId]);

  const idForEvent = (event: ThreeEvent<PointerEvent>) => event.instanceId === undefined ? undefined : graph.nodes[event.instanceId]?.id;
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, Math.max(1, graph.nodes.length)]}
      onPointerMove={(event) => { event.stopPropagation(); onHover(idForEvent(event)); }}
      onPointerOut={() => onHover(undefined)}
      onClick={(event) => { const id = idForEvent(event); if (id) { event.stopPropagation(); onSelect(id); } }}
    >
      <icosahedronGeometry args={[0.72, 1]} />
      <meshStandardMaterial vertexColors roughness={0.22} metalness={0.18} emissive="#13200c" emissiveIntensity={0.75} />
    </instancedMesh>
  );
}

function SelectedBeacon({ node }: { node?: GalaxyNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.35; });
  if (!node) return null;
  const scale = 0.58 + node.importance / 230;
  return <group ref={ref} position={node.position}>
    <mesh scale={scale * 1.36}><torusGeometry args={[0.58, 0.025, 8, 48]} /><meshBasicMaterial color={node.accent} transparent opacity={0.85} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={scale * (0.88 + node.confidence / 420)}><torusGeometry args={[0.58, 0.012, 8, 48]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.42} /></mesh>
    {node.trend >= 85 && <Sparkles count={22} size={2.2} scale={1.6} speed={0.6} color={node.accent} />}
    <Html position={[0, 0.82, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}><div className={styles.spaceLabel}><span>{node.platform.toUpperCase()}</span><b>{node.title}</b></div></Html>
  </group>;
}

function GalaxyScene({ graph, activeIds, selectedId, hoveredId, onSelect, onHover }: { graph: GalaxyGraph; activeIds: Set<string>; selectedId?: string; hoveredId?: string; onSelect: (id: string) => void; onHover: (id?: string) => void }) {
  const group = useRef<Group>(null);
  const selected = graph.nodes.find((node) => node.id === (hoveredId || selectedId));
  useFrame(({ clock }) => { if (group.current) group.current.position.y = Math.sin(clock.elapsedTime * 0.25) * 0.08; });
  return <>
    <color attach="background" args={["#030603"]} />
    <fog attach="fog" args={["#030603", 8, 19]} />
    <ambientLight intensity={0.62} />
    <pointLight position={[5, 5, 6]} intensity={34} color="#b6ff3b" />
    <pointLight position={[-4, -1, 3]} intensity={18} color="#7bf1ff" />
    <Sparkles count={260} size={1.25} scale={[16, 10, 10]} speed={0.2} opacity={0.45} color="#b6ff3b" />
    <group ref={group}>
      <EdgeLayer graph={graph} min={0.25} max={0.48} color="#30452b" width={0.55} opacity={0.28} />
      <EdgeLayer graph={graph} min={0.48} max={0.72} color="#6ca63e" width={1.15} opacity={0.48} />
      <EdgeLayer graph={graph} min={0.72} max={1.01} color="#b6ff3b" width={2.2} opacity={0.72} />
      <InstancedNodes graph={graph} activeIds={activeIds} selectedId={selectedId} onSelect={onSelect} onHover={onHover} />
      <SelectedBeacon node={selected} />
      {graph.clusters.slice(0, 10).map((cluster) => <Html key={cluster.name} position={cluster.center} center distanceFactor={12} style={{ pointerEvents: "none" }}><div className={styles.clusterLabel}><i style={{ background: cluster.color }} />{cluster.name.toUpperCase()} <small>{cluster.count}</small></div></Html>)}
    </group>
    <OrbitControls makeDefault enableDamping dampingFactor={0.08} enablePan enableZoom minDistance={4.2} maxDistance={17} autoRotate={!selected} autoRotateSpeed={0.18} />
  </>;
}

function GalaxyCanvas({ graph, activeIds, selectedId, hoveredId, onSelect, onHover }: { graph: GalaxyGraph; activeIds: Set<string>; selectedId?: string; hoveredId?: string; onSelect: (id: string) => void; onHover: (id?: string) => void }) {
  return <div className={styles.canvas} role="img" aria-label={`Interactive 3D galaxy containing ${graph.nodes.length} intelligent ideas across ${graph.clusters.length} clusters`}>
    <Canvas camera={{ position: [0, 0.2, 9.5], fov: 48 }} dpr={[1, 1.55]} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <GalaxyScene graph={graph} activeIds={activeIds} selectedId={selectedId} hoveredId={hoveredId} onSelect={onSelect} onHover={onHover} />
    </Canvas>
  </div>;
}

function NetworkView({ graph, activeIds, selectedId, onSelect }: { graph: GalaxyGraph; activeIds: Set<string>; selectedId?: string; onSelect: (id: string) => void }) {
  const visible = graph.nodes.slice(0, 180);
  const point = (node: GalaxyNode) => ({ x: 50 + node.position[0] * 7.2, y: 50 + node.position[1] * 9 });
  return <div className={styles.networkMap} aria-label="Traditional relationship network">
    {graph.edges.slice(0, 320).map((edge, index) => {
      if (!visible[edge.source] || !visible[edge.target]) return null;
      const a = point(visible[edge.source]); const b = point(visible[edge.target]);
      const length = Math.hypot(b.x - a.x, b.y - a.y); const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      return <i key={`${edge.source}-${edge.target}-${index}`} className={styles.networkEdge} style={{ left: `${a.x}%`, top: `${a.y}%`, width: `${length}%`, opacity: 0.18 + edge.strength * 0.54, height: `${Math.max(1, edge.strength * 3)}px`, transform: `rotate(${angle}deg)` }} />;
    })}
    {visible.map((node) => { const p = point(node); return <button key={node.id} className={`${styles.networkNode} ${node.id === selectedId ? styles.active : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%`, "--node": node.accent, opacity: activeIds.has(node.id) ? 1 : 0.16, transform: `translate(-50%,-50%) scale(${0.72 + node.importance / 250})` } as React.CSSProperties} onClick={() => onSelect(node.id)} aria-label={`Inspect ${node.title}`}><span>{node.platform.slice(0, 1)}</span><b>{node.title}</b></button>; })}
  </div>;
}

function TimelineView({ nodes, activeIds, selectedId, onSelect, onDrag }: { nodes: GalaxyNode[]; activeIds: Set<string>; selectedId?: string; onSelect: (id: string) => void; onDrag: (event: React.DragEvent, id: string) => void }) {
  return <div className={styles.timeline} aria-label="Idea timeline">
    <div className={styles.timelineAxis}><span>NOW</span><i /><span>EARLIER</span></div>
    {nodes.filter((node) => activeIds.has(node.id)).map((node, index) => <button draggable onDragStart={(event) => onDrag(event, node.id)} key={node.id} onClick={() => onSelect(node.id)} className={node.id === selectedId ? styles.activeCard : ""}><time>{node.saved.toUpperCase()} AGO</time><i style={{ background: node.accent }} /><div><small>{node.platform} / {node.topic}</small><b>{node.title}</b><span>{node.insight}</span></div><strong>{node.trend}</strong>{index < nodes.length - 1 && <em />}</button>)}
  </div>;
}

function KanbanView({ graph, activeIds, selectedId, onSelect, onDrag }: { graph: GalaxyGraph; activeIds: Set<string>; selectedId?: string; onSelect: (id: string) => void; onDrag: (event: React.DragEvent, id: string) => void }) {
  return <div className={styles.kanban}>{graph.clusters.map((cluster) => <section key={cluster.name}><header><i style={{ background: cluster.color }} /><b>{cluster.name}</b><span>{cluster.count}</span></header>{graph.nodes.filter((node) => node.topic === cluster.name && activeIds.has(node.id)).map((node) => <button draggable onDragStart={(event) => onDrag(event, node.id)} key={node.id} onClick={() => onSelect(node.id)} className={node.id === selectedId ? styles.activeCard : ""}><small>{node.platform} / {node.emotionalTone}</small><b>{node.title}</b><span>↑ {node.trend} · {node.confidence}% confidence</span></button>)}</section>)}</div>;
}

function LibraryGalaxyView({ nodes, activeIds, selectedId, onSelect, onDrag }: { nodes: GalaxyNode[]; activeIds: Set<string>; selectedId?: string; onSelect: (id: string) => void; onDrag: (event: React.DragEvent, id: string) => void }) {
  return <div className={styles.libraryGrid}>{nodes.filter((node) => activeIds.has(node.id)).sort((a,b)=>Number(Boolean(b.thumbnail||(b.mediaType==="image"&&b.sourceUrl)))-Number(Boolean(a.thumbnail||(a.mediaType==="image"&&a.sourceUrl)))).map((node) => { const thumbnail=node.thumbnail||(node.mediaType==="image"?node.sourceUrl:undefined); return <button draggable onDragStart={(event) => onDrag(event, node.id)} key={node.id} onClick={() => onSelect(node.id)} className={node.id === selectedId ? styles.activeCard : ""}><div className={styles.thumb} style={{ "--node": node.accent } as React.CSSProperties}>{thumbnail?<img src={thumbnail} alt=""/>:<><span>{node.topic.slice(0, 3).toUpperCase()}</span><CircleDot /></>}<PlatformMark platform={node.platform} />{node.favorite&&<Heart className={styles.favorite} fill="currentColor" aria-label="Favorite idea"/>}{node.duration&&<em>{node.duration}</em>}<blockquote className={styles.thumbHook}><span>HOOK / FIRST 3 SECONDS</span>{node.hook||node.title}</blockquote></div><small>{node.creator === "unknown" ? "CREATOR UNAVAILABLE" : node.creator} · {savedWhen(node.saved)}</small><b>{node.title}</b><p>{node.insight}</p><footer><span>{node.collections.length?node.collections.join(' · '):node.emotionalTone}</span><strong>↑{node.trend}</strong></footer></button>; })}</div>;
}

function HeatmapView({ graph, onSelectCluster }: { graph: GalaxyGraph; onSelectCluster: (cluster: string) => void }) {
  const max = Math.max(...graph.clusters.map((cluster) => cluster.count), 1);
  return <div className={styles.heatmap}>{graph.clusters.map((cluster, index) => <button key={cluster.name} onClick={() => onSelectCluster(cluster.name)} style={{ "--node": cluster.color, "--heat": `${0.12 + (cluster.count / max) * 0.58}`, gridColumn: index % 4 === 0 ? "span 2" : "span 1" } as React.CSSProperties}><small>DENSITY {String(index + 1).padStart(2, "0")}</small><b>{cluster.name}</b><strong>{cluster.count}</strong><span>{cluster.averageTrend} AVG TREND</span></button>)}</div>;
}

function OpportunityView({ graph, onFocus }: { graph: GalaxyGraph; onFocus: (id: string) => void }) {
  const strongest = [...graph.nodes].sort((a, b) => b.trend - a.trend)[0];
  const smallest = [...graph.clusters].sort((a, b) => a.count - b.count)[0];
  const bridge = graph.edges.slice().sort((a, b) => b.strength - a.strength)[0];
  const bridgeNode = bridge ? graph.nodes[bridge.source] : strongest;
  const cards = [
    { label: "EMERGING NICHE", title: `${strongest?.topic || "Creative"} × ${strongest?.audience || "new audiences"}`, copy: "High signal strength with room for a more specific creator position.", score: 92, node: strongest },
    { label: "KNOWLEDGE GAP", title: `Expand ${smallest?.name || "adjacent thinking"}`, copy: "This cluster is underexplored relative to your strongest recurring interests.", score: 84, node: graph.nodes.find((node) => node.topic === smallest?.name) },
    { label: "HIDDEN BRIDGE", title: bridgeNode ? `${bridgeNode.storytellingStyle} can travel` : "Cross-cluster pattern", copy: "A storytelling structure is repeating across otherwise distant topics.", score: 88, node: bridgeNode },
  ];
  return <div className={styles.opportunities}>{cards.map((card, index) => <article key={card.label}><div><span>0{index + 1}</span><small>{card.label}</small><strong>{card.score}%</strong></div><Target /><h3>{card.title}</h3><p>{card.copy}</p><button onClick={() => card.node && onFocus(card.node.id)}>EXPLORE IN FOCUS <ChevronRight /></button></article>)}</div>;
}

function FocusView({ graph, selected, onSelect }: { graph: GalaxyGraph; selected?: GalaxyNode; onSelect: (id: string) => void }) {
  if (!selected) return <div className={styles.empty}>Select an idea to enter focus mode.</div>;
  const related = graph.edges.filter((edge) => graph.nodes[edge.source].id === selected.id || graph.nodes[edge.target].id === selected.id).sort((a, b) => b.strength - a.strength);
  return <div className={styles.focusView}><div className={styles.focusCore} style={{ "--node": selected.accent } as React.CSSProperties}><i /><PlatformMark platform={selected.platform} /><BrainCircuit /><small>FOCUS SIGNAL</small><h2>{selected.title}</h2><p>{selected.insight}</p><strong>{selected.confidence}% AI CONFIDENCE</strong></div><div className={styles.focusRelations}>{related.map((edge) => { const node = graph.nodes[edge.source].id === selected.id ? graph.nodes[edge.target] : graph.nodes[edge.source]; return <button key={`${edge.source}-${edge.target}`} onClick={() => onSelect(node.id)}><i style={{ background: node.accent }} /><div><small>{edge.type} · {Math.round(edge.strength * 100)}%</small><b>{node.title}</b></div><ChevronRight /></button>; })}</div></div>;
}

function Inspector({ graph, node, selectedForFusion, onClose, onSelect, onToggleFusion }: { graph: GalaxyGraph; node?: GalaxyNode; selectedForFusion: boolean; onClose: () => void; onSelect: (id: string) => void; onToggleFusion: () => void }) {
  if (!node) return <aside className={styles.inspector}><div className={styles.inspectorEmpty}><Atom /><b>SELECT A SIGNAL</b><p>Choose any node to inspect its intelligence and relationships.</p></div></aside>;
  const relatedEdges = graph.edges.filter((edge) => graph.nodes[edge.source].id === node.id || graph.nodes[edge.target].id === node.id).sort((a, b) => b.strength - a.strength).slice(0, 4);
  return <aside className={styles.inspector} aria-label={`Details for ${node.title}`}>
    <header><div><PlatformMark platform={node.platform} /><span>{node.platform} / {node.topic}</span></div><button onClick={onClose} aria-label="Close node details"><X /></button></header>
    <div className={styles.inspectorPreview} style={{ "--node": node.accent } as React.CSSProperties}>{node.thumbnail||(node.mediaType==="image"&&node.sourceUrl)?<img src={node.thumbnail||node.sourceUrl} alt={`${node.title} saved from ${node.creator}`}/>:<><span>{node.topic.slice(0, 3).toUpperCase()}</span><BrainCircuit /><i /></>}</div>
    <div className={styles.inspectorBody}><small>{node.creator === "unknown" ? "CREATOR UNAVAILABLE" : node.creator} · {savedWhen(node.saved)}</small><h2>{node.title}</h2><blockquote className={styles.inspectorHook}><span>HOOK / FIRST 3 SECONDS</span>{node.hook||node.title}</blockquote><p>{node.insight}</p>
      <div className={styles.scoreStrip}><div><span>TREND</span><b>{node.trend}</b></div><div><span>VIRALITY</span><b>{node.virality}</b></div><div><span>CONFIDENCE</span><b>{node.confidence}%</b></div></div>
      <dl><dt>EMOTIONAL TONE</dt><dd>{node.emotionalTone}</dd><dt>HOOK ANALYSIS</dt><dd>{node.hookAnalysis}</dd><dt>AUDIENCE</dt><dd>{node.audience}</dd><dt>EDITING / STORY</dt><dd>{node.editingStyle} · {node.storytellingStyle}</dd>{node.transcript&&<><dt>TRANSCRIPT</dt><dd>{node.transcript.slice(0,260)}{node.transcript.length>260?'…':''}</dd></>}</dl>
      <div className={styles.keywordRow}>{node.favorite&&<span>♥ FAVORITE</span>}{node.collections.map((collection)=><span key={`collection-${collection}`}>COLLECTION / {collection}</span>)}{node.keywords.slice(0, 6).map((keyword) => <span key={keyword}>#{keyword}</span>)}</div>
      <section className={styles.related}><span>RELATED IDEAS / {relatedEdges.length}</span>{relatedEdges.map((edge) => { const related = graph.nodes[edge.source].id === node.id ? graph.nodes[edge.target] : graph.nodes[edge.source]; return <button key={`${edge.source}-${edge.target}`} onClick={() => onSelect(related.id)}><i style={{ background: related.accent }} /><div><b>{related.title}</b><small>{edge.type} · {Math.round(edge.strength * 100)}%</small></div><ChevronRight /></button>; })}</section>
      <button className={`${styles.fusionButton} ${selectedForFusion ? styles.selectedFusion : ""}`} onClick={onToggleFusion}>{selectedForFusion ? <Check /> : <Plus />}{selectedForFusion ? "ADDED TO FUSION" : "ADD TO FUSION"}</button>
      {node.sourceUrl && <a className={styles.sourceButton} href={node.sourceUrl} target="_blank" rel="noopener noreferrer">OPEN ORIGINAL SOURCE <ExternalLink /></a>}
    </div>
  </aside>;
}

export function IdeaGalaxyWorkspace({ ideas }: { ideas: Idea[] }) {
  const [graph, setGraph] = useState<GalaxyGraph>(() => buildGalaxyGraph(ideas));
  const [mode, setMode] = useState<GalaxyMode>("GALAXY");
  const [query, setQuery] = useState("");
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("ALL SIGNALS");
  const [timeline, setTimeline] = useState(100);
  const [selectedId, setSelectedId] = useState<string>(() => graph.nodes[0]?.id || "");
  const [hoveredId, setHoveredId] = useState<string>();
  const [clusterFilter, setClusterFilter] = useState<string>();
  const selectedIds = useVaultStore((state) => state.selectedIds);
  const toggleSelected = useVaultStore((state) => state.toggleSelected);

  useEffect(() => {
    if (typeof Worker === "undefined") { queueMicrotask(() => setGraph(buildGalaxyGraph(ideas))); return; }
    const worker = new Worker(new URL("../workers/galaxy-layout.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<GalaxyGraph>) => setGraph(event.data);
    worker.onerror = () => setGraph(buildGalaxyGraph(ideas));
    worker.postMessage(ideas);
    return () => worker.terminate();
  }, [ideas]);
  const activeIds = useMemo(() => new Set(graph.nodes.filter((node) => {
    const semantic = !query.trim() || semanticScore(node, query) >= 0.5;
    const time = node.savedOrder <= Math.ceil((timeline / 100) * Math.max(graph.nodes.length - 1, 0));
    const cluster = !clusterFilter || node.topic === clusterFilter;
    const trend = trendFilter === "ALL SIGNALS" || (trendFilter === "RISING" && node.trend >= 85) || (trendFilter === "EVERGREEN" && node.trend >= 70 && node.trend < 90) || (trendFilter === "VIRAL" && node.virality >= 84) || (trendFilter === "LOW COMPETITION" && node.trend >= 65 && node.importance < 82) || (trendFilter === "HIGH OPPORTUNITY" && node.confidence >= 82 && node.trend < 88);
    return semantic && time && cluster && trend;
  }).map((node) => node.id)), [clusterFilter, graph.nodes, query, timeline, trendFilter]);
  const selected = graph.nodes.find((node) => node.id === selectedId);
  const hovered = graph.nodes.find((node) => node.id === hoveredId);
  const strongestCluster = [...graph.clusters].sort((a, b) => b.averageTrend - a.averageTrend)[0];
  const overlapEdge = [...graph.edges].sort((a, b) => b.strength - a.strength)[0];
  const overlapA = overlapEdge ? graph.nodes[overlapEdge.source] : undefined;
  const overlapB = overlapEdge ? graph.nodes[overlapEdge.target] : undefined;

  const select = (id: string) => { setSelectedId(id); setHoveredId(undefined); };
  const selectCluster = (cluster: string) => { setClusterFilter(cluster); setMode("GALAXY"); };
  const dragIdea = (event: React.DragEvent, id: string) => { event.dataTransfer.setData("text/idea-id", id); event.dataTransfer.effectAllowed = "copy"; };
  const dropFusion = (event: React.DragEvent) => { event.preventDefault(); const id = event.dataTransfer.getData("text/idea-id"); if (id && !selectedIds.includes(id)) toggleSelected(id); };

  const content = mode === "GALAXY" ? <div className={styles.galaxyStage}>
    <GalaxyCanvas graph={graph} activeIds={activeIds} selectedId={selectedId} hoveredId={hoveredId} onSelect={select} onHover={setHoveredId} />
    <div className={styles.liveHud}><span><i /> LIVE GRAPH</span><b>{graph.nodes.length.toLocaleString()} NODES</b><small>{graph.edges.length.toLocaleString()} AI RELATIONSHIPS</small></div>
    <div className={styles.controlHud}><small>DRAG TO ORBIT · SCROLL TO ZOOM</small><small>CLICK A NODE TO INSPECT</small></div>
    {strongestCluster && <button className={styles.opportunityBeacon} onClick={() => { const node = graph.nodes.find((item) => item.topic === strongestCluster.name); if (node) select(node.id); setMode("OPPORTUNITY"); }}><SparklesIcon /><span>OPPORTUNITY DETECTED</span><b>{strongestCluster.name} is accelerating</b></button>}
    {hovered && <div className={styles.hoverCard}><PlatformMark platform={hovered.platform} /><div><small>{hovered.creator} · SAVED {hovered.saved.toUpperCase()} AGO · {hovered.emotionalTone}</small><b>{hovered.title}</b><p>{hovered.insight}</p><em>{hovered.hookAnalysis}</em><span>↑{hovered.trend} TREND · {graph.edges.filter((edge) => graph.nodes[edge.source].id === hovered.id || graph.nodes[edge.target].id === hovered.id).length} RELATED</span></div></div>}
  </div> : mode === "NETWORK" ? <NetworkView graph={graph} activeIds={activeIds} selectedId={selectedId} onSelect={select} /> : mode === "TIMELINE" ? <TimelineView nodes={graph.nodes} activeIds={activeIds} selectedId={selectedId} onSelect={select} onDrag={dragIdea} /> : mode === "KANBAN" ? <KanbanView graph={graph} activeIds={activeIds} selectedId={selectedId} onSelect={select} onDrag={dragIdea} /> : mode === "LIBRARY" ? <LibraryGalaxyView nodes={graph.nodes} activeIds={activeIds} selectedId={selectedId} onSelect={select} onDrag={dragIdea} /> : mode === "HEATMAP" ? <HeatmapView graph={graph} onSelectCluster={selectCluster} /> : mode === "OPPORTUNITY" ? <OpportunityView graph={graph} onFocus={(id) => { select(id); setMode("FOCUS"); }} /> : <FocusView graph={graph} selected={selected} onSelect={select} />;

  return <section className={styles.workspace}>
    <header className={styles.hero}><div><span><i /> LIVING KNOWLEDGE UNIVERSE / INDEX ONLINE</span><h1>IDEA / <em>GALAXY</em></h1><p>Fly through your creative mind. Discover relationships, hidden opportunities, and the next idea worth making.</p></div><div className={styles.heroMetrics}><div><b>{graph.nodes.length.toLocaleString()}</b><span>INTELLIGENT NODES</span></div><div><b>{graph.edges.length.toLocaleString()}</b><span>RELATIONSHIPS</span></div><div><b>{graph.clusters.length}</b><span>LIVE CLUSTERS</span></div></div></header>
    <div className={styles.discovery}><BrainCircuit /><div><small>AI DISCOVERY / NOW</small><p>{overlapA && overlapB ? <><b>{overlapA.topic}</b> and <b>{overlapB.topic}</b> frequently overlap through {overlapEdge.type.toLowerCase()}. Suggested direction: <strong>{overlapA.topic} for {overlapB.audience}</strong>.</> : <>Your graph is learning from every saved signal.</>}</p></div><button onClick={() => setMode("OPPORTUNITY")}>EXPLORE INSIGHT <ChevronRight /></button></div>
    <div className={styles.modeBar} role="tablist" aria-label="Galaxy view modes">{modes.map(({ id, label, icon: Icon }) => <button role="tab" aria-selected={mode === id} key={id} className={mode === id ? styles.activeMode : ""} onClick={() => setMode(id)}><Icon />{label}</button>)}</div>
    <div className={styles.commandBar}><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask the galaxy: Find emotional startup videos..." aria-label="Semantic galaxy search" /><kbd>{activeIds.size} FOUND</kbd></label><div className={styles.filters}><ListFilter />{trendFilters.map((filter) => <button key={filter} className={trendFilter === filter ? styles.activeFilter : ""} onClick={() => setTrendFilter(filter)}>{filter}</button>)}</div>{clusterFilter && <button className={styles.clearCluster} onClick={() => setClusterFilter(undefined)}>CLUSTER: {clusterFilter.toUpperCase()} <X /></button>}</div>
    <div className={styles.timelineControl}><Clock3 /><span>KNOWLEDGE EVOLUTION</span><input type="range" min="1" max="100" value={timeline} onChange={(event) => setTimeline(Number(event.target.value))} aria-label="Knowledge evolution timeline" /><b>{timeline === 100 ? "NOW" : `${timeline}% OF HISTORY`}</b></div>
    <div className={styles.mainGrid}><div className={styles.viewSurface}>{content}</div><Inspector graph={graph} node={selected} selectedForFusion={selected ? selectedIds.includes(selected.id) : false} onClose={() => setSelectedId(undefined)} onSelect={select} onToggleFusion={() => selected && toggleSelected(selected.id)} /></div>
    <div className={`${styles.fusionDock} ${selectedIds.length >= 2 ? styles.ready : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={dropFusion}><div><Boxes /><span>FUSION DOCK</span><b>{selectedIds.length} / 5 SIGNALS</b></div><p>{selectedIds.length ? selectedIds.map((id) => graph.nodes.find((node) => node.id === id)?.title).filter(Boolean).join(" + ") : "Drag ideas here or add them from the inspector."}</p><Link href="/fusion" aria-disabled={selectedIds.length < 2}>FUSE SELECTED <Flame /></Link></div>
  </section>;
}
