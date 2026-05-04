import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";

export default function FaultToleranceSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="fault-tolerance"
          number="04"
          title="Fault Tolerance"
          subtitle="Kill a node mid-run and Ray re-executes the lost tasks from lineage. You write zero recovery code. This also means you can use spot instances — 4× cheaper."
        />

        <div className="mb-8 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Task recovery</span> — GCS has the full spec of every task. Node dies? Re-execute from lineage. The driver never knows. Throughput stays flat through failures.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Actor recovery</span> — Restore from the last checkpoint, replay subsequent method calls. With checkpointing: ~500 replays. Without: ~10,000.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">GCS replication</span> — Chain replication per shard. Writes propagate head → tail before ack. Max client-visible latency during failover: under 30ms.
          </p>
        </div>

        <MathBlock label="Why fault tolerance matters for AI">
{`1. Simplicity — your code ignores failures. The system handles them.
2. Debuggability — deterministic replay from lineage. Reproduce bugs exactly.
3. Cost — spot instances are 4× cheaper. Ray PPO vs MPI PPO: 18× cost reduction.`}
        </MathBlock>
      </div>
    </section>
  );
}