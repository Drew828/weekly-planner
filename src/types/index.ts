export type TimeString = string; // "HH:MM" 24-hour
export type DateString = string; // "YYYY-MM-DD"
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 6=Sat

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export const COLOR_OPTIONS = [
  { key: "blue", bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  { key: "green", bg: "bg-green-500", light: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  { key: "purple", bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  { key: "orange", bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  { key: "red", bg: "bg-red-500", light: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  { key: "yellow", bg: "bg-yellow-400", light: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  { key: "teal", bg: "bg-teal-500", light: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
  { key: "pink", bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
];

export function getColorClasses(colorKey: string) {
  return COLOR_OPTIONS.find((c) => c.key === colorKey) ?? COLOR_OPTIONS[0];
}

export interface RecurringEvent {
  id: string;
  title: string;
  startTime: TimeString;
  endTime: TimeString;
  daysOfWeek: DayOfWeek[]; // empty array = every day
  color: string;
}

export interface OneOffEvent {
  id: string;
  date: DateString;
  title: string;
  startTime: TimeString;
  endTime: TimeString;
  color: string;
}

export interface Step {
  id: string;
  goalId: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
  completedDate?: DateString;
  rescheduled?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate?: DateString;
  color: string;
  steps: Step[];
}

export type SlotKind = "recurring" | "oneoff" | "goal-step";

export interface ScheduledSlot {
  id: string;
  kind: SlotKind;
  title: string;
  startTime: TimeString;
  endTime: TimeString;
  color: string;
  stepId?: string;
  goalId?: string;
  completed?: boolean;
}

export interface DailySchedule {
  date: DateString;
  slots: ScheduledSlot[];
}

export type ActivePage = "daily" | "weekly" | "goals" | "settings";

export interface DayWindow {
  wakeTime: TimeString;   // day starts here for scheduling
  sleepTime: TimeString;  // day ends here for scheduling
}

// Keyed by DayOfWeek (0=Sun … 6=Sat)
export type WeeklyDayWindows = Record<DayOfWeek, DayWindow>;

export const DEFAULT_DAY_WINDOW: DayWindow = { wakeTime: "06:00", sleepTime: "22:00" };

export function makeDefaultWeeklyWindows(): WeeklyDayWindows {
  return {
    0: { ...DEFAULT_DAY_WINDOW },
    1: { ...DEFAULT_DAY_WINDOW },
    2: { ...DEFAULT_DAY_WINDOW },
    3: { ...DEFAULT_DAY_WINDOW },
    4: { ...DEFAULT_DAY_WINDOW },
    5: { ...DEFAULT_DAY_WINDOW },
    6: { ...DEFAULT_DAY_WINDOW },
  };
}
