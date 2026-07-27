import { Target, Calendar, CheckSquare, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function GoalCard({ goal, onSelect }) {
  const completedSubGoals = goal.sub_goals?.filter((s) => s.completed).length || 0;
  const totalSubGoals = goal.sub_goals?.length || 0;

  const categoryColors = {
    Work: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900",
    Learning: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    Health: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
    Personal: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900",
  };

  return (
    <Card
      onClick={() => onSelect(goal)}
      className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
    >
      <CardContent className="p-0 space-y-4">
        {/* Header Badges & Category */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-xs font-semibold ${categoryColors[goal.category] || "bg-slate-100 text-slate-700"}`}
          >
            {goal.category}
          </Badge>

          <Badge
            variant="secondary"
            className={`text-[10px] uppercase font-bold tracking-wider ${
              goal.status === "completed"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {goal.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 transition">
            {goal.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {goal.description}
          </p>
        </div>

        {/* Progress Bar & Subgoals */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2 bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {completedSubGoals}/{totalSubGoals} sub-goals
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Target: {goal.target_date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
