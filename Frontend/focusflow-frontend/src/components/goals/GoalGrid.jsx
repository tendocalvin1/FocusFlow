import GoalCard from "./GoalCard";

export default function GoalGrid({
  goals,
  onSelectGoal,
}) {
  if (!goals.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">

        <h2 className="text-lg font-semibold text-slate-700">
          No goals found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create your first goal to begin tracking your progress.
        </p>

      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onSelect={onSelectGoal}
        />
      ))}

    </div>
  );
}