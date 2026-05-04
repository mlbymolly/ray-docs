import React, { useState } from "react";

// Layout constants
const W = 960;
const H = 320;

// ─── GCS tables (center column) ───────────────────────────────────────────
const TABLES = [
  { id: "obj",  x: 390, y: 30,  label: "Object Table",    schema: "ObjectID → {node, size}", color: "hsl(37 91% 50%)" },
  { id: "task", x: 390, y: 110, label: "Task Table",      schema: "TaskID → TaskSpec",       color: "hsl(153 57% 40%)" },
  { id: "fn",   x: 390, y: 190, label: "Function Table",  schema: "FunctionID → fn body",    color: "hsl(261 51% 51%)" },
  { id: "evt",  x: 390, y: 270, label: "Event Logs",      schema: "timestamp → event",       color: "hsl(4 90% 58%)" },
];

const TW = 170, TH = 36;

// ─── Actors on left ────────────────────────────────────────────────────────
const LEFT = [
  { id: "sched",  x: 30,  y: 45,  label: "Global Scheduler", sub: "reads Object Table" },
  { id: "local",  x: 30,  y: 130, label: "Local Scheduler",  sub: "submits tasks" },
  { id: "worker", x: 30,  y: 215, label: "Worker",           sub: "fetches functions" },
  { id: "driver", x: 30,  y: 270, label: "Driver",           sub: "submits tasks" },
];

// ─── Actors on right ───────────────────────────────────────────────────────
const RIGHT = [
  { id: "objstore", x: 730, y: 45,  label: "Object Store",  sub: "subscribes to location" },
  { id: "objmgr",   x: 730, y: 130, label: "Object Manager",sub: "peer-to-peer transfer" },
  { id: "webui",    x: 730, y: 215, label: "Web UI",        sub: "reads event logs" },
  { id: "redis",    x: 730, y: 270, label: "Redis (GCS)",   sub: "chain replicated" },
];

const AW = 150, AH = 40;

// ─── Edges: [leftId | rightId, tableId, side, label] ─────────────────────
const EDGES = [
  { actor: "sched",    table: "obj",  side: "left",  label: "query locations",  dash: true },
  { actor: "local",    table: "task", side: "left",  label: "write task spec",  dash: false },
  { actor: "worker",   table: "fn",   side: "left",  label: "fetch fn body",    dash: true },
  { actor: "driver",   table: "task", side: "left",  label: "submit task",      dash: false },
  { actor: "objstore", table: "obj",  side: "right", label: "subscribe",        dash: true },
  { actor: "objmgr",   table: "obj",  side: "right", label: "update location",  dash: false },
  { actor: "webui",    table: "evt",  side: "right", label: "stream events",    dash: true },
  { actor: "redis",    table: "task", side: "right", label: "persist / replicate", dash: false },
];

const LEFT_MAP  = Object.fromEntries(LEFT.map(n => [n.id, n]));
const RIGHT_MAP = Object.fromEntries(RIGHT.map(n => [n.id, n]));
const TABLE_MAP = Object.fromEntries(TABLES.map(t => [t.id, t]));

function edgePoints(edge) {
  const t = TABLE_MAP[edge.table];
  const tcy = t.y + TH / 2;

  if (edge.side === "left") {
    const a = LEFT_MAP[edge.actor];
    const acy = a.y + AH / 2;
    const x1 = a.x + AW, y1 = acy;
    const x2 = t.x,      y2 = tcy;
    return { x1, y1, x2, y2, color: t.color };
  } else {
    const a = RIGHT_MAP[edge.actor];
    const acy = a.y + AH / 2;
    const x1 = t.x + TW, y1 = tcy;
    const x2 = a.x,      y2 = acy;
    return { x1, y1, x2, y2, color: t.color };
  }
}

