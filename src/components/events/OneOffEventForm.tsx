import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { OneOffEvent } from "../../types";
import { Button } from "../ui/Button";
import { ColorPicker } from "../ui/ColorPicker";

interface OneOffEventFormProps {
  initial?: OneOffEvent;
  defaultDate?: string;
  onSave: (e: OneOffEvent) => void;
  onCancel: () => void;
}

export function OneOffEventForm({ initial, defaultDate, onSave, onCancel }: OneOffEventFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "10:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "11:00");
  const [color, setColor] = useState(initial?.color ?? "teal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({
      id: initial?.id ?? uuid(),
      date,
      title: title.trim(),
      startTime,
      endTime,
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
          placeholder="e.g. Doctor appointment"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
