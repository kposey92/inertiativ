"use client";

import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatsRow from "./StatsRow";
import TaskPanel from "./TaskPanel";
import MiniCalendar from "./MiniCalendar";
import AIPanel from "./AIPanel";
import type { Tag, Task } from "../lib/types";
import { fromDateKey, toDateKey } from "../lib/date";

function createInitialTasks(dateKey: string): Task[] {
  return [
    { id: 1, name: "Review product roadmap", tag: "work", time: "9:00 AM", date: dateKey, done: false },
    { id: 2, name: "Send weekly team update", tag: "work", time: "11:00 AM", date: dateKey, done: true },
    { id: 3, name: "Morning run — 30 min", tag: "personal", time: "7:00 AM", date: dateKey, done: true },
    { id: 4, name: "Finalize investor deck", tag: "urgent", time: "2:00 PM", date: dateKey, done: false },
    { id: 5, name: "Read 20 pages", tag: "personal", time: "Evening", date: dateKey, done: false },
  ];
}

export default function PlannerApp() {
  const [now] = useState(() => new Date());
  const todayKey = toDateKey(now);

  const [tasks, setTasks] = useState<Task[]>(() => createInitialTasks(todayKey));
  const [filter, setFilter] = useState("all");
  const [activePill, setActivePill] = useState<string | null>("all");
  const [activeNav, setActiveNav] = useState("Today");
  const [viewTitle, setViewTitle] = useState("Today");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [cal, setCal] = useState(() => ({ y: now.getFullYear(), m: now.getMonth() }));

  const nextId = useRef(6);
  const addInputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);

  const viewDate = fromDateKey(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const tasksForDate = tasks.filter((t) => t.date === selectedDate);
  const taskDates = new Set(tasks.map((t) => t.date));

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (value: string) => {
    const tm = value.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);
    const time = tm ? tm[0].toUpperCase() : "Today";
    const lo = value.toLowerCase();
    const tag: Tag =
      lo.includes("meet") || lo.includes("report") || lo.includes("review") || lo.includes("email") || lo.includes("send")
        ? "work"
        : "personal";
    const name = value.replace(/\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)/i, "").trim() || value;
    const id = nextId.current++;
    setTasks((prev) => [{ id, name, tag, time, date: selectedDate, done: false }, ...prev]);
  };

  const addSuggestedTask = (s: { name: string; tag: Tag; time: string }) => {
    const id = nextId.current++;
    setTasks((prev) => [{ id, name: s.name, tag: s.tag, time: s.time, date: selectedDate, done: false }, ...prev]);
  };

  const handleSetFilter = (f: string) => {
    setFilter(f);
    setActivePill(f);
  };

  const handleFilterTag = (tag: Tag) => {
    setActiveNav(tag);
    setFilter(tag);
    setActivePill(null);
  };

  const handleSetView = (v: string) => {
    setActiveNav(v);
    setViewTitle(v);
    setFilter("all");
    setActivePill("all");
    if (v === "Today") {
      setSelectedDate(todayKey);
      setCal({ y: now.getFullYear(), m: now.getMonth() });
    }
  };

  const shiftMonth = (delta: number) => {
    setCal((prev) => {
      let m = prev.m + delta;
      let y = prev.y;
      if (m < 0) { m = 11; y -= 1; }
      else if (m > 11) { m = 0; y += 1; }
      return { y, m };
    });
  };

  const focusAdd = () => addInputRef.current?.focus();
  const focusAI = () => aiInputRef.current?.focus();

  return (
    <div className="app">
      <Sidebar
        activeNav={activeNav}
        onSetView={handleSetView}
        onFilterTag={handleFilterTag}
        onFocusAI={focusAI}
      />
      <div className="main">
        <Topbar viewTitle={viewTitle} viewDate={viewDate} onAddClick={focusAdd} />
        <div className="content">
          <StatsRow tasks={tasksForDate} />
          <div className="two-col">
            <TaskPanel
              tasks={tasksForDate}
              filter={filter}
              activePill={activePill}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onAddTask={addTask}
              onSetFilter={handleSetFilter}
              addInputRef={addInputRef}
            />
            <div className="right-col">
              <MiniCalendar
                calY={cal.y}
                calM={cal.m}
                now={now}
                selectedDate={selectedDate}
                taskDates={taskDates}
                onShiftMonth={shiftMonth}
                onSelectDate={setSelectedDate}
              />
              <AIPanel
                tasks={tasksForDate}
                selectedDate={selectedDate}
                onAddTask={addSuggestedTask}
                aiInputRef={aiInputRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
