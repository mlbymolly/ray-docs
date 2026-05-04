import React from "react";

export default function ArchDiagram() {
  return (
    <div className="my-8 p-5 rounded border border-border bg-card">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
        Architecture overview
      </p>

      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Application layer — your code lives here</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Driver", sub: "your script", cls: "border-primary/40 bg-primary/5 text-primary" },
              { label: "Worker ×N", sub: "stateless tasks", cls: "border-border bg-muted text-foreground" },
              { label: "Actor ×N", sub: "stateful methods", cls: "border-chart-2/40 bg-chart-2/5 text-chart-2" },
            ].map(n => (
              <div key={n.label} className={`px-3 py-2 rounded border text-center min-w-[100px] ${n.cls}`}>
                <p className="text-xs font-mono font-semibold">{n.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{n.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <div className="h-5 border-l border-dashed border-border" />
          <span className="text-[10px] font-mono text-muted-foreground">submits tasks / method calls via gRPC</span>
        </div>

        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">System layer — per node</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Local Scheduler", sub: "try here first, always", cls: "border-chart-3/40 bg-chart-3/5 text-chart-3" },
              { label: "Object Store", sub: "shared mem (Plasma)", cls: "border-chart-4/40 bg-chart-4/5 text-chart-4" },
            ].map(n => (
              <div key={n.label} className={`px-3 py-2 rounded border text-center min-w-[140px] ${n.cls}`}>
                <p className="text-xs font-mono font-semibold">{n.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{n.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pl-1">
          <div className="h-5 border-l border-dashed border-border" />
          <span className="text-[10px] font-mono text-muted-foreground">spills over only when needed</span>
        </div>

        <div>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">System layer — cluster-wide</p>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-2 rounded border border-destructive/30 bg-destructive/5 text-destructive text-center min-w-[140px]">
              <p className="text-xs font-mono font-semibold">Global Scheduler</p>
              <p className="text-[10px] opacity-60 mt-0.5">placement + spillover</p>
            </div>
            <div className="px-3 py-2 rounded border border-chart-1/40 bg-chart-1/5 text-chart-1 text-center min-w-[160px]">
              <p className="text-xs font-mono font-semibold">GCS (Redis-backed)</p>
              <p className="text-[10px] opacity-60 mt-0.5">all state lives here</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
          <p className="text-[11px] font-mono text-muted-foreground"><span className="text-primary font-semibold">Happy path:</span><br />Driver → Local Scheduler → Worker</p>
          <p className="text-[11px] font-mono text-muted-foreground"><span className="text-chart-2 font-semibold">Spillover:</span><br />Local can't handle it → Global → Remote node</p>
          <p className="text-[11px] font-mono text-muted-foreground"><span className="text-chart-3 font-semibold">Missing object:</span><br />Worker → Plasma → GCS lookup → fetch from remote</p>
        </div>
      </div>
    </div>
  );
}