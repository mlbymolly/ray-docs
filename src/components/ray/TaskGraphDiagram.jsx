import React, { useState } from "react";

const NODES = {
  driver:  { x: 30,  y: 108, label: "Driver",       sub: "your script",   kind: "driver" },
  load:    { x: 190, y: 108, label: "load_data",    sub: "task",          kind: "task" },
  raw:     { x: 350, y: 108, label: "raw_data",     sub: "ObjectID",      kind: "obj" },
  map1:    { x: 510, y: 30,  label: "map_shard_1",  sub: "task",          kind: "task" },
  map2:    { x: 510, y: 108, label: "map_shard_2",  sub: "task",          kind: "task" },
  map3:    { x: 510, y: 186, label: "map_shard_3",  sub: "task",          kind: "task" },
  out1:    { x: 670, y: 30,  label: "result_1",     sub: "ObjectID",      kind: "obj" },
  out2:    { x: 670, y: 108, label: "result_2",     sub: "ObjectID",      kind: "obj" },
  out3:    { x: 670, y: 186, label: "result_3",     sub: "ObjectID",      kind: "obj" },
  reduce:  { x: 810, y: 108, label: "reduce",       sub: "task",          kind: "task" },
  final:   { x: 960, y: 108, label: "final_result", sub: "ObjectID",      kind: "obj" },
};

const EDGES = [
  { from: "driver", to: "load",   kind: "control" },
  { from: "load",   to: "raw",    kind: "data" },
  { from: "raw",    to: "map1",   kind: "data" },
  { from: "raw",    to: "map2",   kind: "data" },
  { from: "raw",    to: "map3",   kind: "data" },
  { from: "driver", to: "map1",   kind: "control" },
  { from: "driver", to: "map2",   kind: "control" },
  { from: "driver", to: "map3",   kind: "control" },
  { from: "map1",   to: "out1",   kind: "data" },
  { from: "map2",   to: "out2",   kind: "data" },
  { from: "map3",   to: "out3",   kind: "data" },
  { from: "out1",   to: "reduce", kind: "data" },
  { from: "out2",   to: "reduce", kind: "data" },
  { from: "out3",   to: "reduce", kind: "data" },
  { from: "reduce", to: "final",  kind: "data" },
];

const KIND_STYLE = {
  driver: { fill: "hsl(214 84% 40% / 0.12)", stroke: "hsl(214 84% 40%)", text: "hsl(214 84% 32%)" },
  task:   { fill: "hsl(153 57% 40% / 0.10)", stroke: "hsl(153 57% 40%)", text: "hsl(153 57% 28%)" },
  obj:    { fill: "hsl(37 91% 50% / 0.10)",  stroke: "hsl(37 91% 50%)",  text: "hsl(37 60% 30%)" },
};

const EDGE_STYLE = {
  control: { stroke: "hsl(214 84% 40%)", dash: "5 3" },
  data:    { stroke: "hsl(153 57% 40%)", dash: "none" },
};

const NODE_W = 110;
const NODE_H = 34;

function cx(key) { return NODES[key].x + NODE_W / 2; }
function cy(key) { return NODES[key].y + NODE_H / 2; }

function Arrow({ from, to, kind }) {
  const x1 = cx(from), y1 = cy(from);
  const x2 = cx(to),   y2 = cy(to);
  const st = EDGE_STYLE[kind];
  // shorten endpoints so arrow doesn't overlap boxes
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const pad = 6;
  const sx = x1 + ux * (NODE_W / 2 + 2);
  const sy = y1 + uy * (NODE_H / 2 + 2);
  const ex = x2 - ux * (NODE_W / 2 + pad);
  const ey = y2 - uy * (NODE_H / 2 + pad);
  const markId = `arr-${kind}`;
  return (
    <line
      x1={sx} y1={sy} x2={ex} y2={ey}
      stroke={st.stroke}
      strokeWidth={1.5}
      strokeDasharray={st.dash === "none" ? undefined : st.dash}
      markerEnd={`url(#${markId})`}
      opacity={0.8}
    />
  );
}

