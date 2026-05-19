"use client";
import { useRuntime, useTasks } from "./hooks/useRuntime";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Activity, Cpu, MessageSquare, AlertTriangle,
  CheckCircle, Clock, Zap, Database, RefreshCw,
  Send, X, Hash, Tag, RotateCcw, AlertCircle, Info
} from "lucide-react";

const T = {
  bg:        "#020617",
  surface:   "rgba(15,23,42,0.72)",
  surfaceAlt:"rgba(30,41,59,0.68)",
  glass:     "rgba(15,23,42,0.5)",
  border:    "rgba(148,163,184,0.14)",
  borderMd:  "rgba(59,130,246,0.25)",
  blue:      "#3b82f6",
  indigo:    "#6366f1",
  teal:      "#0d9488",
  amber:     "#d97706",
  green:     "#10b981",
  red:       "#ef4444",
  text:      "#f8fafc",
  sub:       "#cbd5e1",
  muted:     "#94a3b8",
  faint:     "#475569",
};

const elevation1 = "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(59,130,246,0.08)";
const elevation2 = "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(148,163,184,0.08)";
const elevationHover = "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.2), 0 0 20px rgba(59,130,246,0.1)";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <defs>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D"/>
          <stop offset="60%" stopColor="#D97706"/>
          <stop offset="100%" stopColor="#92400E"/>
        </radialGradient>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F1E3D"/>
          <stop offset="100%" stopColor="#050A14"/>
        </radialGradient>
        <radialGradient id="glowRad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
        </radialGradient>
        <filter id="coreGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="0.8" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="40" cy="40" r="40" fill="url(#glowRad)" opacity="0.6"/>
      <circle cx="40" cy="40" r="37" fill="url(#bgGrad)"/>
      <circle cx="40" cy="40" r="36" stroke="#1E3A8A" strokeWidth="0.8" fill="none" strokeOpacity="0.8"/>
      <circle cx="40" cy="40" r="29" stroke="#1D4ED8" strokeWidth="0.7" fill="none" strokeOpacity="0.6" filter="url(#ringGlow)"/>
      <circle cx="40" cy="40" r="21" stroke="#2563EB" strokeWidth="0.8" fill="none" strokeOpacity="0.7" strokeDasharray="4 3" filter="url(#ringGlow)"/>
      <circle cx="40" cy="40" r="13" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.9" filter="url(#ringGlow)"/>
      <circle cx="40" cy="40" r="13" fill="#0F172A" fillOpacity="0.8"/>
      <circle cx="40" cy="40" r="8" fill="url(#core)" filter="url(#coreGlow)"/>
      <circle cx="40" cy="40" r="4.5" fill="#FDE68A" opacity="0.95"/>
      <circle cx="40" cy="40" r="2" fill="white"/>
      <circle cx="40" cy="11" r="2.5" fill="#3B82F6" filter="url(#ringGlow)"/>
      <circle cx="69" cy="40" r="2" fill="#2563EB" filter="url(#ringGlow)"/>
      <circle cx="40" cy="69" r="2.5" fill="#3B82F6" filter="url(#ringGlow)"/>
      <circle cx="11" cy="40" r="2" fill="#2563EB" filter="url(#ringGlow)"/>
      <circle cx="55" cy="25" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="55" cy="55" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="25" cy="55" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <circle cx="25" cy="25" r="1.5" fill="#60A5FA" opacity="0.7"/>
      <line x1="40" y1="13" x2="40" y2="27" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="67" y1="40" x2="61" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="40" y1="67" x2="40" y2="53" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
      <line x1="13" y1="40" x2="19" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.5"/>
    </svg>
  );
}

const SC: any = {
  online:   { color: T.green, label: "Online",   bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)"  },
  degraded: { color: T.amber, label: "Degraded", bg: "rgba(217,119,6,0.1)",   border: "rgba(217,119,6,0.25)"   },
  offline:  { color: T.red,   label: "Offline",  bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)"   },
};

const TC: any = {
  done: T.green, doing: T.blue, pending: T.amber, failed: T.red, review: T.indigo,
};

