import { useState } from "react";
import { getTodayString, addDays, getWeekStart, formatDateShort } from "../utils/time";
import { useWeekDates } from "../hooks/useWeekDates";
import { useDailySchedule } from "../hooks/useDailySchedule";
import type { DateString } from "../types";
import { getColorClasses } from "../types";

interface WeekDayColumnProps {
  date: DateString;
  isToday: boolean;
  onClick: () => void;
}

function WeekDayColumn({ date, isToday, onClick }: WeekDayColumnProps) {
  const schedule = useDailySchedule(date);

  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 rounded-xl p-2 text-left transition-colors cursor-pointer ${
        isToday ? "bg-indigo-50 border-2 border-indigo-200" : "bg-white border border-slate-200 hover:bg-slate-50"
      }`}
    >
      <p className={`text-xs font-semibold mb-2 ${isToday ? "text-indigo-600" : "text-slate-500"}`}>
        {formatDateShort(date)}
      </p>
      <div className="flex flex-col gap-1">
        {schedule.slots.filter(s => s.kind !== "goal-step").slice(0, 5).map((slot) => {
          const colors = getColorClasses(slot.color);
          return (
            <div
              key={slot.id}
              className={`text-xs rounded px-1.5 py-0.5 truncate ${colors.light} ${colors.text}`}
            >
              {slot.title}
            </div>
          );
        })}
        {schedule.slots.filter(s => s.kind !== "goal-step").length > 5 && (
          <p className="text-xs text-slate-400">+{schedule.slots.filter(s => s.kind !== "goal-step").length - 5} more</p>
        )}
        {schedule.slots.filter(s => s.kind !== "goal-step").length === 0 && (
          <p className="text-xs text-slate-300">Free</p>
        )}
      </div>
    </button>
  );
}

interface WeeklyPageProps {
  onNavigateToDay: (date: DateString) => void;
}

export function WeeklyPage({ onNavigateToDay }: WeeklyPageProps) {
  const [weekRef, setWeekRef] = useState(getTodayString());
  const weekDates = useWeekDates(weekRef);
  const today = getTodayString();

  const weekStart = getWeekStart(weekRef);
  const weekEnd = addDays(weekStart, 6);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekRef(addDays(weekRef, -7))}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          ‹
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800">
            {formatDateShort(weekStart)} – {formatDateShort(weekEnd)}
          </h1>
          {!weekDates.includes(today) && (
            <button onClick={() => setWeekRef(today)} className="text-xs text-indigo-500 hover:underline cursor-pointer">
              Back to this week
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekRef(addDays(weekRef, 7))}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          ›
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDates.map((date) => (
          <WeekDayColumn
            key={date}
            date={date}
            isToday={date === today}
            onClick={() => onNavigateToDay(date)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 mt-4">Click any day to view its full schedule</p>
    </div>
  );
}
