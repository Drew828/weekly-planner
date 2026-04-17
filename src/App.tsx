import { useState } from "react";
import type { ActivePage, DateString } from "./types";
import { NavBar } from "./components/layout/NavBar";
import { DailyPage } from "./pages/DailyPage";
import { WeeklyPage } from "./pages/WeeklyPage";
import { GoalsPage } from "./pages/GoalsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { getTodayString } from "./utils/time";

export default function App() {
  const [page, setPage] = useState<ActivePage>("daily");
  const [selectedDate, setSelectedDate] = useState<DateString>(getTodayString());

  function handleNavigateToDay(date: DateString) {
    setSelectedDate(date);
    setPage("daily");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-bold text-indigo-600 tracking-tight">Day Planner</h1>
        </div>
      </header>

      <NavBar page={page} onChange={setPage} />

      <main className="pb-10">
        {page === "daily" && <DailyPage key={selectedDate} initialDate={selectedDate} />}
        {page === "weekly" && <WeeklyPage onNavigateToDay={handleNavigateToDay} />}
        {page === "goals" && <GoalsPage />}
        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}
