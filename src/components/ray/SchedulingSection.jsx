import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";
import SchedulingFlowchart from "./SchedulingFlowchart";
import ArchDiagram from "./ArchDiagram";

export default function SchedulingSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="scheduling"
          number="02"
          title="How Scheduling Works"
          subtitle="Two levels. Try locally first — if the node can't handle it, hand it off to the global scheduler. Local dispatch is sub-millisecond. The global scheduler is a fallback, not the default path."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ArchDiagram />
          <MathBlock label="The scheduling decision">
{`Schedule(τ, nᵢ) = 
  ⎧ LOCAL(nᵢ, τ)    if feasible here AND data is local
  ⎨ SPILLOVER(τ)    if not feasible OR queue is too long
  ⎩ QUEUE(nᵢ, τ)    if feasible but dependencies aren't ready yet

Feasible(n, τ)   ≡ enough CPU/GPU/mem to run τ right now
DataLocal(n, τ)  ≡ enough of τ's inputs already on this node (≥ θ fraction)
LoadExceeded(n)  ≡ queue depth > α × worker count`}
          </MathBlock>
        </div>

        <div className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Local scheduler</span> — Each node runs its own. Prioritizes by data locality, urgency, and resource cost. Dispatch under 100μs. Workers steal from each other when idle.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Global spillover</span> — Can't run locally? The global scheduler picks the best remote node by minimizing transfer cost + queue wait + resource waste.
          </p>
        </div>

        <MathBlock label="Where time goes">
{`T(τ, n) = T_schedule + T_transfer + T_queue + T_execute + T_store

  T_schedule = O(1)                              — local dispatch is cheap
  T_transfer = Σ size(aᵢ)/BW(n) · 𝟙[aᵢ ∉ Oₙ]  — only pay for missing objects
  T_queue    = Q(n) · E[T_execute]               — wait behind other tasks
  T_execute  = f(args)                           — your actual computation
  T_store    = Σ size(yⱼ) / BW_mem              — write outputs to Plasma

Optimal placement is NP-hard. Ray uses heuristics.`}
        </MathBlock>

        <SchedulingFlowchart />

        <MathBlock label="Work-stealing (Cilk-style)">
{`T₁ = total work   T∞ = critical path length   P = workers

  E[Tₚ] ≤ T₁/P + O(T∞)

  Steal probability in k attempts: 1 - (1 - 1/P)ᵏ
  Steal cost: O(log P) — victim picked at random`}
        </MathBlock>
      </div>
    </section>
  );
}