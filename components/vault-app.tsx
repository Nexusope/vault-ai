"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity, Archive, Atom, Bell, Blocks, Bot, Check, ChevronRight, CircleGauge,
  Camera, Command, Database, FolderKanban, Grid2X2, Hexagon, Import, LayoutDashboard,
  Library, List, Menu, Network, Plus, Search, Settings, ShieldCheck,
  Sparkles, TrendingUp, WandSparkles, X, Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GalaxyCanvas } from "./galaxy";
import { activity, type Idea } from "../lib/data";
import { useVaultStore } from "../lib/store";
import type { ViewName } from "../lib/views";

const nav: { name: ViewName; label: string; icon: typeof LayoutDashboard; hotkey: string }[] = [
  { name: "dashboard", label: "Control room", icon: LayoutDashboard, hotkey: "1" },
  { name: "library", label: "Idea library", icon: Library, hotkey: "2" },
  { name: "galaxy", label: "Idea galaxy", icon: Atom, hotkey: "3" },
  { name: "fusion", label: "Fusion lab", icon: WandSparkles, hotkey: "4" },
  { name: "assistant", label: "AI operator", icon: Bot, hotkey: "5" },
  { name: "search", label: "Deep search", icon: Search, hotkey: "6" },
  { name: "collections", label: "Collections", icon: FolderKanban, hotkey: "7" },
  { name: "analytics", label: "Intelligence", icon: TrendingUp, hotkey: "8" },
];

const chartData = [
  { day: "MON", saves: 42, trend: 18 }, { day: "TUE", saves: 58, trend: 31 },
  { day: "WED", saves: 47, trend: 38 }, { day: "THU", saves: 82, trend: 53 },
  { day: "FRI", saves: 69, trend: 61 }, { day: "SAT", saves: 108, trend: 74 },
  { day: "SUN", saves: 96, trend: 88 },
];

function StatusDot({ color = "green" }: { color?: "green" | "orange" | "cyan" }) {
  return <span className={`status-dot ${color}`} aria-hidden="true" />;
}

function Score({ value }: { value: number }) {
  return <span className={`score ${value > 89 ? "hot" : ""}`}>{value.toString().padStart(2, "0")}</span>;
}

