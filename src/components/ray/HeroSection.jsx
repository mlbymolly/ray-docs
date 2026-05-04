import React from "react";

export default function HeroSection() {
  return (
    <section id="hero" className="pt-24 pb-16 border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          Based on the Ray paper · OSDI '18
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-tight leading-tight mb-6">
          How Ray Works Under the Hood
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-sans mb-4">
          Ray lets you take ordinary Python functions and run them across a cluster. It was built at Berkeley for reinforcement learning — where you need training, simulation, and serving all happening at once — but it works for pretty much any parallel workload. Here's how the internals fit together.
        </p>
        <p className="text-sm text-muted-foreground font-sans">
          Paper: <a className="text-primary underline underline-offset-2" href="https://arxiv.org/abs/1712.05889" target="_blank" rel="noreferrer">arXiv:1712.05889</a>
        </p>
      </div>
    </section>
  );
}