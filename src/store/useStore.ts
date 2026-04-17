import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayOfWeek, DayWindow, Goal, OneOffEvent, RecurringEvent, Step, WeeklyDayWindows } from "../types";
import { makeDefaultWeeklyWindows } from "../types";

interface AppState {
  recurringEvents: RecurringEvent[];
  oneOffEvents: OneOffEvent[];
  goals: Goal[];
  dayWindows: WeeklyDayWindows;
}

interface Actions {
  // Recurring events
  addRecurringEvent: (e: RecurringEvent) => void;
  updateRecurringEvent: (e: RecurringEvent) => void;
  deleteRecurringEvent: (id: string) => void;

  // One-off events
  addOneOffEvent: (e: OneOffEvent) => void;
  updateOneOffEvent: (e: OneOffEvent) => void;
  deleteOneOffEvent: (id: string) => void;

  // Goals
  addGoal: (g: Goal) => void;
  updateGoal: (g: Goal) => void;
  deleteGoal: (id: string) => void;

  // Steps
  addStep: (s: Step) => void;
  updateStep: (s: Step) => void;
  deleteStep: (goalId: string, stepId: string) => void;
  toggleStep: (goalId: string, stepId: string, date: string) => void;
  rescheduleStep: (goalId: string, stepId: string) => void;

  // Day windows
  updateDayWindow: (dow: DayOfWeek, window: DayWindow) => void;
}

export const useStore = create<AppState & Actions>()(
  persist(
    (set) => ({
      recurringEvents: [],
      oneOffEvents: [],
      goals: [],
      dayWindows: makeDefaultWeeklyWindows(),

      addRecurringEvent: (e) =>
        set((s) => ({ recurringEvents: [...s.recurringEvents, e] })),
      updateRecurringEvent: (e) =>
        set((s) => ({
          recurringEvents: s.recurringEvents.map((r) => (r.id === e.id ? e : r)),
        })),
      deleteRecurringEvent: (id) =>
        set((s) => ({ recurringEvents: s.recurringEvents.filter((r) => r.id !== id) })),

      addOneOffEvent: (e) =>
        set((s) => ({ oneOffEvents: [...s.oneOffEvents, e] })),
      updateOneOffEvent: (e) =>
        set((s) => ({
          oneOffEvents: s.oneOffEvents.map((o) => (o.id === e.id ? e : o)),
        })),
      deleteOneOffEvent: (id) =>
        set((s) => ({ oneOffEvents: s.oneOffEvents.filter((o) => o.id !== id) })),

      addGoal: (g) =>
        set((s) => ({ goals: [...s.goals, g] })),
      updateGoal: (g) =>
        set((s) => ({ goals: s.goals.map((og) => (og.id === g.id ? g : og)) })),
      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      addStep: (step) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === step.goalId ? { ...g, steps: [...g.steps, step] } : g
          ),
        })),
      updateStep: (step) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === step.goalId
              ? { ...g, steps: g.steps.map((st) => (st.id === step.id ? step : st)) }
              : g
          ),
        })),
      deleteStep: (goalId, stepId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId ? { ...g, steps: g.steps.filter((st) => st.id !== stepId) } : g
          ),
        })),
      toggleStep: (goalId, stepId, date) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  steps: g.steps.map((st) =>
                    st.id === stepId
                      ? {
                          ...st,
                          completed: !st.completed,
                          completedDate: !st.completed ? date : undefined,
                          rescheduled: false,
                        }
                      : st
                  ),
                }
              : g
          ),
        })),
      rescheduleStep: (goalId, stepId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  steps: g.steps.map((st) =>
                    st.id === stepId
                      ? { ...st, rescheduled: true, completed: false }
                      : st
                  ),
                }
              : g
          ),
        })),
      updateDayWindow: (dow, window) =>
        set((s) => ({ dayWindows: { ...s.dayWindows, [dow]: window } })),
    }),
    { name: "weekly-planner-data" }
  )
);