function IdeaCard({ idea, compact = false }: { idea: Idea; compact?: boolean }) {
  const { selectedIds, toggleSelected } = useVaultStore();
  const selected = selectedIds.includes(idea.id);
  return (
    <motion.article layout className={`idea-card ${selected ? "selected" : ""} ${compact ? "compact" : ""}`} whileHover={{ y: -4 }}>
      <button className="card-select" aria-label={`${selected ? "Deselect" : "Select"} ${idea.title}`} onClick={() => toggleSelected(idea.id)}>
        {selected ? <Check size={13} /> : <Plus size={13} />}
      </button>
      <div className="card-visual" style={{ "--accent": idea.accent } as React.CSSProperties}>
        <span>{idea.category.slice(0, 3).toUpperCase()}</span><Hexagon size={42} strokeWidth={1} />
      </div>
      <div className="card-body">
        <div className="eyebrow"><span>{idea.creator}</span><span>{idea.saved} AGO</span></div>
        <h3>{idea.title}</h3>
        {!compact && <p>{idea.insight}</p>}
        <div className="card-meta"><div>{idea.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><Score value={idea.trend} /></div>
      </div>
    </motion.article>
  );
}

function DashboardView() {
  const ideas=useVaultStore((state)=>state.ideas);
  return <>
    <header className="view-header hero-header">
      <div><div className="kicker"><StatusDot /> LIVE INTELLIGENCE / 16 JUL 2026</div><h1>CREATE FROM<br /><em>SIGNAL.</em></h1></div>
      <div className="briefing"><span className="terminal-label">{"// DAILY BRIEFING"}</span><p>Three early patterns in your design cluster are accelerating. The strongest opening combines tactile proof with a quiet, contrarian hook.</p><Link href="/analytics">OPEN BRIEFING <ChevronRight size={15} /></Link></div>
    </header>
    <section className="metric-strip" aria-label="Workspace metrics">
      {[['02,481','IDEAS INDEXED','+146 this week'],['18','RISING SIGNALS','3 high confidence'],['92.4%','GRAPH COVERAGE','+4.1%'],['07','FUSIONS READY','2 need review']].map(([v,l,s],i)=><div key={l}><span>0{i+1}</span><strong>{v}</strong><p>{l}</p><small>{s}</small></div>)}
    </section>
    <section className="section-block">
      <div className="section-title"><div><span>01 / OPPORTUNITY RADAR</span><h2>Signals before saturation.</h2></div><Link href="/analytics">VIEW INTELLIGENCE <ChevronRight size={14}/></Link></div>
      <div className="signal-grid">
        <article className="signal-main"><div className="radar"><div className="radar-ring r1"/><div className="radar-ring r2"/><div className="radar-ring r3"/><span className="pulse p1"/><span className="pulse p2"/><span className="pulse p3"/></div><div><span className="tag orange">FAST RISING</span><h3>Tactile proof</h3><p>Save velocity is compounding across product, architecture and maker accounts.</p><div className="data-row"><b>+38.6%</b><span>24H VELOCITY</span><b>LOW</b><span>SATURATION</span></div></div></article>
        <article className="signal-side"><span className="tag cyan">EMERGING</span><Score value={88}/><h3>Anti-productivity</h3><p>Ritual language is replacing optimisation language.</p><div className="spark-bars">{[2,4,3,7,5,9,11,8,13,16].map((h,i)=><i key={i} style={{height:h*3}}/>)}</div></article>
        <article className="signal-side"><span className="tag">EVERGREEN+</span><Score value={83}/><h3>Single-take craft</h3><p>Proof of process continues to outperform polished reveals.</p><div className="spark-bars">{[3,5,5,6,8,7,10,11,12,14].map((h,i)=><i key={i} style={{height:h*3}}/>)}</div></article>
      </div>
    </section>
    <section className="section-block">
      <div className="section-title"><div><span>02 / RECENT CAPTURES</span><h2>Your evolving source material.</h2></div><Link href="/library">OPEN LIBRARY <ChevronRight size={14}/></Link></div>
      <div className="idea-grid">{ideas.slice(0,3).map(i=><IdeaCard idea={i} key={i.id}/>)}</div>
    </section>
    <section className="activity-panel"><div><span className="terminal-label">{"// PIPELINE ACTIVITY"}</span>{activity.map(row=><div className="activity-row" key={row[1]}><StatusDot color="cyan"/><b>{row[0]}</b><span>{row[1]}</span><em>{row[2]}</em><small>{row[3]}</small></div>)}</div><aside><Activity size={24}/><strong>ALL SYSTEMS NOMINAL</strong><span>Last check 12 sec ago</span></aside></section>
  </>;
}

function LibraryView() {
  const ideas=useVaultStore((state)=>state.ideas); const searchParams=useSearchParams(); const [mode,setMode]=useState<"grid"|"list">("grid"); const [query,setQuery]=useState(searchParams.get('q')||''); const [source,setSource]=useState('ALL');
  const filtered=ideas.filter(i=>(source==='ALL'||i.category.toUpperCase()===source)&&(i.title+i.creator+i.tags.join(" ")).toLowerCase().includes(query.toLowerCase()));
  return <><Header index="02" title="IDEA / LIBRARY" copy="Every capture, decoded and ready for recombination." />
    <div className="toolbar"><label><Search size={16}/><input aria-label="Search library" value={query} onChange={e=>setQuery(e.target.value)} placeholder="FILTER THE VAULT..."/></label><div className="filter-pills">{['ALL','INSTAGRAM','CAPTURED'].map(option=><button key={option} className={source===option?'active':''} onClick={()=>setSource(option)}>{option} {option==='ALL'?ideas.length:ideas.filter(idea=>idea.category.toUpperCase()===option).length}</button>)}</div><div className="view-toggle"><button aria-label="Grid view" className={mode==='grid'?'active':''} onClick={()=>setMode('grid')}><Grid2X2 size={16}/></button><button aria-label="List view" className={mode==='list'?'active':''} onClick={()=>setMode('list')}><List size={16}/></button></div></div>
    <div className={mode==='grid'?"idea-grid four":"idea-list"}>{filtered.map(i=><IdeaCard idea={i} compact={mode==='list'} key={i.id}/>)}</div>
    {filtered.length===0&&<EmptyState title="NO MATCHING SIGNAL" copy="Try a broader phrase, creator, or semantic concept."/>}</>;
}

function GalaxyView() {
  const ideas=useVaultStore((state)=>state.ideas); const [view,setView]=useState("GALAXY");
  return <><Header index="03" title="IDEA / GALAXY" copy="Navigate the living relationships between your ideas." />
    <div className="galaxy-toolbar"><div>{["GALAXY","ACCESSIBLE LIST"].map(x=><button key={x} onClick={()=>setView(x)} className={view===x?'active':''}>{x}</button>)}</div><span><StatusDot/> {ideas.length} NODES / LIVE GRAPH</span></div>
    {view==='GALAXY'?<section className="galaxy-shell"><GalaxyCanvas ideas={ideas}/><div className="galaxy-hud top-left"><span>ACTIVE CLUSTER</span><strong>STORYTELLING / HOOKS</strong><small>{ideas.length} indexed nodes</small></div><div className="galaxy-hud bottom-right"><span>CONTROLS</span><small>Drag to orbit · Scroll to zoom</small><small>Use accessible list for keyboard navigation</small></div></section>:<div className="galaxy-fallback visible" tabIndex={0} aria-label="Accessible idea galaxy list">{ideas.map(i=><div key={i.id}><span style={{background:i.accent}}/><b>{i.title}</b><small>{i.category}</small><Score value={i.trend}/></div>)}</div>}
  </>;
}

function FusionView() {
  const {selectedIds,toggleSelected,clearSelected,ideas}=useVaultStore(); const [phase,setPhase]=useState<"idle"|"running"|"done">("idle"); const [exported,setExported]=useState(false);
  const generate=()=>{setPhase("running");setTimeout(()=>setPhase("done"),1800)};
  const downloadPack=()=>{const content='VAULT//AI PRODUCTION PACK\n\nHOOK\nI stopped optimising this—and it finally worked.\n\nSTRUCTURE\nProof montage → confession → single-take reveal\n\nCTA\nSave the ritual. Ignore the routine.';const url=URL.createObjectURL(new Blob([content],{type:'text/plain'}));const link=document.createElement('a');link.href=url;link.download='vault-ai-production-pack.txt';link.click();URL.revokeObjectURL(url);setExported(true)};
  return <><Header index="04" title="FUSION / LAB" copy="Combine distant signals. Generate something that did not exist before." />
    <div className="fusion-layout"><section><div className="panel-heading"><span>SOURCE MATERIAL / SELECT 2–5</span><b>{selectedIds.length} SELECTED</b></div><div className="fusion-source">{ideas.map(i=><button key={i.id} onClick={()=>toggleSelected(i.id)} className={selectedIds.includes(i.id)?'selected':''}><span style={{background:i.accent}}/><div><b>{i.title}</b><small>{i.category} · {i.trend} signal</small></div>{selectedIds.includes(i.id)?<Check/>:<Plus/>}</button>)}</div></section>
    <section className="fusion-core"><div className={`fusion-orb ${phase}`}><Blocks size={44}/></div><span>CREATIVE CONSTRAINT</span><select aria-label="Fusion creative constraint"><option>Unexpected but executable</option><option>High-retention short form</option><option>Founder-led narrative</option></select><button className="primary-btn" disabled={selectedIds.length<2||phase==='running'} onClick={generate}>{phase==='running'?'SYNTHESIZING...':'INITIATE FUSION'} <Zap size={16}/></button><button className="text-btn" onClick={clearSelected}>CLEAR INPUTS</button></section>
    <section className="fusion-result"><div className="panel-heading"><span>GENERATED OUTPUT</span><b>{phase==='done'?'READY':'WAITING'}</b></div>{phase==='done'?<motion.div initial={{opacity:0}} animate={{opacity:1}}><span className="tag">PRIMARY CONCEPT</span><h3>Show the evidence before the ambition.</h3><p>Open on five tactile micro-proofs, then interrupt the expected product reveal with the founder’s quiet anti-productivity confession.</p><dl><dt>HOOK</dt><dd>“I stopped optimising this—and it finally worked.”</dd><dt>STRUCTURE</dt><dd>Proof montage → confession → single-take reveal</dd><dt>CTA</dt><dd>Save the ritual. Ignore the routine.</dd></dl><button className="outline-btn" onClick={downloadPack}>{exported?'PACK DOWNLOADED':'DOWNLOAD PRODUCTION PACK'}</button></motion.div>:<EmptyState title="AWAITING FUSION" copy="Select at least two source ideas to unlock hooks, scripts, storyboards and shot lists."/>}</section></div></>;
}

function AssistantView() {
  const enabledProviders=useVaultStore((state)=>state.enabledProviders); const [messages,setMessages]=useState([{role:'assistant',text:'Vault graph online. I can search your 2,481 ideas, surface patterns, or build a production-ready concept.'}]); const [input,setInput]=useState(''); const [busy,setBusy]=useState(false);
  const send=async()=>{if(!input.trim())return;const q=input;setInput('');setMessages(m=>[...m,{role:'user',text:q}]);setBusy(true);try{const providers=Object.entries(enabledProviders).filter(([,on])=>on).map(([name])=>name);const response=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:q,providers})});const data=await response.json() as {content?:string};setMessages(m=>[...m,{role:'assistant',text:data.content||'The provider router did not return usable content.'}])}catch{setMessages(m=>[...m,{role:'assistant',text:'The provider router is temporarily unreachable. Your prompt is preserved; retry when connectivity returns.'}])}finally{setBusy(false)}};
  return <><Header index="05" title="AI / OPERATOR" copy="Reason across your private creative graph." /><div className="assistant-layout"><aside><span className="terminal-label">{"// CONTEXT SOURCES"}</span>{['FULL IDEA GRAPH','TREND ENGINE','6 SELECTED IDEAS','CREATOR PROFILE'].map((x,i)=><button key={x}><StatusDot color={i===2?'orange':'green'}/>{x}<Check size={14}/></button>)}<div className="provider-route"><Network size={18}/><span>ROUTE</span><b>OPENROUTER → GEMINI</b><small>Fast reasoning · vision fallback</small></div></aside><section className="chat"><div className="chat-log">{messages.map((m,i)=><motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} key={i} className={`message ${m.role}`}><span>{m.role==='assistant'?'VAULT//AI':'YOU'}</span><p>{m.text}</p></motion.div>)}{busy&&<div className="typing"><i/><i/><i/></div>}</div><div className="suggestions">{['Find ideas gaining velocity','Fuse my best founder hooks','Plan 5 posts for next week'].map(x=><button key={x} onClick={()=>setInput(x)}>{x}</button>)}</div><div className="composer"><textarea aria-label="Message AI operator" placeholder="ASK THE VAULT..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}/><button aria-label="Send message" onClick={send}><ChevronRight/></button></div></section></div></>;
}

