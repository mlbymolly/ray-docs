import React from "react";

const ECOSYSTEM = [
  { lib: "Ray Data", role: "Parallel ETL and feature prep." },
  { lib: "Ray Train", role: "Distributed training — SGD, FSDP, gradient sync." },
  { lib: "Ray Tune", role: "Hyperparameter search and fine-tuning." },
  { lib: "Ray Serve", role: "Model serving with autoscaling." },
  { lib: "RLlib", role: "Reinforcement learning — the original reason Ray was built." },
];

export default function WhyRaySection() {
  return (
    <section id="why-ray" className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">§00</p>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-3">Why Ray Exists</h2>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed font-sans mb-10">
          ML pipelines need training, simulation, and serving all running together. Ray gives you one runtime for all of it instead of stitching five frameworks together.
        </p>

        <div className="mb-8 space-y-3">
          {ECOSYSTEM.map((e) => (
            <p key={e.lib} className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">{e.lib}</span> — {e.role}
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-4">They all share one scheduler and one object store. That's the whole point.</p>
        </div>
      </div>
    </section>
  );
}