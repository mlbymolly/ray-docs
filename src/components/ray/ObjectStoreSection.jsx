import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";

export default function ObjectStoreSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="object-store"
          number="03"
          title="The Object Store"
          subtitle="Shared memory per node, Apache Arrow format, everything immutable. Tasks on the same machine read each other's data at memory speed — no copies, no serialization. Cross-node transfers happen once and get cached."
        />

        <div className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Shared memory</span> — Co-located tasks share objects via mmap. Zero-copy reads.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Immutability</span> — Once written, objects don't change. No consistency protocol needed.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Replicate before execute</span> — Missing inputs get copied to the local node first. The task itself never does remote I/O.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">LRU eviction</span> — Memory full? Evict to disk. Lineage means you can always reconstruct.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Apache Arrow</span> — Columnar format. Zero-copy for numpy arrays, tensors, DataFrames.
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">What happens when a task runs</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">0</span> — Function declared with @ray.remote, serialized to all workers via GCS.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">1–2</span> — Driver submits task to local scheduler. If it can't handle it, forwards to global.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">3–4</span> — Global scheduler checks where inputs live. Picks the node that already has most of them.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">5–7</span> — Missing inputs copied from other nodes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">8–9</span> — Worker reads inputs from shared memory. Zero-copy. Runs the function.
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Throughput (m4.4xlarge)</p>
          <p className="text-sm text-muted-foreground">Large objects (&gt;0.5MB): &gt;15 GB/s write, 8 threads. Small objects: ~18K IOPS, serialization-bound.</p>
        </div>

        <MathBlock label="Why locality-aware scheduling matters">
{`1000 tasks, random dependencies, 2 nodes.

  With locality: latency is flat regardless of object size.
  Without:       latency grows 100–1000× at 100MB inputs.

  Takeaway: for large data, use Tasks not Actors.
  Tasks get placed near their data. Actors don't.`}
        </MathBlock>
      </div>
    </section>
  );
}