function SearchView() { const ideas=useVaultStore((state)=>state.ideas); const [q,setQ]=useState("emotional founder stories with proof"); const [mode,setMode]=useState('HYBRID'); const terms=q.toLowerCase().split(/\s+/).filter(Boolean); const keywordMatch=(idea:Idea)=>terms.some((term)=>(idea.title+' '+idea.creator+' '+idea.tags.join(' ')).toLowerCase().includes(term)); const semanticMatch=(idea:Idea)=>terms.some((term)=>(idea.category+' '+idea.insight).toLowerCase().includes(term)); const results=ideas.filter((idea)=>!terms.length||(mode==='KEYWORD'?keywordMatch(idea):mode==='SEMANTIC'?semanticMatch(idea):keywordMatch(idea)||semanticMatch(idea))); return <><Header index="06" title="DEEP / SEARCH" copy="Keyword precision plus semantic recall across every saved signal."/><div className="search-hero"><Search/><input value={q} onChange={e=>setQ(e.target.value)} aria-label="Natural language search"/><kbd>LIVE</kbd></div><div className="search-summary"><span>{results.length} RESULTS / LIVE INDEX</span><div>{['HYBRID','SEMANTIC','KEYWORD'].map(option=><button key={option} className={mode===option?'active':''} onClick={()=>setMode(option)}>{option}</button>)}</div></div><div className="search-results">{results.map((i,index)=><article key={i.id}><span className="result-index">{String(index+1).padStart(2,'0')}</span><div><span className={`tag ${index%2?'cyan':''}`}>{mode==='SEMANTIC'?'SEMANTIC MATCH':mode==='KEYWORD'?'KEYWORD MATCH':'HYBRID MATCH'}</span><h3>{i.title}</h3><p>{i.insight}</p><small>{i.creator} · {i.category} · {i.saved} ago</small></div><Score value={i.trend}/></article>)}</div>{results.length===0&&<EmptyState title="NO MATCHING SIGNAL" copy="Try a title, creator, tag, category, or a phrase from your notes."/>}</> }