function MetricCard({ label, value, sub, icon: Icon, color, delay = 0, onClick, active }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23,1,0.32,1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      onClick={onClick}
      style={{
        background: active ? `rgba(59,130,246,0.12)` : T.surface, backgroundImage: active ? "none" : "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
        border: active ? `1px solid rgba(59,130,246,0.4)` : `1px solid ${T.border}`,
        borderRadius: 16, padding: "20px 22px",
        boxShadow: active ? `0 0 0 1px rgba(59,130,246,0.2), ${elevation2}` : elevation1,
        backdropFilter: "blur(20px)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <span style={{ fontSize:10, fontWeight:700, color: active ? T.blue : T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}{active ? " ?" : ""}</span>
        <div style={{ background:`${color}18`, border:`1px solid ${color}30`, borderRadius:9, padding:"5px 6px", display:"flex" }}>
          <Icon size={13} style={{ color }} strokeWidth={2.2}/>
        </div>
      </div>
      <div style={{ fontSize:32, fontWeight:800, color: active ? T.blue : T.text, lineHeight:1, letterSpacing:"-0.03em" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.faint, marginTop:8, fontWeight:500 }}>{sub}</div>}
    </motion.div>
  );
}

function TaskDetailModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetch(`${API}/tasks/${taskId}`)
      .then(r => r.json())
      .then(data => { setTask(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la tarea."); setLoading(false); });
  }, [taskId]);

  const tc = task ? (TC[task.status] || T.muted) : T.muted;

  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
        onClick={onClose}
        style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(2,6,23,0.7)", backdropFilter:"blur(8px)" }}
      />
      <motion.div key="panel"
        initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:60 }}
        transition={{ duration:0.32, ease:[0.23,1,0.32,1] }}
        style={{
          position:"fixed", top:0, right:0, bottom:0, zIndex:201,
          width:"min(480px, 100vw)",
          background:"rgba(10,15,30,0.95)",
          borderLeft:`1px solid ${T.border}`,
          boxShadow:"-8px 0 48px rgba(0,0,0,0.6)",
          display:"flex", flexDirection:"column", overflowY:"auto",
          backdropFilter:"blur(24px)",
        }}
      >
        <div style={{ padding:"22px 26px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(15,23,42,0.8)", position:"sticky", top:0, zIndex:10 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:4 }}>Detalle de tarea</div>
            <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{task ? (task.title || task.id) : "Cargando..."}</div>
          </div>
          <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }} onClick={onClose}
            style={{ background:"rgba(148,163,184,0.08)", border:`1px solid ${T.border}`, borderRadius:9, padding:"7px 9px", cursor:"pointer", display:"flex", alignItems:"center" }}>
            <X size={14} style={{ color:T.muted }}/>
          </motion.button>
        </div>
        <div style={{ padding:"22px 26px", flex:1 }}>
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 0" }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
              </motion.div>
            </div>
          )}
          {error && <div style={{ color:T.red, fontSize:13, fontWeight:600, padding:"20px 0", display:"flex", alignItems:"center", gap:8 }}><AlertCircle size={15}/>{error}</div>}
          {task && !loading && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:700, color:tc, background:`${tc}14`, border:`1px solid ${tc}30`, padding:"3px 12px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.07em" }}>{task.status}</span>
                {task.phase && <span style={{ fontSize:11, fontWeight:700, color:T.indigo, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.25)", padding:"3px 12px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.07em" }}>{task.phase}</span>}
              </div>
              {[
                { label:"ID", value:task.id, icon:Hash },
                { label:"Titulo", value:task.title, icon:Tag },
                { label:"Creada", value:task.created_at ? new Date(task.created_at).toLocaleString() : "-", icon:Clock },
                { label:"Reintentos", value:task.retry_count ?? 0, icon:RotateCcw },
              ].map(f => f.value !== undefined && f.value !== null ? (
                <div key={f.label}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                    <f.icon size={10} style={{ color:T.faint }}/>
                    <span style={{ fontSize:10, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>{f.label}</span>
                  </div>
                  <div style={{ background:"rgba(15,23,42,0.6)", border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 13px", fontSize:12, color:T.sub, fontWeight:600, wordBreak:"break-all" }}>{String(f.value)}</div>
                </div>
              ) : null)}
              {task.description && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}><Info size={10} style={{ color:T.faint }}/><span style={{ fontSize:10, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>Descripcion</span></div>
                  <div style={{ background:"rgba(15,23,42,0.6)", border:`1px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:12, color:T.sub, lineHeight:1.6, fontWeight:500 }}>{task.description}</div>
                </div>
              )}
              {task.error && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}><AlertTriangle size={10} style={{ color:T.red }}/><span style={{ fontSize:10, fontWeight:700, color:T.red, textTransform:"uppercase", letterSpacing:"0.1em" }}>Error</span></div>
                  <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"11px 13px", fontSize:11, color:"#fca5a5", lineHeight:1.6, fontWeight:500, fontFamily:"monospace", wordBreak:"break-all" }}>{task.error}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SL({ children }: any) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <div style={{ width:2, height:14, borderRadius:2, background:`linear-gradient(${T.blue}, ${T.indigo})` }}/>
      <span style={{ fontSize:10, fontWeight:700, color:T.faint, textTransform:"uppercase", letterSpacing:"0.14em" }}>{children}</span>
    </div>
  );
}

function AIChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role:string;text:string;ms?:number}[]>([
    { role:"hermes", text:"Sistema operacional activo. Preguntame sobre el runtime, tareas, fallos o prioridades." }
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim(); setInput("");
    setMessages(m => [...m, { role:"user", text:q }]);
    setLoading(true);
    const t0 = Date.now();
    try {
      const res = await fetch(`${API}/ai/test`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:q }) });
      const data = await res.json();
      const ms = Date.now() - t0;
      setMessages(m => [...m, { role:"hermes", text: data.success ? (data.content || "Sin respuesta") : "Error del provider", ms }]);
    } catch {
      setMessages(m => [...m, { role:"hermes", text:"Backend no disponible." }]);
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.5 }}
      style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:18, overflow:"hidden", boxShadow:elevation2, display:"flex", flexDirection:"column", height:440, backdropFilter:"blur(20px)" }}>
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10, background:"rgba(15,23,42,0.6)" }}>
        <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:2.5 }}
          style={{ width:7, height:7, borderRadius:"50%", background:T.green, boxShadow:`0 0 8px ${T.green}` }}/>
        <span style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.1em" }}>Hermes AI</span>
        <span style={{ fontSize:10, color:T.faint, marginLeft:"auto" }}>OpenRouter · DeepSeek v3</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}
              style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth:"82%", padding:"10px 14px",
                borderRadius: m.role==="user" ? "14px 14px 3px 14px" : "3px 14px 14px 14px",
                background: m.role==="user" ? `linear-gradient(135deg, ${T.blue}, ${T.indigo})` : "rgba(30,41,59,0.8)",
                border: m.role==="user" ? "none" : `1px solid ${T.border}`,
              }}>
                <div style={{ fontSize:13, color: m.role==="user" ? "white" : T.sub, lineHeight:1.55, fontWeight:500 }}>{m.text}</div>
                {m.ms && <div style={{ fontSize:10, color: m.role==="user" ? "rgba(255,255,255,0.5)" : T.faint, marginTop:5 }}>{(m.ms/1000).toFixed(1)}s</div>}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:"flex", gap:5, padding:"6px 0" }}>
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y:[0,-5,0] }} transition={{ repeat:Infinity, duration:0.8, delay:i*0.15 }}
                  style={{ width:6, height:6, borderRadius:"50%", background:T.blue }}/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8, background:"rgba(15,23,42,0.6)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Pregunta sobre el runtime..."
          style={{ flex:1, background:"rgba(30,41,59,0.8)", border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 14px", fontSize:13, color:T.text, outline:"none", fontFamily:"inherit", fontWeight:500 }}/>
        <button onClick={send} disabled={loading || !input.trim()}
          style={{ background:`linear-gradient(135deg, ${T.blue}, ${T.indigo})`, border:"none", borderRadius:10, padding:"9px 14px", cursor: loading || !input.trim() ? "default" : "pointer", opacity: loading || !input.trim() ? 0.4 : 1, display:"flex", alignItems:"center", gap:5, color:"white", fontSize:12, fontWeight:700 }}>
          <Send size={12}/> Enviar
        </button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { runtime, loading, error, lastUpdated, refresh } = useRuntime(5000);
  const { tasks } = useTasks(10000);
  const [taskFilter, setTaskFilter] = useState<string|null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string|null>(null);
  const filteredTasks = taskFilter ? tasks.filter((t:any) => t.status === taskFilter) : tasks;
  const status = runtime?.status || "offline";
  const sc = SC[status] || SC.offline;
  const toggleFilter = (f: string) => setTaskFilter(prev => prev === f ? null : f);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text }}>

      {/* Ambient background */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-20%", left:"10%", width:800, height:600, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 65%)" }}/>
        <div style={{ position:"absolute", bottom:"0%", right:"5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)" }}/>
        <div style={{ position:"absolute", top:"40%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(13,148,136,0.09) 0%, transparent 65%)"}}/>        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.8) 100%)", pointerEvents:"none" }}/>
      </div>

      {selectedTaskId && <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)}/>}

      {/* Header */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"rgba(2,6,23,0.92)", backdropFilter:"blur(32px)", borderBottom:`1px solid ${T.border}`, boxShadow:"0 1px 40px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(148,163,184,0.06)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 28px", height:62, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <HermesLogo size={34}/>
            <div>
              <span style={{ fontSize:17, fontWeight:900, letterSpacing:"-0.03em", background:`linear-gradient(90deg, #60a5fa, #818cf8)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>HERMES</span>
              <span style={{ fontSize:9, color:T.faint, letterSpacing:"0.16em", textTransform:"uppercase", fontWeight:600, marginLeft:10 }}>Operational Runtime</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {error && <span style={{ fontSize:11, color:T.red, fontWeight:600 }}>? Backend offline</span>}
            {taskFilter && (
              <motion.span initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                style={{ fontSize:11, fontWeight:700, color:T.blue, background:"rgba(59,130,246,0.12)", border:"1px solid rgba(59,130,246,0.25)", padding:"4px 12px", borderRadius:20, cursor:"pointer" }}
                onClick={() => setTaskFilter(null)}>
                {taskFilter} ×
              </motion.span>
            )}
            <button onClick={refresh} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(148,163,184,0.06)", border:`1px solid ${T.border}`, borderRadius:9, padding:"6px 13px", cursor:"pointer", fontSize:11, color:T.muted, fontWeight:600 }}>
              <RefreshCw size={10}/>{lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 28px", position:"relative", zIndex:1 }}>

        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:500, gap:20 }}>
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
            </motion.div>
            <span style={{ fontSize:13, color:T.faint, fontWeight:500, letterSpacing:"0.05em" }}>Conectando...</span>
          </div>
        )}

        {runtime && (
          <>
            {/* Hero */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
              style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"28px 36px", marginBottom:28, boxShadow:"0 8px 60px rgba(0,0,0,0.7), 0 0 120px rgba(59,130,246,0.12), 0 0 0 1px rgba(148,163,184,0.15), inset 0 1px 0 rgba(255,255,255,0.07)", backdropFilter:"blur(24px)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:18 }}>
                <HermesLogo size={52}/>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                    <span style={{ fontSize:28, fontWeight:900, letterSpacing:"-0.05em", background:"linear-gradient(120deg, #93C5FD, #818cf8, #34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>HERMES</span>
                    <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ repeat:Infinity, duration:2.5 }}
                      style={{ width:8, height:8, borderRadius:"50%", background:sc.color, boxShadow:`0 0 10px ${sc.color}` }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, padding:"3px 11px", borderRadius:20 }}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.faint, fontWeight:500 }}>Operational Runtime · AI-powered · PostgreSQL · Telegram</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                {[
                  { label:"Status", value:runtime.uptime || "active" },
                  { label:"Provider", value:runtime.ai?.provider || "OpenRouter" },
                  { label:"Model", value:runtime.ai?.model || "default" },
                  { label:"Backlog", value:`${(runtime.tasks?.running||0) + (runtime.tasks?.pending||0)}` },
                ].map(item => (
                  <div key={item.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:17, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{item.value}</div>
                    <div style={{ fontSize:9, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:3, fontWeight:600 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Runtime metrics */}
            <div style={{ marginBottom:28 }}>
              <SL>Runtime</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14 }}>
                <MetricCard label="Estado" value={sc.label} icon={Activity} color={sc.color} delay={0} sub={runtime.uptime || "active"}/>
                <MetricCard label="Procesadas" value={runtime.tasks?.total||0} icon={CheckCircle} color={T.blue} delay={0.06} onClick={() => toggleFilter("done")} active={taskFilter==="done"} sub={`${runtime.tasks?.done||0} ok · ${runtime.tasks?.failed||0} fail`}/>
                <MetricCard label="Backlog" value={(runtime.tasks?.running||0)+(runtime.tasks?.pending||0)} icon={Clock} color={T.amber} delay={0.12} onClick={() => toggleFilter("pending")} active={taskFilter==="pending"} sub={`${runtime.tasks?.running||0} running · ${runtime.tasks?.pending||0} pending`}/>
                <MetricCard label="Fallidas" value={runtime.tasks?.failed||0} icon={AlertTriangle} color={T.red} delay={0.18} onClick={() => toggleFilter("failed")} active={taskFilter==="failed"} sub="click para filtrar"/>
              </div>
            </div>

            {/* AI metrics */}
            <div style={{ marginBottom:28 }}>
              <SL>AI Pipeline</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:14 }}>
                <MetricCard label="Requests IA" value={runtime.ai?.requests||0} icon={Cpu} color={T.indigo} delay={0.22} sub="total"/>
                <MetricCard label="Pipeline avg" value={runtime.pipeline_avg_ms > 0 ? `${(runtime.pipeline_avg_ms/1000).toFixed(1)}s` : "—"} icon={Zap} color={T.teal} delay={0.28} sub="latencia total"/>
                <MetricCard label="Provider avg" value={runtime.provider_avg_ms > 0 ? `${(runtime.provider_avg_ms/1000).toFixed(1)}s` : "—"} icon={MessageSquare} color={T.amber} delay={0.34} sub="openrouter"/>
                <MetricCard label="DB Context avg" value={runtime.db_context_avg_ms > 0 ? `${runtime.db_context_avg_ms}ms` : "—"} icon={Database} color={T.teal} delay={0.4} sub="context builder"/>
              </div>
            </div>

            {/* Bottom grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:20 }}>

              {/* Tasks */}
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.45 }}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:18, padding:"22px 24px", boxShadow:elevation2, backdropFilter:"blur(20px)" }}>
                <SL>Tasks{taskFilter ? ` — ${taskFilter}` : " recientes"}</SL>
                {filteredTasks.length === 0
                  ? <div style={{ color:T.faint, fontSize:13, padding:"20px 0", textAlign:"center" }}>Sin tasks</div>
                  : filteredTasks.slice(0,12).map((t:any, i:number) => {
                    const tc = TC[t.status] || T.muted;
                    return (
                      <motion.div key={t.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.03 }}
                        whileHover={{ backgroundColor:"rgba(59,130,246,0.06)" }}
                        onClick={() => setSelectedTaskId(t.id)}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 6px", borderBottom:`1px solid ${T.border}`, borderRadius:6, cursor:"pointer", transition:"background 0.15s" }}>
                        <span style={{ fontSize:9, fontWeight:800, color:tc, background:`${tc}14`, border:`1px solid ${tc}28`, padding:"2px 8px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{t.status}</span>
                        <span style={{ fontSize:12, color:T.sub, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500 }}>{t.title}</span>
                        <span style={{ fontSize:10, color:T.faint }}>›</span>
                      </motion.div>
                    );
                  })
                }
              </motion.div>

              {/* Sistema */}
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.48, duration:0.45 }}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:18, padding:"22px 24px", boxShadow:elevation2, backdropFilter:"blur(20px)" }}>
                <SL>Sistema</SL>
                {[
                  { label:"Runner", value:runtime.status==="online" ? "Alive" : "Dead", ok:runtime.status==="online" },
                  { label:"Provider", value:runtime.ai?.provider||"OpenRouter", ok:true },
                  { label:"Model", value:runtime.ai?.model||"default", ok:true },
                  { label:"Database", value:"Railway PostgreSQL", ok:true },
                  { label:"Telegram", value:"Polling activo", ok:true },
                  { label:"Uptime", value:runtime.uptime||"active", ok:runtime.status==="online" },
                ].map(r => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:12, color:T.faint, fontWeight:500 }}>{r.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:r.ok?T.green:T.red, boxShadow:`0 0 6px ${r.ok?T.green:T.red}` }}/>
                      <span style={{ fontSize:12, fontWeight:600, color:T.sub }}>{r.value}</span>
                    </div>
                  </div>
                ))}
              </motion.div>

              <AIChatPanel/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
