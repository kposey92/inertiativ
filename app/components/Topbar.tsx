interface TopbarProps {
  viewTitle: string;
  viewDate: string;
  onAddClick: () => void;
}

export default function Topbar({ viewTitle, viewDate, onAddClick }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{viewTitle}</span>
        <span className="topbar-date">{viewDate}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={onAddClick}>+ Add task</button>
      </div>
    </div>
  );
}
