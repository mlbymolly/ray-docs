import React from "react";
import SectionHeader from "./SectionHeader";
import MathBlock from "./MathBlock";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, LineChart, Line, Legend } from "recharts";

const throughputData = [
  { nodes: 10, throughput: 200000 },
  { nodes: 20, throughput: 380000 },
  { nodes: 30, throughput: 570000 },
  { nodes: 40, throughput: 740000 },
  { nodes: 50, throughput: 930000 },
  { nodes: 60, throughput: 1000000 },
  { nodes: 100, throughput: 1800000 },
];

const allreduceData = [
  { size: "10MB", ray: 30, mpi: 45 },
  { size: "100MB", ray: 200, mpi: 280 },
  { size: "1GB", ray: 1200, mpi: 2400 },
];

const trainingData = [
  { gpus: 4, ray: 870, horovod: 880, distTF: 950 },
  { gpus: 8, ray: 1650, horovod: 1700, distTF: 1820 },
  { gpus: 16, ray: 3100, horovod: 3200, distTF: 3500 },
  { gpus: 32, ray: 5800, horovod: 6000, distTF: 6400 },
  { gpus: 64, ray: 6200, horovod: 6500, distTF: 7000 },
];

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded p-3 text-xs font-mono shadow-sm">
      <p className="text-foreground mb-1 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

const axisStyle = { fontSize: 11, fontFamily: "JetBrains Mono, monospace", fill: "hsl(0 0% 45%)" };
const gridColor = "hsl(0 0% 90%)";

export default function PerformanceSection() {
  return (
    <section className="border-b border-border">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          id="performance"
          number="05"
          title="The Numbers"
          subtitle="All benchmarks from the OSDI paper on AWS. 1M+ tasks/sec at 60 nodes. Matches Horovod for training. 1.8× faster than MPI for RL simulation because async dispatch skips the straggler wait."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded border border-border bg-card">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Scalability</h3>
            <p className="text-xs text-muted-foreground mb-4">Empty-task throughput — 1M/sec at 60 nodes, near-linear.</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={throughputData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="nodes" tick={axisStyle} label={{ value: "Nodes", position: "insideBottom", offset: -2, fill: "hsl(0 0% 45%)", fontSize: 11 }} />
                  <YAxis tick={axisStyle} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip content={<TT />} />
                  <Area type="monotone" dataKey="throughput" fill="hsl(214 84% 40% / 0.1)" stroke="hsl(214 84% 40%)" strokeWidth={2} name="Tasks/sec" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded border border-border bg-card">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">Allreduce vs OpenMPI</h3>
            <p className="text-xs text-muted-foreground mb-4">Mean iteration time (ms), 16 nodes. Ray uses multithreaded transfers.</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allreduceData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="size" tick={axisStyle} />
                  <YAxis tick={axisStyle} label={{ value: "ms", angle: -90, position: "insideLeft", fill: "hsl(0 0% 45%)", fontSize: 11 }} />
                  <Tooltip content={<TT />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="ray" fill="hsl(214 84% 40%)" name="Ray" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="mpi" fill="hsl(261 51% 51%)" name="OpenMPI v1.10" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded border border-border bg-card lg:col-span-2">
            <h3 className="text-sm font-display font-semibold text-foreground mb-1">ResNet-101 Training</h3>
            <p className="text-xs text-muted-foreground mb-4">Images/sec on V100s. Ray matches Horovod, within 10% of Distributed TF.</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="gpus" tick={axisStyle} label={{ value: "GPUs", position: "insideBottom", offset: -2, fill: "hsl(0 0% 45%)", fontSize: 11 }} />
                  <YAxis tick={axisStyle} />
                  <Tooltip content={<TT />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="ray" stroke="hsl(214 84% 40%)" strokeWidth={2} name="Ray + TF" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="horovod" stroke="hsl(153 57% 40%)" strokeWidth={2} name="Horovod + TF" dot={{ r: 3 }} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="distTF" stroke="hsl(261 51% 51%)" strokeWidth={2} name="Distributed TF" dot={{ r: 3 }} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <MathBlock label="Simulation throughput — why async wins">
{`Pendulum-v0, 3n parallel runs on n cores:

  MPI (bulk-sync):  2.16M timesteps/sec at 256 CPUs
  Ray (async):      4.03M timesteps/sec at 256 CPUs  → 1.8× faster

MPI waits for the slowest sim each round. Ray collects results as they arrive.
RL simulation times are highly variable — async wins by skipping the straggler wait.`}
        </MathBlock>

        <MathBlock label="ES and PPO highlights">
{`ES (Humanoid-v1):
  Reference breaks at 2048 cores (driver bottleneck).
  Ray scales to 8192 cores. Solves in 3.7 min vs 10 min. Changed 7 lines of code.

PPO:
  Ray beats MPI PPO at every config. 18× cheaper overall
  (4.5× from CPU-only nodes + 4× from spot instances).`}
        </MathBlock>
      </div>
    </section>
  );
}