import { useMemo } from "react";
import type { DateString } from "../types";
import { addDays, getWeekStart } from "../utils/time";

export function useWeekDates(referenceDate: DateString): DateString[] {
  return useMemo(() => {
    const monday = getWeekStart(referenceDate);
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, [referenceDate]);
}
