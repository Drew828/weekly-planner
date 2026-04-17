import type { ScheduledSlot } from "../../types";
import { getColorClasses } from "../../types";
import { formatTimeDisplay, getTodayString, timeToMinutes } from "../../utils/time";
import { useStore } from "../../store/useStore";

interface TimelineSlotProps {
  slot: ScheduledSlot;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

function getCurrentMinutes() {
  return new Date().getHours() * 60 + new Date().getMinutes();
}

export function TimelineSlot({ slot, date, onEdit, onDelete }: TimelineSlotProps) {
  const toggleStep = useStore((s) => s.toggleStep);
  const rescheduleStep = useStore((s) => s.rescheduleStep);
  const colors = getColorClasses(slot.color);

  const timeLabel = `${formatTimeDisplay(slot.startTime)} – ${formatTimeDisplay(slot.endTime)}`;

  // A slot is "past" if it's today and its end time has already passed
  const isToday = date === getTodayString();
  const isPast = isToday && timeToMinutes(slot.endTime) < getCurrentMinutes();
  const isMissed = isPast && slot.kind === "goal-step" && !slot.completed;

  if (slot.kind === "goal-step") {
    return (
      <div
        className={`flex items-start gap-3 rounded-xl px-4 py-3 border transition-colors ${
          isPast || slot.completed
            ? "bg-slate-50 border-slate-200 opacity-60"
            : `${colors.light} ${colors.border}`
        }`}
      >
        <input
          type="checkbox"
          checked={slot.completed}
          onChange={() => toggleStep(slot.goalId!, slot.stepId!, date)}
          className="mt-0.5 w-4 h-4 rounded accent-indigo-600 cursor-pointer flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              slot.completed
                ? "line-through text-slate-400"
                : isPast
                ? "text-slate-400"
                : colors.text
            }`}
          >
            {slot.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{timeLabel}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isMissed && (
            <button
              onClick={() => rescheduleStep(slot.goalId!, slot.stepId!)}
              className="text-xs font-medium px-2 py-1 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors cursor-pointer"
            >
              Reschedule
            </button>
          )}
          {!isMissed && !slot.completed && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} text-white`}>
              Goal
            </span>
          )}
          {slot.completed && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
              Done
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl px-4 py-3 border transition-colors ${
        isPast
          ? "bg-slate-50 border-slate-200 opacity-60"
          : `${colors.light} ${colors.border}`
      }`}
    >
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isPast ? "bg-slate-300" : colors.bg}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${isPast ? "text-slate-400" : colors.text}`}>{slot.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{timeLabel}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button onClick={onEdit} className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer">✏️</button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-slate-400 hover:text-red-500 text-sm cursor-pointer">🗑️</button>
        )}
      </div>
    </div>
  );
}
