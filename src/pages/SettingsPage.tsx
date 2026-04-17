import type { DayOfWeek } from "../types";
import { DAY_NAMES } from "../types";
import { useStore } from "../store/useStore";

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

export function SettingsPage() {
  const dayWindows = useStore((s) => s.dayWindows);
  const updateDayWindow = useStore((s) => s.updateDayWindow);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Schedule Settings</h2>
      <p className="text-sm text-slate-500 mb-6">
        Set your wake and sleep times for each day. Goal steps will only be scheduled within these windows.
      </p>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {DAYS.map((dow) => {
          const w = dayWindows[dow];
          return (
            <div key={dow} className="flex items-center gap-4 px-5 py-4">
              <span className="w-10 text-sm font-semibold text-slate-600 flex-shrink-0">
                {DAY_NAMES[dow]}
              </span>

              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs text-slate-400 w-12 flex-shrink-0">Wake</label>
                <input
                  type="time"
                  value={w.wakeTime}
                  onChange={(e) =>
                    updateDayWindow(dow, { ...w, wakeTime: e.target.value })
                  }
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 flex-1">
                <label className="text-xs text-slate-400 w-12 flex-shrink-0">Sleep</label>
                <input
                  type="time"
                  value={w.sleepTime}
                  onChange={(e) =>
                    updateDayWindow(dow, { ...w, sleepTime: e.target.value })
                  }
                  className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">Changes take effect immediately.</p>
    </div>
  );
}