const defaultCollections=[['OPENING SYSTEMS','184 ideas','#b6ff3b','hook'],['FOUNDER STORIES','96 ideas','#ff6b2c','founder'],['VISUAL PROOF','121 ideas','#7bf1ff','proof'],['QUIET LUXURY','67 ideas','#c792ff','luxury'],['AUDIO PALETTES','43 ideas','#ffd166','audio'],['CAMPAIGN // Q3','28 ideas','#ff85a1','campaign']];
function CollectionsView(){const [collections,setCollections]=useState(defaultCollections);useEffect(()=>{Promise.resolve().then(()=>{try{const saved=localStorage.getItem('vault-ai:collections');if(saved)setCollections(JSON.parse(saved) as string[][])}catch{}})},[]);const addCollection=()=>setCollections(current=>{const next=[...current,[`NEW COLLECTION ${String(current.length+1).padStart(2,'0')}`,'0 ideas','#b6ff3b','']];localStorage.setItem('vault-ai:collections',JSON.stringify(next));return next});return <><Header index="07" title="COLLECTIONS" copy="Purpose-built rooms for ideas that belong together."/><div className="collection-grid">{collections.map((c,i)=><motion.article whileHover={{scale:1.01}} key={c[0]} style={{'--accent':c[2]} as React.CSSProperties}><span>{String(i+1).padStart(2,'0')}</span><FolderKanban/><h3>{c[0]}</h3><p>{c[1]}</p><div><i/><i/><i/></div><Link aria-label={`Open ${c[0]}`} href={`/library?collection=${encodeURIComponent(c[0])}&q=${encodeURIComponent(c[3]||'__empty_collection__')}`}><ChevronRight/></Link></motion.article>)}<button className="new-collection" onClick={addCollection}><Plus/><b>NEW COLLECTION</b><span>Create a focused space</span></button></div></>}

