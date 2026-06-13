import { toDateKey } from "../lib/date";

interface MiniCalendarProps {
  calY: number;
  calM: number;
  now: Date;
  selectedDate: string;
  taskDates: Set<string>;
  onShiftMonth: (delta: number) => void;
  onSelectDate: (date: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MiniCalendar({ calY, calM, now, selectedDate, taskDates, onShiftMonth, onSelectDate }: MiniCalendarProps) {
  const fd = new Date(calY, calM, 1).getDay();
  const dim = new Date(calY, calM + 1, 0).getDate();
  const prev = new Date(calY, calM, 0).getDate();
  const rem = 42 - fd - dim;

  const cells: { key: string; label: number; className: string; onClick?: () => void }[] = [];

  for (let i = fd - 1; i >= 0; i--) {
    cells.push({ key: `prev-${i}`, label: prev - i, className: "cal-d faded" });
  }
  for (let d = 1; d <= dim; d++) {
    const dateKey = toDateKey(new Date(calY, calM, d));
    const isToday = d === now.getDate() && calM === now.getMonth() && calY === now.getFullYear();
    const isSelected = dateKey === selectedDate && !isToday;
    const hasDot = taskDates.has(dateKey) && !isToday;
    cells.push({
      key: `cur-${d}`,
      label: d,
      className: ["cal-d", isToday && "today", isSelected && "selected", hasDot && "has-dot"].filter(Boolean).join(" "),
      onClick: () => onSelectDate(dateKey),
    });
  }
  for (let d = 1; d <= rem; d++) {
    cells.push({ key: `next-${d}`, label: d, className: "cal-d faded" });
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Calendar</span>
      </div>
      <div className="cal-inner">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => onShiftMonth(-1)}>‹</button>
          <span className="cal-month-label">{MONTHS[calM]} {calY}</span>
          <button className="cal-nav-btn" onClick={() => onShiftMonth(1)}>›</button>
        </div>
        <div className="cal-head">
          <div className="cal-dn">S</div><div className="cal-dn">M</div><div className="cal-dn">T</div>
          <div className="cal-dn">W</div><div className="cal-dn">T</div><div className="cal-dn">F</div>
          <div className="cal-dn">S</div>
        </div>
        <div className="cal-days">
          {cells.map((c) => (
            <div className={c.className} key={c.key} onClick={c.onClick}>{c.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