function ActorBox({ node, hovered, onHover, side }) {
  const isHov = hovered === node.id;
  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      <rect width={AW} height={AH} rx={5}
        fill={isHov ? "hsl(214 84% 40% / 0.12)" : "hsl(0 0% 97%)"}
        stroke={isHov ? "hsl(214 84% 40%)" : "hsl(0 0% 82%)"}
        strokeWidth={isHov ? 1.5 : 1}
      />
      <text x={AW / 2} y={14} textAnchor="middle" fontSize={9} fontWeight="600"
        fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 18%)">
        {node.label}
      </text>
      <text x={AW / 2} y={27} textAnchor="middle" fontSize={8}
        fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 50%)">
        {node.sub}
      </text>
    </g>
  );
}

function TableBox({ t, hovered, onHover }) {
  const isHov = hovered === t.id;
  return (
    <g
      transform={`translate(${t.x},${t.y})`}
      onMouseEnter={() => onHover(t.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      <rect width={TW} height={TH} rx={5}
        fill={`${t.color.replace(")", " / 0.10)").replace("hsl(", "hsl(")}`}
        stroke={t.color}
        strokeWidth={isHov ? 2 : 1}
      />
      <text x={TW / 2} y={13} textAnchor="middle" fontSize={9} fontWeight="700"
        fontFamily="JetBrains Mono, monospace" fill={t.color.replace("/ 0.10)", "")}>
        {t.label}
      </text>
      <text x={TW / 2} y={27} textAnchor="middle" fontSize={7.5}
        fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 50%)">
        {t.schema}
      </text>
    </g>
  );
}

export default function GCSDiagram() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="my-8 p-5 rounded border border-border bg-card">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-5">
        Global Control Store — reads, writes & subscriptions
      </p>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 540, maxWidth: W }}>
          <defs>
            <marker id="gcs-arr" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="hsl(0 0% 60%)" opacity={0.9} />
            </marker>
            <marker id="gcs-arr-hl" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="hsl(214 84% 40%)" opacity={1} />
            </marker>
          </defs>

          {/* GCS center label */}
          <text x={390 + TW / 2} y={16} textAnchor="middle" fontSize={9}
            fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 40%)"
            fontWeight="600" letterSpacing="1">
            GCS (Redis)
          </text>

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const p = edgePoints(edge);
            const isActive = hovered === edge.actor || hovered === edge.table;
            const mx = (p.x1 + p.x2) / 2;
            const my = (p.y1 + p.y2) / 2;
            return (
              <g key={i}>
                <line
                  x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                  stroke={isActive ? "hsl(214 84% 40%)" : "hsl(0 0% 75%)"}
                  strokeWidth={isActive ? 1.8 : 1}
                  strokeDasharray={edge.dash ? "4 3" : undefined}
                  markerEnd={`url(#${isActive ? "gcs-arr-hl" : "gcs-arr"})`}
                  opacity={isActive ? 1 : 0.55}
                />
                {isActive && (
                  <text x={mx} y={my - 4} textAnchor="middle" fontSize={7.5}
                    fontFamily="JetBrains Mono, monospace"
                    fill="hsl(214 84% 40%)" fontWeight="600">
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Left actors */}
          {LEFT.map(n => (
            <ActorBox key={n.id} node={n} hovered={hovered} onHover={setHovered} side="left" />
          ))}

          {/* GCS tables */}
          {TABLES.map(t => (
            <TableBox key={t.id} t={t} hovered={hovered} onHover={t => setHovered(t)} />
          ))}

          {/* Right actors */}
          {RIGHT.map(n => (
            <ActorBox key={n.id} node={n} hovered={hovered} onHover={setHovered} side="right" />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
        {TABLES.map(t => (
          <div key={t.id} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded" style={{ background: `${t.color.replace("hsl(", "hsl(").replace(")", " / 0.15)")}`, border: `1.5px solid ${t.color}` }} />
            <span className="text-xs font-mono text-muted-foreground">{t.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="hsl(0 0% 55%)" strokeWidth={1.5} /></svg>
          <span className="text-xs font-mono text-muted-foreground">write</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="hsl(0 0% 55%)" strokeWidth={1.5} strokeDasharray="4 3" /></svg>
          <span className="text-xs font-mono text-muted-foreground">read / subscribe</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-mono text-muted-foreground/60">Hover a node or table to highlight its connections.</p>
    </div>
  );
}