function AnalyticsView(){return <><Header index="08" title="CREATIVE / INTELLIGENCE" copy="Measure what your attention is becoming."/><div className="analytics-grid"><section className="chart-card"><div className="panel-heading"><span>SIGNAL VELOCITY / 7D</span><b>+31.8%</b></div><ResponsiveContainer width="100%" height={300}><AreaChart data={chartData}><defs><linearGradient id="green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b6ff3b" stopOpacity={.5}/><stop offset="1" stopColor="#b6ff3b" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#202820" vertical={false}/><XAxis dataKey="day" stroke="#667066" tickLine={false}/><YAxis stroke="#667066" tickLine={false}/><Tooltip contentStyle={{background:'#0b0f0b',border:'1px solid #334033'}}/><Area type="monotone" dataKey="saves" stroke="#b6ff3b" fill="url(#green)" strokeWidth={2}/><Area type="monotone" dataKey="trend" stroke="#7bf1ff" fill="transparent" strokeWidth={1}/></AreaChart></ResponsiveContainer></section><section className="distribution"><div className="panel-heading"><span>KNOWLEDGE MIX</span><b>2,481</b></div>{[['Storytelling',32],['Business',24],['Design',19],['Audio',14],['Other',11]].map(x=><div key={x[0]}><span>{x[0]}</span><i><b style={{width:`${x[1]}%`}}/></i><strong>{x[1]}%</strong></div>)}</section><section className="insight-card"><Sparkles/><span>WEEKLY AI INSIGHT</span><h3>Your highest-value ideas live between craft and confession.</h3><p>Cross-cluster saves are up 42%. Build more bridges between process evidence and personal narrative.</p></section><section className="system-card"><CircleGauge/><span>CREATIVE SYSTEM SCORE</span><strong>84</strong><small>TOP 8% OF ACTIVE WORKSPACES</small></section></div></>}

const notificationSeed=[['TREND ALERT','Tactile proof crossed your 90-point threshold','3 minutes ago','orange'],['FUSION READY','Founder ritual × no-cut reveal is ready for review','28 minutes ago','green'],['GRAPH INSIGHT','Eleven older ideas formed a new “quiet proof” cluster','2 hours ago','cyan'],['IMPORT COMPLETE','18 Instagram items were indexed successfully','Yesterday','green']];
function NotificationsView(){const dismissed=useVaultStore((state)=>state.dismissedNotifications);const dismiss=useVaultStore((state)=>state.dismissNotification);const items=notificationSeed.filter((item)=>!dismissed.includes(item[1]));return <><Header index="09" title="SIGNAL / FEED" copy="Only the alerts that deserve your attention."/><div className="notification-list">{items.map((n,i)=><article key={n[1]}><span className="notification-index">{String(i+1).padStart(2,'0')}</span><StatusDot color={n[3] as 'orange'|'green'|'cyan'}/><div><small>{n[0]}</small><h3>{n[1]}</h3><span>{n[2]}</span></div><button aria-label={`Dismiss ${n[0]}`} onClick={()=>dismiss(n[1])}><X/></button></article>)}{items.length===0&&<EmptyState title="INBOX ZERO" copy="All signal notifications have been reviewed."/>}</div></>}

function LiveSettingsView(){
  const providers=useVaultStore((state)=>state.enabledProviders); const toggleProvider=useVaultStore((state)=>state.toggleProvider);
  const [cli,setCli]=useState<'waiting'|'checking'|'ready'|'login'>('waiting');
  const checkCli=async()=>{setCli('checking');try{const response=await fetch('http://127.0.0.1:4317/health');const data=await response.json() as {authenticated?:boolean};setCli(data.authenticated?'ready':'login')}catch{setCli('waiting')}};
  const label=cli==='ready'?'CONNECTED':cli==='login'?'LOGIN REQUIRED':cli==='checking'?'CHECKING...':'BRIDGE OFFLINE';
  return <><Header index="10" title="SYSTEM / SETTINGS" copy="Control connections, intelligence routing, and workspace behavior."/><div className="settings-layout"><section><div className="panel-heading"><span>INSTAGRAM CLI BRIDGE</span><b className={cli==='ready'?'':'warn'}>{label}</b></div><div className="integration-card"><Camera/><div><h3>Instagram CLI 2.0.1</h3><p>Installed locally. Run the secure login once in your terminal; credentials remain in the CLI session store and never enter Vault AI.</p><code>instagram-cli auth login --username</code></div><button onClick={checkCli} disabled={cli==='checking'}>RECHECK</button></div><div className="security-note"><ShieldCheck/><p><b>LOCAL-FIRST CREDENTIAL BOUNDARY</b><br/>Vault AI communicates with the CLI bridge through structured JSON. It never stores your Instagram password.</p></div></section><section><div className="panel-heading"><span>AI PROVIDER ROUTING</span><b>{Object.values(providers).filter(Boolean).length} ENABLED</b></div><div className="provider-list">{Object.entries(providers).map(([name,on],i)=><div key={name}><span>0{i+1}</span><div><b>{name.toUpperCase()}</b><small>{i===0?'PRIMARY ROUTER':i===3?'VISION + LONG CONTEXT':'SPECIALIST FALLBACK'}</small></div><button aria-label={`${on?'Disable':'Enable'} ${name}`} aria-pressed={on} className={on?'on':''} onClick={()=>toggleProvider(name)}><i/></button></div>)}</div></section><section><div className="panel-heading"><span>DATABASE + STORAGE</span><b><StatusDot/> ONLINE</b></div><div className="infra-grid"><div><Database/><b>CLOUDFLARE D1</b><span>Structured workspace data</span></div><div><Archive/><b>CLOUDFLARE R2</b><span>Media + transcripts</span></div></div></section></div></>;
}

function Header({index,title,copy}:{index:string;title:string;copy:string}){return <header className="view-header standard"><div className="kicker">{index} / VAULT WORKSPACE</div><h1>{title}</h1><p>{copy}</p></header>}
function EmptyState({title,copy}:{title:string;copy:string}){return <div className="empty-state"><Hexagon/><b>{title}</b><p>{copy}</p></div>}

function CaptureModal({close}:{close:()=>void}){
  const [form,setForm]=useState({title:'',sourceUrl:'',summary:'',creator:'unknown'}); const [status,setStatus]=useState<'idle'|'saving'|'saved'|'error'>('idle');
  const hydrateIdeas=useVaultStore((state)=>state.hydrateIdeas);
  const dialogRef=useRef<HTMLFormElement>(null);
  useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')close();if(event.key==='Tab'&&dialogRef.current){const focusable=Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button,input,textarea,[href]')).filter((element)=>!element.hasAttribute('disabled'));if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[close]);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setStatus('saving');try{const response=await fetch('/api/ideas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...form,tags:['captured']})});if(!response.ok)throw new Error('save failed');const data=await response.json() as {idea:{id:string;title:string;creator:string;summary:string;source:string;tags:string}};hydrateIdeas([data.idea]);setStatus('saved');setTimeout(close,800)}catch{setStatus('error')}};
  return <div className="modal-overlay" role="presentation" onMouseDown={close}><motion.form ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="capture-title" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} onMouseDown={e=>e.stopPropagation()} onSubmit={submit}><div className="modal-head"><div><span>{"// NEW SIGNAL"}</span><h2 id="capture-title">Capture an idea.</h2></div><button type="button" aria-label="Close capture dialog" onClick={close}><X/></button></div><label>TITLE<input autoFocus required minLength={2} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="What should you remember?"/></label><label>INSTAGRAM OR SOURCE URL<input type="url" value={form.sourceUrl} onChange={e=>setForm({...form,sourceUrl:e.target.value})} placeholder="https://instagram.com/p/..."/></label><label>CREATOR<input value={form.creator} onChange={e=>setForm({...form,creator:e.target.value})} placeholder="@creator"/></label><label>CONTEXT<textarea value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} placeholder="Why is this signal valuable?"/></label><div className="modal-actions"><span aria-live="polite">{status==='error'?'DATABASE SAVE FAILED':status==='saved'?'CAPTURED + INDEXED':''}</span><button type="submit" className="primary-btn" disabled={status==='saving'}>{status==='saving'?'INDEXING...':'SAVE TO VAULT'}<ChevronRight/></button></div></motion.form></div>;
}

