import type { DateString, DayOfWeek, TimeString } from "../types";

export function timeToMinutes(t: TimeString): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number): TimeString {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function formatTimeDisplay(t: TimeString): string {
  const mins = timeToMinutes(t);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m === 0 ? "" : `:${String(m).padStart(2, "0")}`;
  return `${displayH}${displayM} ${ampm}`;
}

export function getTodayString(): DateString {
  const d = new Date();
  return toDateString(d);
}

export function toDateString(d: Date): DateString {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateString(s: DateString): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getDayOfWeek(date: DateString): DayOfWeek {
  return parseDateString(date).getDay() as DayOfWeek;
}

export function addDays(date: DateString, days: number): DateString {
  const d = parseDateString(date);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function formatDateDisplay(date: DateString): string {
  const d = parseDateString(date);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function formatDateShort(date: DateString): string {
  const d = parseDateString(date);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function getWeekStart(date: DateString): DateString {
  const d = parseDateString(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // make Mon the start
  d.setDate(d.getDate() + diff);
  return toDateString(d);
}
