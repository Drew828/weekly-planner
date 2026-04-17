import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { Goal } from "../../types";
import { getColorClasses } from "../../types";
import { useStore } from "../../store/useStore";
import { Button } from "../ui/Button";
import { GoalForm } from "./GoalForm";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const deleteGoal = useStore((s) => s.deleteGoal);
  const addStep = useStore((s) => s.addStep);
  const deleteStep = useStore((s) => s.deleteStep);
  const toggleStep = useStore((s) => s.toggleStep);

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepMins, setNewStepMins] = useState("30");

  const colors = getColorClasses(goal.color);
  const completed = goal.steps.filter((s) => s.completed).length;
  const total = goal.steps.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  function addNewStep(e: React.FormEvent) {
    e.preventDefault();
    if (!newStepTitle.trim()) return;
    addStep({
      id: uuid(),
      goalId: goal.id,
      title: newStepTitle.trim(),
      estimatedMinutes: parseInt(newStepMins) || 30,
      completed: false,
    });
    setNewStepTitle("");
    setNewStepMins("30");
  }

  return (
    <>
      {editing && <GoalForm initial={goal} onClose={() => setEditing(false)} />}
      <div className={`rounded-2xl border ${colors.border} ${colors.light} overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`w-3 h-3 rounded-full ${colors.bg} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${colors.text}`}>{goal.title}</p>
            {goal.targetDate && (
              <p className="text-xs text-slate-400">Due {goal.targetDate}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">{completed}/{total}</span>
            <button onClick={() => setExpanded((e) => !e)} className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer">
              {expanded ? "▲" : "▼"}
            </button>
            <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer text-sm">✏️</button>
            <button onClick={() => deleteGoal(goal.id)} className="text-slate-400 hover:text-red-500 px-1 cursor-pointer text-sm">🗑️</button>
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="px-4 pb-2">
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div className={`h-full ${colors.bg} transition-all`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Expanded steps */}
        {expanded && (
          <div className="bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-2">
            {goal.description && (
              <p className="text-sm text-slate-500 mb-1">{goal.description}</p>
            )}
            {goal.steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2 group">
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStep(goal.id, step.id, new Date().toISOString().slice(0, 10))}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
                />
                <span className={`flex-1 text-sm ${step.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
                  {step.title}
                </span>
                <span className="text-xs text-slate-400">{step.estimatedMinutes}m</span>
                <button
                  onClick={() => deleteStep(goal.id, step.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add step form */}
            <form onSubmit={addNewStep} className="flex gap-2 mt-1">
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Add a step..."
              />
              <input
                type="number"
                min={5}
                max={480}
                className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                value={newStepMins}
                onChange={(e) => setNewStepMins(e.target.value)}
                title="Minutes"
              />
              <Button type="submit" size="sm">+ Add</Button>
            </form>
            <p className="text-xs text-slate-400">Time in minutes</p>
          </div>
        )}
      </div>
    </>
  );
}
