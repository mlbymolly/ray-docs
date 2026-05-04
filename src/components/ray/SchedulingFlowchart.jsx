import React, { useState } from "react";

const STEPS = [
  {
    id: "submit",
    label: "Task submitted",
    sub: "ray.remote(f, *args)",
    desc: "Driver or actor submits τ = ⟨f, args, resources⟩ to the local Raylet via gRPC. Gets back a TaskID. Caller doesn't block.",
  },
  {
    id: "deps",
    label: "Are all dependencies ready?",
    sub: "∀ a ∈ args: Sealed(a)",
    desc: "Every argument ObjectID needs to be sealed (written and finalized) somewhere in the cluster. If not, the task parks in the wait queue and re-enters when its inputs are ready.",
  },
  {
    id: "feasible",
    label: "Can we run it here?",
    sub: "Available(n,r) ≥ res(r)",
    desc: "Does this node have enough free CPU, GPU, and memory right now? If not, hand it off to the global scheduler to find a node that can.",
  },
  {
    id: "locality",
    label: "Is enough data local?",
    sub: "|local args| / |args| ≥ θ",
    desc: "What fraction of the task's input bytes are already in the local object store? Above the threshold → run immediately. Below it → pull missing objects first, then run.",
  },
  {
    id: "execute",
    label: "Worker runs the task",
    sub: "f(x₁,…,xₙ) → (y₁,…,yₘ)",
    desc: "Worker gets the task. Reads inputs from Plasma via mmap — zero copy. Runs isolated in its own process.",
  },
  {
    id: "store",
    label: "Seal the outputs",
    sub: "write to Plasma, notify GCS",
    desc: "Results written to local Plasma and sealed. GCS Object Table updated. Any tasks that were waiting on these objects get unblocked.",
  },
];

const SPILLOVER = {
  id: "spillover",
  label: "Global spillover",
  sub: "can't run it locally",
  desc: "Local scheduler gives up on local placement. Queries GCS Resource Table, picks the best remote node: n* = argmin[Transfer cost + Queue wait + Fragmentation]. Task sent there.",
};

export default function SchedulingFlowchart() {
  const [active, setActive] = useState(STEPS[0]);

  return (
    <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-5 rounded border border-border bg-card">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-5">What happens to a task</p>
        <div className="flex flex-col items-start space-y-1">
          {STEPS.map((step, i) => (
            <div key={step.id} className="w-full">
              <button
                onClick={() => setActive(step)}
                className={`w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors ${
                  active.id === step.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="text-muted-foreground/50 mr-2 text-xs">{i + 1}.</span>
                {step.label}
                <span className="block text-[10px] text-muted-foreground/60 font-normal mt-0.5 ml-5">{step.sub}</span>
              </button>
              {(i === 1 || i === 2) && (
                <div className="ml-8 my-0.5">
                  <button
                    onClick={() => setActive(SPILLOVER)}
                    className={`text-[11px] font-mono px-2 py-1 rounded transition-colors ${
                      active.id === "spillover"
                        ? "bg-destructive/10 text-destructive font-semibold"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    }`}
                  >
                    {i === 1 ? "↳ NO → wait queue" : "↳ NO → global spillover"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded border border-border bg-card">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Details</p>
        <p className="text-base font-display font-semibold text-foreground mb-1">{active.label}</p>
        <p className="text-xs font-mono text-muted-foreground mb-4">{active.sub}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
      </div>
    </div>
  );
}