import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { Goal } from "../../types";
import { Button } from "../ui/Button";
import { ColorPicker } from "../ui/ColorPicker";
import { Modal } from "../ui/Modal";
import { useStore } from "../../store/useStore";

interface GoalFormProps {
  initial?: Goal;
  onClose: () => void;
}

export function GoalForm({ initial, onClose }: GoalFormProps) {
  const addGoal = useStore((s) => s.addGoal);
  const updateGoal = useStore((s) => s.updateGoal);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? "");
  const [color, setColor] = useState(initial?.color ?? "purple");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (initial) {
      updateGoal({ ...initial, title: title.trim(), description, targetDate: targetDate || undefined, color });
    } else {
      addGoal({ id: uuid(), title: title.trim(), description, targetDate: targetDate || undefined, color, steps: [] });
    }
    onClose();
  }

  return (
    <Modal title={initial ? "Edit Goal" : "New Goal"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn to code"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does success look like?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Target date <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{initial ? "Save" : "Create Goal"}</Button>
        </div>
      </form>
    </Modal>
  );
}
