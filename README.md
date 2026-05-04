# How Ray Works Under the Hood

A visual, technical breakdown of the Ray distributed execution engine based on the [OSDI '18 paper](https://arxiv.org/abs/1712.05889) by Moritz et al.

## Why Should You Care?

Modern ML doesn't fit on one machine. Training a large language model, running hyperparameter sweeps, or serving inference at scale all demand distributing work across many CPUs and GPUs — but distributed computing is historically painful. You end up duct-taping together separate systems for parallelism, state management, scheduling, and fault tolerance.

**Why distributed computation matters for ML:**

- **Models outgrew single machines** — LLM training, reinforcement learning simulations, and large-scale data preprocessing all require more compute than any one node can offer. If you can't distribute, you can't build.
- **Iteration speed is everything** — Distributed execution turns a 12-hour experiment into a 20-minute one. That's the difference between testing 3 ideas a week and 30.
- **Production serving is inherently parallel** — Inference at scale means handling thousands of concurrent requests, sharding models across GPUs, and batching intelligently. This is a distributed systems problem whether you frame it that way or not.
- **Resource efficiency** — Ray's dynamic resource allocation ensures you're using every GPU and CPU to capacity, not idling while waiting for the next job.
- **Simply a tool to be competitive** - every one has AI models and the question is who can train, serve, scale them effectively. and cost effectively 

**Why Ray in particular:**

- **One framework instead of five** — Before Ray, you'd use Spark for data, a custom MPI script for training, Kubernetes for orchestration, Celery for task queues, and something else for serving. Ray unifies tasks, actors, and object sharing in a single runtime.
- **Python-native, minimal boilerplate** — Distributing a function is as simple as adding `@ray.remote`. No protobufs, no container configs, no cluster manifest files to get started.
- **Built for ML-specific patterns** — Heterogeneous resources (GPUs + CPUs), fine-grained task graphs, stateful training loops, and millisecond-level scheduling latency. These are ML requirements that general-purpose systems handle poorly.
- **Battle-tested at scale** — Used in production by OpenAI, Spotify, Uber, Ant Group, and others for workloads spanning thousands of nodes.

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
