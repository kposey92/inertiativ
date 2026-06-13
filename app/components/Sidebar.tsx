import type { Tag } from "../lib/types";

interface SidebarProps {
  activeNav: string;
  onSetView: (view: string) => void;
  onFilterTag: (tag: Tag) => void;
  onFocusAI: () => void;
}

export default function Sidebar({ activeNav, onSetView, onFilterTag, onFocusAI }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <svg width="52" height="18" viewBox="0 0 70 18" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="9" r="7" fill="currentColor" opacity="0.11" />
            <circle cx="19" cy="9" r="7" fill="currentColor" opacity="0.23" />
            <circle cx="31" cy="9" r="7" fill="currentColor" opacity="0.40" />
            <circle cx="43" cy="9" r="7" fill="currentColor" opacity="0.62" />
            <circle cx="55" cy="9" r="7" fill="currentColor" opacity="0.82" />
            <circle cx="67" cy="9" r="7" fill="currentColor" opacity="1" />
          </svg>
        </div>
        <div>
          <div className="brand-text"><span>Inertia</span><strong>TIV</strong></div>
          <div className="brand-tagline">Digital planner</div>
        </div>
      </div>

      <div className="nav-section-label">Workspace</div>
      <div
        className={`nav-item${activeNav === "Today" ? " active" : ""}`}
        onClick={() => onSetView("Today")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
        </svg>
        Today
      </div>
      <div
        className={`nav-item${activeNav === "Upcoming" ? " active" : ""}`}
        onClick={() => onSetView("Upcoming")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        Upcoming
      </div>
      <div
        className={`nav-item${activeNav === "Goals" ? " active" : ""}`}
        onClick={() => onSetView("Goals")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        Goals
      </div>

      <div className="nav-section-label">Categories</div>
      <div
        className={`nav-item${activeNav === "work" ? " active" : ""}`}
        onClick={() => onFilterTag("work")}
      >
        <div className="nav-dot" style={{ background: "var(--purple)" }} /> Work
      </div>
      <div
        className={`nav-item${activeNav === "personal" ? " active" : ""}`}
        onClick={() => onFilterTag("personal")}
      >
        <div className="nav-dot" style={{ background: "var(--teal)" }} /> Personal
      </div>
      <div
        className={`nav-item${activeNav === "urgent" ? " active" : ""}`}
        onClick={() => onFilterTag("urgent")}
      >
        <div className="nav-dot" style={{ background: "var(--red)" }} /> Urgent
      </div>

      <div className="sidebar-footer">
        <div className="ai-chip" onClick={onFocusAI}>
          <div className="momentum-mini">
            <span style={{ opacity: 0.2 }} />
            <span style={{ opacity: 0.4 }} />
            <span style={{ opacity: 0.65 }} />
            <span style={{ opacity: 1 }} />
          </div>
          AI assistant — Claude
        </div>
      </div>
    </nav>
  );
}
