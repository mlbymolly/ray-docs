import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";
import TaskGraphDiagram from "./TaskGraphDiagram";

export default function LineageSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <SectionHeader
          id="lineage"
          number="07"
          title="Dynamic Task Graphs & Lineage"
          subtitle="The graph isn't known upfront — it grows at runtime as tasks submit more tasks. This is what lets Ray scale past 8000 cores: the driver isn't the bottleneck because workers do their own scheduling."
        />

        <TaskGraphDiagram />

        <MathBlock label="Graph structure">
{`G = (V_tasks ∪ V_objects, E_data ∪ E_control ∪ E_stateful)

  Data edges:     task produces or consumes an object
  Control edges:  task submits another task (nested remote calls)
  Stateful edges: actor method depends on the previous method's state

All three are tracked in GCS — lineage comes for free.`}
        </MathBlock>

        <div className="mb-8 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">The API</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">f.remote(args)</span> — Non-blocking. Returns ObjectID futures. You don't wait.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">ray.get(futures)</span> — Blocking resolve. Local objects are zero-copy. Remote ones get fetched.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">ray.wait(futures, k, timeout)</span> — Return the first k done. This is why Ray beats MPI — no straggler waits.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Class.remote(args)</span> — Spawn an actor. Returns a handle you can pass around.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">actor.method.remote(args)</span> — Queue a method call. Non-blocking. Methods run in order.
          </p>
        </div>

        <MathBlock label="Nested remote functions — the scalability unlock">
{`Workers can submit tasks. You don't have to go back to the driver.

Without this: driver bottleneck. Reference ES breaks at 2048 cores.
With this:    Ray ES scales to 8192 cores. 1.8M tasks/sec at 100 nodes.

The whole scalability story: distributed task submission.`}
        </MathBlock>
      </div>
    </section>
  );
}