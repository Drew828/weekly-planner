import { useMemo } from "react";
import type { DateString, DailySchedule } from "../types";
import { useStore } from "../store/useStore";
import { buildDailySchedule } from "../utils/scheduling";
import { getDayOfWeek, getTodayString, timeToMinutes } from "../utils/time";

export function useDailySchedule(date: DateString): DailySchedule {
  const recurringEvents = useStore((s) => s.recurringEvents);
  const oneOffEvents = useStore((s) => s.oneOffEvents);
  const goals = useStore((s) => s.goals);
  const dayWindows = useStore((s) => s.dayWindows);

  return useMemo(() => {
    const isToday = date === getTodayString();
    const currentMinutes = isToday
      ? new Date().getHours() * 60 + new Date().getMinutes()
      : undefined;
    const dow = getDayOfWeek(date);
    const window = dayWindows[dow];
    const dayStart = timeToMinutes(window.wakeTime);
    const dayEnd = timeToMinutes(window.sleepTime);
    return buildDailySchedule(date, recurringEvents, oneOffEvents, goals, currentMinutes, dayStart, dayEnd);
  }, [date, recurringEvents, oneOffEvents, goals, dayWindows]);
}
