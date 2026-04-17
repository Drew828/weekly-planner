import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { DayOfWeek, RecurringEvent } from "../../types";
import { DAY_NAMES } from "../../types";
import { Button } from "../ui/Button";
import { ColorPicker } from "../ui/ColorPicker";

interface RecurringEventFormProps {
  initial?: RecurringEvent;
  onSave: (e: RecurringEvent) => void;
  onCancel: () => void;
}

const ALL_DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

export function RecurringEventForm({ initial, onSave, onCancel }: RecurringEventFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "08:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "09:00");
  const [days, setDays] = useState<DayOfWeek[]>(initial?.daysOfWeek ?? []);
  const [color, setColor] = useState(initial?.color ?? "blue");

  function toggleDay(d: DayOfWeek) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: initial?.id ?? uuid(),
      title: title.trim(),
      startTime,
      endTime,
      daysOfWeek: days,
      color,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. School, Tennis Practice"
          required
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
          <input
            type="time"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
          <input
            type="time"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Days <span className="text-slate-400 font-normal">(empty = every day)</span>
        </label>
        <div className="flex gap-1 flex-wrap">
          {ALL_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                days.includes(d)
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {DAY_NAMES[d]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