function NodeBox({ id, hovered, onHover }) {
  const n = NODES[id];
  const st = KIND_STYLE[n.kind];
  const isHov = hovered === id;
  return (
    <g
      transform={`translate(${n.x},${n.y})`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "default" }}
    >
      <rect
        width={NODE_W} height={NODE_H} rx={5}
        fill={st.fill}
        stroke={isHov ? st.text : st.stroke}
        strokeWidth={isHov ? 2 : 1}
      />
      <text x={NODE_W / 2} y={13} textAnchor="middle" fontSize={9} fontWeight="600"
        fontFamily="JetBrains Mono, monospace" fill={st.text}>
        {n.label}
      </text>
      <text x={NODE_W / 2} y={26} textAnchor="middle" fontSize={8}
        fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 50%)">
        {n.sub}
      </text>
    </g>
  );
}

const LEGEND = [
  { kind: "driver", label: "Driver" },
  { kind: "task",   label: "Stateless Task" },
  { kind: "obj",    label: "Object (future)" },
];

const EDGE_LEGEND = [
  { kind: "control", label: "Control edge (task submission)" },
  { kind: "data",    label: "Data edge (object dependency)" },
];

export default function TaskGraphDiagram() {
  const [hovered, setHovered] = useState(null);

  const SVG_W = 1090;
  const SVG_H = 250;

  return (
    <div className="my-8 p-5 rounded border border-border bg-card">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-5">
        Dynamic task graph — distributed map-reduce
      </p>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ minWidth: 560, maxWidth: SVG_W }}>
          <defs>
            {Object.entries(EDGE_STYLE).map(([k, s]) => (
              <marker key={k} id={`arr-${k}`} markerWidth="7" markerHeight="7"
                refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={s.stroke} opacity={0.85} />
              </marker>
            ))}
          </defs>

          {/* Edges first, under nodes */}
          {EDGES.map((e, i) => (
            <Arrow key={i} from={e.from} to={e.to} kind={e.kind} />
          ))}

          {/* Nodes */}
          {Object.keys(NODES).map(id => (
            <NodeBox key={id} id={id} hovered={hovered} onHover={setHovered} />
          ))}

          {/* Tooltip-style label for hovered node */}
          {hovered && (() => {
            const n = NODES[hovered];
            const edges = EDGES.filter(e => e.from === hovered || e.to === hovered);
            return (
              <g transform={`translate(${n.x + NODE_W / 2},${n.y + NODE_H + 6})`}>
                <rect x={-60} y={0} width={120} height={16} rx={3}
                  fill="hsl(0 0% 10%)" opacity={0.85} />
                <text x={0} y={11} textAnchor="middle" fontSize={8}
                  fontFamily="JetBrains Mono, monospace" fill="hsl(0 0% 95%)">
                  {edges.length} edge{edges.length !== 1 ? "s" : ""} connected
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {LEGEND.map(({ kind, label }) => {
            const st = KIND_STYLE[kind];
            return (
              <div key={kind} className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded" style={{ background: st.fill, border: `1.5px solid ${st.stroke}` }} />
                <span className="text-xs font-mono text-muted-foreground">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full border-t border-border mt-1 pt-2 flex flex-wrap gap-x-6 gap-y-1.5">
          {EDGE_LEGEND.map(({ kind, label }) => {
            const st = EDGE_STYLE[kind];
            return (
              <div key={kind} className="flex items-center gap-1.5">
                <svg width="24" height="8">
                  <line x1="0" y1="4" x2="24" y2="4"
                    stroke={st.stroke} strokeWidth={1.5}
                    strokeDasharray={st.dash === "none" ? undefined : st.dash} />
                </svg>
                <span className="text-xs font-mono text-muted-foreground">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}