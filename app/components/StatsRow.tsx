import type { Task } from "../lib/types";

interface StatsRowProps {
  tasks: Task[];
}

export default function StatsRow({ tasks }: StatsRowProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const left = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const steps = Math.min(total, 6);

  return (
    <div className="stats">
      <div className="stat-card featured">
        <div className="stat-label">Scheduled</div>
        <div className="stat-val">{total}</div>
        <div className="momentum-bar">
          {Array.from({ length: 6 }, (_, i) => {
            const sz = 5 + i * 1.2;
            const op = i < steps ? Number((0.15 + (i / 5) * 0.85).toFixed(2)) : 0.08;
            return (
              <span
                key={i}
                style={{
                  width: sz,
                  height: sz,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  opacity: op,
                  display: "inline-block",
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Completed</div>
        <div className="stat-val">{done}</div>
        <div className="stat-sub">{pct}% done</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Remaining</div>
        <div className="stat-val">{left}</div>
        <div className="stat-sub">to go</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Streak</div>
        <div className="stat-val">3</div>
        <div className="stat-sub">days active</div>
      </div>
    </div>
  );
}
