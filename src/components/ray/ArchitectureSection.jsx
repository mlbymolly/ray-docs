import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";
import ArchDiagram from "./ArchDiagram";

const COMPONENTS = [
  {
    name: "Driver",
    desc: "Your script. Kicks off tasks and actor calls. Calls ray.get() when it needs a result back.",
  },
  {
    name: "Worker",
    desc: "Stateless process that runs whatever function the scheduler assigns it. No memory between tasks.",
  },
  {
    name: "Actor",
    desc: "Stateful. Created with Class.remote(). Methods run one at a time so state stays consistent.",
  },
  {
    name: "GCS",
    desc: "Redis-backed store that holds all system state — object table, task table, function table. Everything else is stateless because of this.",
  },
];

export default function ArchitectureSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="architecture"
          number="01"
          title="The Architecture"
          subtitle="Two layers: your code (Driver, Workers, Actors) and the system stuff underneath (GCS, scheduler, object store). The key rule — no system component holds state. It all lives in the GCS, so everything else can scale or restart freely."
        />

        <div className="mb-8 space-y-3">
          {COMPONENTS.map((c) => (
            <p key={c.name} className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">{c.name}</span> — {c.desc}
            </p>
          ))}
        </div>

        <ArchDiagram />

        <MathBlock label="The task graph">
{`Three types of edges. All tracked in GCS for lineage.

  Data:     D → T   (object D is input to task T)
            T → D   (task T produces object D)

  Control:  T₁ → T₂  (T₁ submits T₂ — nested remote calls)
            This is what lets workers submit tasks without going back to the driver.

  Stateful: Mᵢ → Mⱼ  (actor method Mⱼ runs after Mᵢ on the same actor)
            Embeds actors into the same lineage graph as stateless tasks.

The API:
  f.remote(args)                 → non-blocking, returns ObjectID futures
  ray.get(futures)               → blocking resolve
  ray.wait(futures, k, timeout)  → return first k ready, or after timeout
  Class.remote(args)             → create actor
  actor.method.remote(args)      → invoke actor method, returns futures`}
        </MathBlock>

        <MathBlock label="Tasks vs Actors — when to use which">
{`Tasks (stateless):
  ✓ Placed anywhere — scheduler can optimize for locality
  ✓ Recovery is cheap — just re-execute from lineage
  ✗ Expensive if you're doing lots of small state updates (serialization cost)

Actors (stateful):
  ✓ Cheap state updates — state is just in-process memory
  ✓ Good for GPU loops — amortize setup cost over many method calls
  ✓ Can wrap any third-party simulator (MuJoCo, Gym, etc.)
  ✗ Pinned to one node — no locality optimization
  ✗ Need checkpointing for fault tolerance

The big insight: Ray has both in one system. CIEL and Akka each have only one.`}
        </MathBlock>

      </div>
    </section>
  );
}