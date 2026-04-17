import type { ActivePage } from "../../types";

interface NavBarProps {
  page: ActivePage;
  onChange: (p: ActivePage) => void;
}

const tabs: { id: ActivePage; label: string; icon: string }[] = [
  { id: "daily", label: "Today", icon: "📅" },
  { id: "weekly", label: "Week", icon: "🗓️" },
  { id: "goals", label: "Goals", icon: "🎯" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export function NavBar({ page, onChange }: NavBarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 px-4">
      <div className="flex gap-1 max-w-4xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              page === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
