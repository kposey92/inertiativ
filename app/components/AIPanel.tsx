"use client";

import { useRef, useState } from "react";
import type { RefObject } from "react";
import type { Tag, Task } from "../lib/types";

interface Suggestion {
  id: number;
  name: string;
  tag: Tag;
  time: string;
  ai: boolean;
  icon: string;
}

interface AIPanelProps {
  tasks: Task[];
  selectedDate: string;
  onAddTask: (s: { name: string; tag: Tag; time: string }) => void;
  aiInputRef: RefObject<HTMLInputElement | null>;
}

const STARTER_SUGGESTIONS: Suggestion[] = [
  { id: -1, name: "Review Q3 goals and update progress notes", tag: "goal", time: "Today", ai: false, icon: "→" },
  { id: -2, name: "Block 2 hrs deep work tomorrow morning", tag: "goal", time: "Today", ai: false, icon: "→" },
  { id: -3, name: "Follow up on pending email threads", tag: "goal", time: "Today", ai: false, icon: "→" },
];

export default function AIPanel({ tasks, selectedDate, onAddTask, aiInputRef }: AIPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(STARTER_SUGGESTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(-4);

  const handlePick = (s: Suggestion) => {
    onAddTask({ name: s.name, tag: s.tag, time: s.time });
    if (s.ai) {
      setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
    }
  };

  const handleSend = async () => {
    const inp = aiInputRef.current;
    if (!inp) return;
    const v = inp.value.trim();
    if (!v) return;
    inp.value = "";
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: v, tasks, date: selectedDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong. Try again.");
      }
      const newSugs: Suggestion[] = (data.suggestions as { name: string; tag: Tag; time: string }[]).map((sugg) => ({
        id: seq.current--,
        name: sugg.name,
        tag: sugg.tag,
        time: sugg.time,
        ai: true,
        icon: "✦",
      }));
      setSuggestions((prev) => [...newSugs, ...prev].slice(0, 4));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <span className="ai-panel-title">
          <div className="momentum-mini">
            <span style={{ opacity: 0.2, width: 5, height: 5, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
            <span style={{ opacity: 0.5, width: 5, height: 5, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
            <span style={{ opacity: 0.8, width: 5, height: 5, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
            <span style={{ opacity: 1, width: 5, height: 5, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
          </div>
          AI assistant
        </span>
        <span className="ai-label">Claude</span>
      </div>
      <div className="ai-suggestions">
        {suggestions.map((s) => (
          <div className="ai-sug" key={s.id} onClick={() => handlePick(s)}>
            <span className="ai-sug-icon">{s.icon}</span>
            {s.ai ? (
              <span>
                {s.name} — <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>tap to add</span>
              </span>
            ) : (
              s.name
            )}
          </div>
        ))}
        {loading && <div className="ai-sug">Thinking…</div>}
        {error && <div className="ai-error">{error}</div>}
      </div>
      <div className="ai-prompt">
        <input
          ref={aiInputRef}
          type="text"
          placeholder="Ask AI to plan your day…"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="ai-send" onClick={handleSend} disabled={loading}>↑</button>
      </div>
    </div>
  );
}