const screens: Record<ViewName,()=>React.ReactNode>={dashboard:DashboardView,library:LibraryView,galaxy:GalaxyView,fusion:FusionView,assistant:AssistantView,search:SearchView,collections:CollectionsView,analytics:AnalyticsView,notifications:NotificationsView,settings:LiveSettingsView};

export function VaultApp({initialView}:{initialView:ViewName}) {
  const [mobileOpen,setMobileOpen]=useState(false); const [command,setCommand]=useState(false); const [commandQuery,setCommandQuery]=useState(''); const [captureOpen,setCaptureOpen]=useState(false); const Screen=screens[initialView]; const captureTrigger=useRef<HTMLButtonElement>(null); const commandTrigger=useRef<HTMLButtonElement>(null); const commandDialog=useRef<HTMLDivElement>(null); const hydrateIdeas=useVaultStore((state)=>state.hydrateIdeas); const dismissedNotifications=useVaultStore((state)=>state.dismissedNotifications); const dismissNotification=useVaultStore((state)=>state.dismissNotification);
  const current=useMemo(()=>nav.find(x=>x.name===initialView),[initialView]);
  const visibleCommands=nav.filter((item)=>item.label.toLowerCase().includes(commandQuery.toLowerCase()));
  useEffect(()=>{fetch('/api/ideas').then((response)=>response.ok?response.json():Promise.reject()).then((data:{ideas:Array<{id:string;title:string;creator:string;summary:string;source:string;tags:string}>})=>hydrateIdeas(data.ideas)).catch(()=>undefined);try{const saved=localStorage.getItem('vault-ai:providers');if(saved)useVaultStore.getState().setEnabledProviders(JSON.parse(saved) as Record<string,boolean>);const dismissed=JSON.parse(localStorage.getItem('vault-ai:dismissed-notifications')||'[]') as string[];dismissed.forEach(dismissNotification)}catch{}},[dismissNotification,hydrateIdeas]);
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();setCommand(v=>{if(v)setTimeout(()=>commandTrigger.current?.focus(),0);return !v})} if(e.key==='Escape'){if(command){setCommand(false);setTimeout(()=>commandTrigger.current?.focus(),0)}setMobileOpen(false)} if(e.key==='Tab'&&command&&commandDialog.current){const focusable=Array.from(commandDialog.current.querySelectorAll<HTMLElement>('input,a,button')).filter((element)=>!element.hasAttribute('disabled'));if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[command]);
  const closeCapture=()=>{setCaptureOpen(false);setTimeout(()=>captureTrigger.current?.focus(),0)};
  const closeCommand=()=>{setCommand(false);setTimeout(()=>commandTrigger.current?.focus(),0)};
  return <div className="app-shell"><a className="skip-link" href="#main">Skip to main content</a><aside className={`sidebar ${mobileOpen?'open':''}`}><div className="brand"><Hexagon/><div><b>VAULT<span>{"//AI"}</span></b><small>CREATIVE INTELLIGENCE OS</small></div><button aria-label="Close navigation" className="close-mobile" onClick={()=>setMobileOpen(false)}><X/></button></div><nav aria-label="Primary navigation">{nav.map(({name,label,icon:Icon,hotkey})=><Link href={`/${name}`} className={initialView===name?'active':''} key={name}><Icon/><span>{label}</span><kbd>{hotkey}</kbd></Link>)}</nav><div className="sidebar-bottom"><Link href="/notifications" className={initialView==='notifications'?'active':''}><Bell/><span>Notifications</span><i>{Math.max(0,notificationSeed.length-dismissedNotifications.length)}</i></Link><Link href="/settings" className={initialView==='settings'?'active':''}><Settings/><span>System settings</span></Link><div className="system-status"><StatusDot/><div><b>SYSTEM NOMINAL</b><span>CLI bridge waiting for login</span></div></div></div></aside><div className="main-column"><header className="topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb"><span>VAULT</span><ChevronRight/><b>{current?.label??initialView}</b></div><button ref={commandTrigger} aria-label="Open command palette" className="command-trigger" onClick={()=>setCommand(true)}><Command/><span>SEARCH OR COMMAND</span><kbd>CTRL K</kbd></button><button ref={captureTrigger} className="capture-btn" onClick={()=>setCaptureOpen(true)}><Import/> CAPTURE IDEA</button><div className="avatar">NX</div></header><main id="main"><AnimatePresence mode="wait"><motion.div key={initialView} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.24}}><Screen/></motion.div></AnimatePresence></main><footer><span>VAULT//AI © 2026</span><span>PRIVATE GRAPH / ENCRYPTED</span><span>v0.9.0-PREVIEW</span></footer></div>{command&&<div className="command-overlay" role="presentation" onMouseDown={closeCommand}><motion.div ref={commandDialog} role="dialog" aria-modal="true" aria-label="Command palette" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} onMouseDown={e=>e.stopPropagation()}><label><Search/><input aria-label="Filter commands" autoFocus value={commandQuery} onChange={e=>setCommandQuery(e.target.value)} placeholder="Search commands..."/></label><span>QUICK NAVIGATION</span>{visibleCommands.map(x=><Link key={x.name} href={`/${x.name}`}><x.icon/><b>{x.label}</b><kbd>{x.hotkey}</kbd></Link>)}{visibleCommands.length===0&&<small>NO MATCHING COMMAND</small>}</motion.div></div>}{captureOpen&&<CaptureModal close={closeCapture}/>}</div>
}
