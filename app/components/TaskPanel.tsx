import type { RefObject } from "react";
import type { Task } from "../lib/types";

interface TaskPanelProps {
  tasks: Task[];
  filter: string;
  activePill: string | null;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAddTask: (value: string) => void;
  onSetFilter: (filter: string) => void;
  addInputRef: RefObject<HTMLInputElement | null>;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
  { key: "work", label: "Work" },
  { key: "personal", label: "Personal" },
  { key: "urgent", label: "Urgent" },
];

export default function TaskPanel({
  tasks,
  filter,
  activePill,
  onToggle,
  onDelete,
  onAddTask,
  onSetFilter,
  addInputRef,
}: TaskPanelProps) {
  let list = [...tasks];
  if (filter === "active") list = list.filter((t) => !t.done);
  else if (filter === "done") list = list.filter((t) => t.done);
  else if (["work", "personal", "urgent", "goal"].includes(filter)) {
    list = list.filter((t) => t.tag === filter);
  }

  const handleAdd = () => {
    const inp = addInputRef.current;
    if (!inp) return;
    const v = inp.value.trim();
    if (!v) return;
    onAddTask(v);
    inp.value = "";
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Tasks</span>
        <span className="count-badge">
          {list.length} task{list.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="add-row">
        <input
          ref={addInputRef}
          type="text"
          placeholder="Add a task… e.g. 'Review deck at 2pm'"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button className="btn btn-ink" onClick={handleAdd}>Add</button>
      </div>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pill${activePill === f.key ? " on" : ""}`}
            onClick={() => onSetFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="task-list">
        {list.length ? (
          list.map((t) => (
            <div className="task-row" key={t.id}>
              <div className={`check${t.done ? " done" : ""}`} onClick={() => onToggle(t.id)}>
                {t.done ? "✓" : ""}
              </div>
              <div className="task-body">
                <div className={`task-name${t.done ? " done" : ""}`}>{t.name}</div>
                <div className="task-meta">
                  <span className={`tag tag-${t.tag}`}>{t.tag}</span>
                  <span className="task-time">{t.time}</span>
                </div>
              </div>
              <button className="del-btn" onClick={() => onDelete(t.id)}>×</button>
            </div>
          ))
        ) : (
          <div className="empty">No tasks here — add one above</div>
        )}
      </div>
    </div>
  );
}
