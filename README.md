# How Ray Works Under the Hood

A visual, technical breakdown of the Ray distributed execution engine based on the [OSDI '18 paper](https://arxiv.org/abs/1712.05889) by Moritz et al.

## Tasks vs Actors

In Ray's model:

- **Stateless tasks** — A regular `@ray.remote` function. It runs, returns a result, and that's it. No memory between calls. Each invocation is completely independent — the function gets its inputs, produces an output, and the worker forgets everything. That's why they're easy to recover (just re-run them) and easy to schedule anywhere (no state to keep track of).

- **Stateful actors** — A `@ray.remote` class. The instance lives on a specific worker and persists between method calls. If you call `actor.step.remote()` ten times, each call sees the state left behind by the previous one (like `self.count += 1`). That's why methods run *serially* on one actor — if they ran in parallel, the state would be inconsistent.

| | Tasks | Actors |
|---|---|---|
| State between calls | None | Yes (`self.*`) |
| Where it runs | Anywhere — scheduler optimizes for locality | Pinned to one node |
| Recovery | Cheap — just re-execute | Needs checkpointing + replay |
| Good for | Data processing, map/reduce, anything embarrassingly parallel | Training loops, parameter servers, simulators with internal state |

The key insight from the paper: most systems have *either* tasks (like Spark/CIEL) *or* actors (like Akka/Erlang). Ray has both in one runtime, sharing the same scheduler and object store.

## Running locally

1. Clone the repository
2. `npm install`
3. `npm run dev`

## Source

Paper: [arXiv:1712.05889](https://arxiv.org/abs/1712.05889) — UC Berkeley RISELab
