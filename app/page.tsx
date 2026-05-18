"use client";
import { useRuntime, useTasks } from "./hooks/useRuntime";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Activity, Cpu, MessageSquare, AlertTriangle,
  CheckCircle, Clock, Zap, Database, RefreshCw,
  Send, X, Hash, Tag, RotateCcw, AlertCircle, Info} from "lucide-react";

const T = {
  bg:        "#f5f7fa",
  surface:   "rgba(255,255,255,0.90)",
  surfaceAlt:"rgba(248,250,255,0.95)",
  glass:     "rgba(255,255,255,0.65)",
  border:    "rgba(59,130,246,0.12)",
  borderMd:  "rgba(59,130,246,0.22)",
  blue:      "#3b82f6",
  indigo:    "#6366f1",
  teal:      "#0d9488",
  gold:      "#b45309",
  amber:     "#d97706",
  green:     "#059669",
  red:       "#dc2626",
  text:      "#0f172a",
  sub:       "#334155",
  muted:     "#64748b",
  faint:     "#94a3b8",
};

const elevation1 = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(59,130,246,0.07)";
const elevation2 = "0 2px 8px rgba(0,0,0,0.07), 0 8px 32px rgba(59,130,246,0.10)";
const elevationHover = "0 4px 20px rgba(0,0,0,0.09), 0 12px 40px rgba(59,130,246,0.14)";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function HermesLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="0.5" stopColor="#6366f1"/>
          <stop offset="1" stopColor="#0d9488"/>
        </linearGradient>
        <filter id="hglow">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="20" cy="20" r="19" fill="white" stroke="url(#hg)" strokeWidth="1.5"/>
      <circle cx="20" cy="14" r="5" stroke="url(#hg)" strokeWidth="1.8" fill="none" filter="url(#hglow)"/>
      <circle cx="20" cy="14" r="2" fill="url(#hg)"/>
      <path d="M10 33c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="url(#hg)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

const SC: any = {
  online:   { color: T.green,  label: "Online",   bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.2)"  },
  degraded: { color: T.amber,  label: "Degraded", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.2)"  },
  offline:  { color: T.red,    label: "Offline",  bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.2)"  },
};

const TC: any = {
  done:    T.green, doing: T.blue,
  pending: T.amber, failed: T.red, review: T.indigo,
};

function MetricCard({ label, value, sub, icon: Icon, color, delay = 0, onClick, active }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23,1,0.32,1] }}
      whileHover={{ y: -3, boxShadow: elevationHover, transition: { duration: 0.18 } }}
      onClick={onClick}
      style={{
        background: active ? `${color}0f` : T.surface,
        border: active ? `1.5px solid ${color}50` : `1px solid ${T.border}`,
        borderRadius: 18,
        padding: "22px 24px",
        boxShadow: active ? `0 0 0 3px ${color}18, ${elevation2}` : elevation1,
        backdropFilter: "blur(16px)",
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <span style={{ fontSize:10, fontWeight:700, color: active ? color : T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}{active ? " ●" : ""}</span>
        <div style={{ background:`${color}14`, border:`1px solid ${color}28`, borderRadius:10, padding:"6px 7px", display:"flex" }}>
          <Icon size={14} style={{ color }} strokeWidth={2.2}/>
        </div>
      </div>
      <div style={{ fontSize:34, fontWeight:800, color: active ? color : T.text, lineHeight:1, letterSpacing:"-0.03em" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:T.faint, marginTop:9, fontWeight:500 }}>{sub}</div>}
    </motion.div>
  );
}

function TaskDetailModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/tasks/${taskId}`)
      .then(r => r.json())
      .then(data => { setTask(data); setLoading(false); })
      .catch(() => { setError("No se pudo cargar la tarea."); setLoading(false); });
  }, [taskId]);

  const tc = task ? (TC[task.status] || T.muted) : T.muted;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(15,23,42,0.35)",
          backdropFilter:"blur(6px)",
        }}
      />
      <motion.div
        key="panel"
        initial={{ opacity:0, x: 60 }}
        animate={{ opacity:1, x: 0 }}
        exit={{ opacity:0, x: 60 }}
        transition={{ duration:0.32, ease:[0.23,1,0.32,1] }}
        style={{
          position:"fixed", top:0, right:0, bottom:0, zIndex:201,
          width: "min(480px, 100vw)",
          background: T.surfaceAlt,
          borderLeft: `1px solid ${T.borderMd}`,
          boxShadow: "-8px 0 48px rgba(59,130,246,0.12)",
          display:"flex", flexDirection:"column",
          overflowY:"auto",
        }}
      >
        <div style={{
          padding:"24px 28px 20px",
          borderBottom:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background: T.surface, position:"sticky", top:0, zIndex:10,
        }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:T.faint, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:4 }}>Detalle de tarea</div>
            <div style={{ fontSize:15, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>
              {task ? (task.title || task.id) : "Cargando..."}
            </div>
          </div>
          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
            onClick={onClose}
            style={{
              background: T.surfaceAlt, border:`1px solid ${T.border}`,
              borderRadius:10, padding:"7px 9px", cursor:"pointer",
              display:"flex", alignItems:"center",
              boxShadow: elevation1,
            }}
          >
            <X size={15} style={{ color:T.muted }}/>
          </motion.button>
        </div>

        <div style={{ padding:"24px 28px", flex:1 }}>
          {loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 0" }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
              </motion.div>
            </div>
          )}
          {error && (
            <div style={{ color:T.red, fontSize:13, fontWeight:600, padding:"20px 0", display:"flex", alignItems:"center", gap:8 }}>
              <AlertCircle size={15}/> {error}
            </div>
          )}
          {task && !loading && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <span style={{
                  fontSize:11, fontWeight:800, color:tc,
                  background:`${tc}14`, border:`1px solid ${tc}30`,
                  padding:"4px 14px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.07em"
                }}>{task.status}</span>
                {task.phase && (
                  <span style={{
                    fontSize:11, fontWeight:700, color:T.indigo,
                    background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)",
                    padding:"4px 14px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.07em"
                  }}>{task.phase}</span>
                )}
              </div>
              {[
                { label:"ID", value: task.id, icon: Hash },
                { label:"Titulo", value: task.title, icon: Tag },
                { label:"Creada", value: task.created_at ? new Date(task.created_at).toLocaleString() : "-", icon: Clock },
                { label:"Reintentos", value: task.retry_count ?? 0, icon: RotateCcw },
              ].map(f => f.value !== undefined && f.value !== null ? (
                <div key={f.label}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
                    <f.icon size={11} style={{ color:T.faint }}/>
                    <span style={{ fontSize:10, fontWeight:800, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>{f.label}</span>
                  </div>
                  <div style={{
                    background: T.surface, border:`1px solid ${T.border}`,
                    borderRadius:12, padding:"10px 14px",
                    fontSize:12, color:T.sub, fontWeight:600,
                    wordBreak:"break-all",
                  }}>{String(f.value)}</div>
                </div>
              ) : null)}
              {task.description && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
                    <Info size={11} style={{ color:T.faint }}/>
                    <span style={{ fontSize:10, fontWeight:800, color:T.faint, textTransform:"uppercase", letterSpacing:"0.1em" }}>Descripcion</span>
                  </div>
                  <div style={{
                    background: T.surface, border:`1px solid ${T.border}`,
                    borderRadius:12, padding:"12px 14px",
                    fontSize:12, color:T.sub, lineHeight:1.6, fontWeight:500,
                  }}>{task.description}</div>
                </div>
              )}
              {task.error && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:7 }}>
                    <AlertTriangle size={11} style={{ color:T.red }}/>
                    <span style={{ fontSize:10, fontWeight:800, color:T.red, textTransform:"uppercase", letterSpacing:"0.1em" }}>Error</span>
                  </div>
                  <div style={{
                    background:"rgba(220,38,38,0.04)", border:"1px solid rgba(220,38,38,0.2)",
                    borderRadius:12, padding:"12px 14px",
                    fontSize:11, color:T.red, lineHeight:1.6, fontWeight:500,
                    fontFamily:"monospace", wordBreak:"break-all",
                  }}>{task.error}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function HeroStatus({ runtime }: any) {
  const status = runtime?.status || "offline";
  const sc = SC[status] || SC.offline;
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
      style={{
        background: T.surfaceAlt, border:`1px solid ${T.borderMd}`,
        borderRadius:22, padding:"28px 36px", marginBottom:32,
        boxShadow: elevation2, backdropFilter:"blur(20px)",
        display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24,
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        <HermesLogo size={52}/>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <span style={{
              fontSize:26, fontWeight:900, letterSpacing:"-0.04em",
              background:`linear-gradient(120deg, ${T.blue}, ${T.indigo}, ${T.teal})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>HERMES</span>
            <motion.div
              animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }}
              transition={{ repeat:Infinity, duration:2.5 }}
              style={{ width:9, height:9, borderRadius:"50%", background:sc.color, boxShadow:`0 0 10px ${sc.color}80`, marginLeft:4 }}
            />
            <span style={{
              fontSize:11, fontWeight:700, color:sc.color,
              background:sc.bg, border:`1px solid ${sc.border}`,
              padding:"3px 12px", borderRadius:20,
            }}>{sc.label}</span>
          </div>
          <div style={{ fontSize:12, color:T.muted, fontWeight:500 }}>Operational Runtime · AI-powered · PostgreSQL · Telegram</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
        {[
          { label:"Status", value: runtime?.uptime || "-" },
          { label:"Provider", value: runtime?.ai?.provider || "OpenRouter" },
          { label:"Model", value: runtime?.ai?.model || "-" },
          { label:"Backlog", value: runtime ? `${runtime.tasks.running + runtime.tasks.pending}` : "-" },
        ].map(item => (
          <div key={item.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{item.value}</div>
            <div style={{ fontSize:10, color:T.faint, textTransform:"uppercase", letterSpacing:"0.08em", marginTop:3, fontWeight:600 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SL({ children }: any) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <div style={{ width:3, height:16, borderRadius:2, background:`linear-gradient(${T.blue}, ${T.teal})` }}/>
      <span style={{ fontSize:10, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.12em" }}>{children}</span>
    </div>
  );
}

function AIChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role:string;text:string;ms?:number}[]>([
    { role:"hermes", text:"Sistema operacional activo. Podes preguntarme sobre el estado del runtime, tareas, fallos o prioridades." }
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    setMessages(m => [...m, { role:"user", text:q }]);
    setLoading(true);
    const t0 = Date.now();
    try {
      const res = await fetch(`${API}/ai/test`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ prompt: q })
      });
      const data = await res.json();
      const ms = Date.now() - t0;
      const text = data.success ? (data.content || "Sin respuesta") : "Error del provider";
      setMessages(m => [...m, { role:"hermes", text, ms }]);
    } catch {
      setMessages(m => [...m, { role:"hermes", text:"Backend no disponible." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.5 }}
      style={{
        background:T.surface, border:`1px solid ${T.border}`,
        borderRadius:20, overflow:"hidden", boxShadow:elevation2,
        display:"flex", flexDirection:"column", height:440,
      }}
    >
      <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10, background:T.surfaceAlt }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:T.green, boxShadow:`0 0 8px ${T.green}` }}/>
        <span style={{ fontSize:11, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.1em" }}>Hermes AI</span>
        <span style={{ fontSize:10, color:T.faint, marginLeft:"auto" }}>OpenRouter · DeepSeek v3</span>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px 22px", display:"flex", flexDirection:"column", gap:14 }}>
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}
              style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}
            >
              <div style={{
                maxWidth:"82%", padding:"11px 16px", borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: m.role==="user" ? `linear-gradient(135deg, ${T.blue}, ${T.indigo})` : T.surfaceAlt,
                border: m.role==="user" ? "none" : `1px solid ${T.border}`,
                boxShadow: elevation1,
              }}>
                <div style={{ fontSize:13, color: m.role==="user" ? "white" : T.sub, lineHeight:1.55, fontWeight:500 }}>{m.text}</div>
                {m.ms && <div style={{ fontSize:10, color: m.role==="user" ? "rgba(255,255,255,0.6)" : T.faint, marginTop:6 }}>{(m.ms/1000).toFixed(1)}s</div>}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ display:"flex", gap:6, padding:"8px 0" }}>
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ y:[0,-5,0] }} transition={{ repeat:Infinity, duration:0.8, delay:i*0.15 }}
                  style={{ width:7, height:7, borderRadius:"50%", background:T.blue }}/>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, background:T.surfaceAlt }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Pregunta algo sobre el runtime..."
          style={{
            flex:1, background:"white", border:`1px solid ${T.border}`,
            borderRadius:12, padding:"10px 16px", fontSize:13, color:T.text,
            outline:"none", fontFamily:"inherit", fontWeight:500,
            boxShadow:"inset 0 1px 3px rgba(0,0,0,0.04)"
          }}
        />
        <button onClick={send} disabled={loading || !input.trim()}
          style={{
            background:`linear-gradient(135deg, ${T.blue}, ${T.indigo})`,
            border:"none", borderRadius:12, padding:"10px 16px",
            cursor: loading || !input.trim() ? "default" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
            display:"flex", alignItems:"center", gap:6,
            color:"white", fontSize:12, fontWeight:700,
            boxShadow:`0 2px 12px ${T.blue}40`
          }}
        >
          <Send size={13}/> Enviar
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

  const toggleFilter = (f: string) => setTaskFilter(prev => prev === f ? null : f);

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, #f0f4ff 0%, #f5f7fa 40%, #eef5f3 100%)` }}>

      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-8%", left:"25%", width:700, height:500, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 65%)" }}/>
        <div style={{ position:"absolute", bottom:"5%", right:"10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 65%)" }}/>
      </div>

      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(245,247,250,0.85)", backdropFilter:"blur(24px)",
        borderBottom:`1px solid ${T.border}`,
        boxShadow:"0 1px 20px rgba(59,130,246,0.07)",
      }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <HermesLogo size={34}/>
            <div>
              <span style={{ fontSize:17, fontWeight:900, letterSpacing:"-0.03em", background:`linear-gradient(90deg, ${T.blue}, ${T.indigo})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>HERMES</span>
              <span style={{ fontSize:10, color:T.faint, letterSpacing:"0.14em", textTransform:"uppercase", fontWeight:600, marginLeft:10 }}>Operational Runtime</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:18 }}>
            {error && <span style={{ fontSize:12, color:T.red, fontWeight:600 }}>Backend offline</span>}
            {taskFilter && (
              <motion.span
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                style={{
                  fontSize:11, fontWeight:700, color:T.blue,
                  background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)",
                  padding:"4px 12px", borderRadius:20, cursor:"pointer",
                }}
                onClick={() => setTaskFilter(null)}
              >
                Filtro: {taskFilter} x
              </motion.span>
            )}
            <button onClick={refresh} style={{ display:"flex", alignItems:"center", gap:7, background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"7px 14px", cursor:"pointer", fontSize:12, color:T.muted, fontWeight:600, boxShadow:elevation1 }}>
              <RefreshCw size={11}/>{lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"36px 32px", position:"relative", zIndex:1 }}>

        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:500, gap:20 }}>
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.2, ease:"linear" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
            </motion.div>
            <span style={{ fontSize:13, color:T.faint, fontWeight:500 }}>Conectando...</span>
          </div>
        )}

        {runtime && (
          <>
            <HeroStatus runtime={runtime}/>

            <div style={{ marginBottom:36 }}>
              <SL>Runtime</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                <MetricCard
                  label="Estado" value={(SC[status]||SC.offline).label}
                  icon={Activity} color={(SC[status]||SC.offline).color}
                  delay={0} sub={runtime.uptime || "-"}
                />
                <MetricCard
                  label="Procesadas" value={runtime.tasks.total}
                  icon={CheckCircle} color={T.blue} delay={0.06}
                  onClick={() => toggleFilter("done")}
                  active={taskFilter === "done"}
                  sub={`${runtime.tasks.done} ok · ${runtime.tasks.failed} fail`}
                />
                <MetricCard
                  label="Backlog" value={runtime.tasks.running + runtime.tasks.pending}
                  icon={Clock} color={T.amber} delay={0.12}
                  onClick={() => toggleFilter("pending")}
                  active={taskFilter === "pending"}
                  sub={`${runtime.tasks.running} running · ${runtime.tasks.pending} pending`}
                />
                <MetricCard
                  label="Fallidas" value={runtime.tasks.failed}
                  icon={AlertTriangle} color={T.red} delay={0.18}
                  onClick={() => toggleFilter("failed")}
                  active={taskFilter === "failed"}
                  sub="ninguna atascada"
                />
              </div>
            </div>

            <div style={{ marginBottom:36 }}>
              <SL>AI Pipeline</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
                <MetricCard label="Requests IA" value={runtime.ai.requests} icon={Cpu} color={T.indigo} delay={0.22} sub="total"/>
                <MetricCard label="Pipeline avg" value={runtime.pipeline_avg_ms > 0 ? `${(runtime.pipeline_avg_ms/1000).toFixed(1)}s` : "-"} icon={Zap} color={T.teal} delay={0.28} sub="latencia total"/>
                <MetricCard label="Provider avg" value={runtime.provider_avg_ms > 0 ? `${(runtime.provider_avg_ms/1000).toFixed(1)}s` : "-"} icon={MessageSquare} color={T.amber} delay={0.34} sub="openrouter"/>
                <MetricCard label="DB Context avg" value={runtime.db_context_avg_ms > 0 ? `${runtime.db_context_avg_ms}ms` : "-"} icon={Database} color={T.teal} delay={0.4} sub="context builder"/>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:22 }}>

              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.45 }}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 26px", boxShadow:elevation2 }}>
                <SL>Tasks recientes{taskFilter ? ` - ${taskFilter}` : ""}</SL>
                {filteredTasks.length === 0
                  ? <div style={{ color:T.faint, fontSize:13, padding:"20px 0", textAlign:"center" }}>Sin tasks</div>
                  : filteredTasks.slice(0,10).map((t: any, i: number) => {
                    const tc = TC[t.status] || T.muted;
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.03 }}
                        whileHover={{ backgroundColor:"rgba(59,130,246,0.03)", cursor:"pointer" }}
                        onClick={() => setSelectedTaskId(t.id)}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 6px", borderBottom:`1px solid ${T.border}`, borderRadius:6, transition:"background 0.15s" }}
                      >
                        <span style={{ fontSize:9, fontWeight:800, color:tc, background:`${tc}14`, border:`1px solid ${tc}28`, padding:"2px 9px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{t.status}</span>
                        <span style={{ fontSize:12, color:T.sub, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:500 }}>{t.title}</span>
                        <span style={{ fontSize:10, color:T.faint }}>›</span>
                      </motion.div>
                    );
                  })
                }
              </motion.div>

              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.48, duration:0.45 }}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"24px 26px", boxShadow:elevation2 }}>
                <SL>Sistema</SL>
                {[
                  { label:"Runner", value: runtime.status === "online" ? "Alive" : "Dead", ok: runtime.status === "online" },
                  { label:"Provider", value: runtime.ai.provider || "OpenRouter", ok:true },
                  { label:"Model", value: runtime.ai.model || "-", ok:true },
                  { label:"Database", value:"Railway PostgreSQL", ok:true },
                  { label:"Telegram", value:"Polling activo", ok:true },
                  { label:"Uptime", value: runtime.uptime || "-", ok: runtime.status === "online" },
                ].map((r) => (
                  <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:12, color:T.muted, fontWeight:500 }}>{r.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background: r.ok ? T.green : T.red, boxShadow:`0 0 6px ${r.ok ? T.green : T.red}80` }}/>
                      <span style={{ fontSize:12, fontWeight:700, color:T.sub }}>{r.value}</span>
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