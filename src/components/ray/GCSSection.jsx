import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";
import GCSDiagram from "./GCSDiagram";

export default function GCSSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="gcs"
          number="06"
          title="The Global Control Store"
          subtitle="Redis with pub-sub and chain replication. All cluster state lives here — that's why every other component can be stateless, scalable, and restartable."
        />

        <div className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Object Table</span> — Where every object lives. Scheduler queries this for transfer costs. Sharded by ObjectID.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Task Table</span> — Full spec of every task: function, args, resources. This is the lineage store for recovery.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Function Table</span> — Serialized function bodies, pushed to all workers when you declare @ray.remote.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Event Logs</span> — System-wide event stream. Powers the timeline UI and debugging tools.
          </p>
        </div>

        <GCSDiagram />

        <MathBlock label="Why stateless components matter">
{`All state in GCS. Everything else is stateless. You get:

  Fault tolerance — component dies, restart it, read state from GCS, done.
  Scalability — scheduler and object store scale independently. GCS is sharded.
  Decoupled dispatch — scheduler picks placement, GCS handles data movement.
  Debugging — entire cluster state in one place. Timeline tool just reads event logs.`}
        </MathBlock>

        <MathBlock label="Why this beats a centralized scheduler">
{`Prior systems (Spark, CIEL, Dask) put object locations in the scheduler.
That makes the scheduler the bottleneck for every data transfer.

  Dask: max ~3K tasks/sec at 512 cores.
  Ray:  1M+ tasks/sec at 60 nodes.

Ray decouples the two: scheduler decides WHERE to run,
GCS handles WHERE objects are and moves them.`}
        </MathBlock>
      </div>
    </section>
  );
}