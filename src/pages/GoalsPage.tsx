import { useState } from "react";
import { useStore } from "../store/useStore";
import { GoalCard } from "../components/goals/GoalCard";
import { GoalForm } from "../components/goals/GoalForm";
import { Button } from "../components/ui/Button";

export function GoalsPage() {
  const goals = useStore((s) => s.goals);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const totalSteps = goals.reduce((sum, g) => sum + g.steps.length, 0);
  const completedSteps = goals.reduce((sum, g) => sum + g.steps.filter((s) => s.completed).length, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Goals</h1>
          {totalSteps > 0 && (
            <p className="text-sm text-slate-500">{completedSteps} of {totalSteps} steps completed</p>
          )}
        </div>
        <Button onClick={() => setShowAddGoal(true)}>+ New Goal</Button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <span className="text-5xl mb-4">🎯</span>
          <p className="text-lg font-medium">No goals yet</p>
          <p className="text-sm mt-1 mb-6">Add a goal and break it into steps — the app will schedule them in your free time</p>
          <Button onClick={() => setShowAddGoal(true)}>Create your first goal</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {showAddGoal && <GoalForm onClose={() => setShowAddGoal(false)} />}
    </div>
  );
}
