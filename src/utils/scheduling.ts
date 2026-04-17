import type { DateString, DailySchedule, Goal, OneOffEvent, RecurringEvent, ScheduledSlot } from "../types";
import { addDays, getDayOfWeek, minutesToTime, timeToMinutes } from "./time";

const MIN_SLOT_MINUTES = 15;

interface FreeWindow {
  startMinutes: number;
  endMinutes: number;
}

function getFreeWindows(
  fixedSlots: ScheduledSlot[],
  dayStart: number,
  dayEnd: number,
  currentMinutes?: number
): FreeWindow[] {
  const windows: FreeWindow[] = [];
  let cursor = Math.max(dayStart, currentMinutes ?? dayStart);

  const sorted = [...fixedSlots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  for (const slot of sorted) {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    if (slotStart > cursor + MIN_SLOT_MINUTES) {
      windows.push({ startMinutes: cursor, endMinutes: slotStart });
    }
    cursor = Math.max(cursor, slotEnd);
  }

  if (dayEnd > cursor + MIN_SLOT_MINUTES) {
    windows.push({ startMinutes: cursor, endMinutes: dayEnd });
  }

  return windows;
}

export function buildDailySchedule(
  date: DateString,
  recurringEvents: RecurringEvent[],
  oneOffEvents: OneOffEvent[],
  goals: Goal[],
  currentMinutes?: number, // only set when date === today
  dayStart = timeToMinutes("06:00"),
  dayEnd = timeToMinutes("22:00")
): DailySchedule {
  const dow = getDayOfWeek(date);

  // Step 1: collect fixed slots
  const fixedSlots: ScheduledSlot[] = [];

  for (const re of recurringEvents) {
    const applies = re.daysOfWeek.length === 0 || re.daysOfWeek.includes(dow);
    if (applies) {
      fixedSlots.push({
        id: `recurring-${re.id}-${date}`,
        kind: "recurring",
        title: re.title,
        startTime: re.startTime,
        endTime: re.endTime,
        color: re.color,
      });
    }
  }

  for (const oe of oneOffEvents) {
    if (oe.date === date) {
      fixedSlots.push({
        id: `oneoff-${oe.id}`,
        kind: "oneoff",
        title: oe.title,
        startTime: oe.startTime,
        endTime: oe.endTime,
        color: oe.color,
      });
    }
  }

  // Step 2: detect free windows (only future windows when today)
  const freeWindows = getFreeWindows(fixedSlots, dayStart, dayEnd, currentMinutes);

  // Step 3: build work queue — rescheduled steps first, then by goal urgency
  const workQueue: Array<{ goalId: string; stepId: string; title: string; minutes: number; color: string; rescheduled: boolean }> = [];

  const sortedGoals = [...goals].sort((a, b) => {
    if (!a.targetDate && !b.targetDate) return 0;
    if (!a.targetDate) return 1;
    if (!b.targetDate) return -1;
    return a.targetDate.localeCompare(b.targetDate);
  });

  for (const goal of sortedGoals) {
    for (const step of goal.steps) {
      if (!step.completed) {
        workQueue.push({
          goalId: goal.id,
          stepId: step.id,
          title: step.title,
          minutes: step.estimatedMinutes,
          color: goal.color,
          rescheduled: step.rescheduled ?? false,
        });
      }
    }
  }

  // Rescheduled steps jump to the front
  workQueue.sort((a, b) => (b.rescheduled ? 1 : 0) - (a.rescheduled ? 1 : 0));

  // Step 4: fill free windows with goal steps
  const goalSlots: ScheduledSlot[] = [];
  let queueIndex = 0;

  for (const window of freeWindows) {
    let cursor = window.startMinutes;

    while (cursor < window.endMinutes - MIN_SLOT_MINUTES && queueIndex < workQueue.length) {
      const item = workQueue[queueIndex];
      const available = window.endMinutes - cursor;

      if (item.minutes <= available) {
        goalSlots.push({
          id: `goal-step-${item.stepId}-${date}`,
          kind: "goal-step",
          title: item.title,
          startTime: minutesToTime(cursor),
          endTime: minutesToTime(cursor + item.minutes),
          color: item.color,
          stepId: item.stepId,
          goalId: item.goalId,
          completed: false,
        });
        cursor += item.minutes;
        queueIndex++;
      } else {
        // Try to find a shorter step that fits
        let found = false;
        for (let i = queueIndex + 1; i < workQueue.length; i++) {
          if (workQueue[i].minutes <= available) {
            const swap = workQueue[i];
            goalSlots.push({
              id: `goal-step-${swap.stepId}-${date}`,
              kind: "goal-step",
              title: swap.title,
              startTime: minutesToTime(cursor),
              endTime: minutesToTime(cursor + swap.minutes),
              color: swap.color,
              stepId: swap.stepId,
              goalId: swap.goalId,
              completed: false,
            });
            cursor += swap.minutes;
            workQueue.splice(i, 1);
            found = true;
            break;
          }
        }
        if (!found) break;
      }
    }
  }

  // Step 5: merge and sort
  const allSlots = [...fixedSlots, ...goalSlots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  return { date, slots: allSlots };
}

// Get the next N dates that have pending goal steps, starting from a given date
export function getUpcomingGoalDates(
  fromDate: DateString,
  goals: Goal[],
  count: number
): DateString[] {
  const dates: DateString[] = [];
  let current = fromDate;
  let checked = 0;
  while (dates.length < count && checked < 60) {
    const hasPending = goals.some((g) => g.steps.some((s) => !s.completed));
    if (hasPending) dates.push(current);
    current = addDays(current, 1);
    checked++;
  }
  return dates;
}
