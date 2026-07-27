import { useState, useEffect } from "react";
import { X, CheckCircle, Circle, Calendar, Target, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export default function GoalDetailDrawer({ goal, open, onClose, onUpdateGoal }) {
  const [currentGoal, setCurrentGoal] = useState(goal);
  const [newSubGoalTitle, setNewSubGoalTitle] = useState("");

  useEffect(() => {
    setCurrentGoal(goal);
  }, [goal]);

  if (!currentGoal) return null;

  const toggleSubGoal = (subId) => {
    const updatedSubGoals = currentGoal.sub_goals.map((sub) =>
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    const completedCount = updatedSubGoals.filter((s) => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSubGoals.length) * 100);

    const updated = {
      ...currentGoal,
      sub_goals: updatedSubGoals,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in_progress",
    };

    setCurrentGoal(updated);
    if (onUpdateGoal) onUpdateGoal(updated);
  };

  const handleAddSubGoal = (e) => {
    e.preventDefault();
    if (!newSubGoalTitle.trim()) return;

    const newSub = {
      id: Date.now(),
      title: newSubGoalTitle.trim(),
      completed: false,
    };

    const updatedSubGoals = [...currentGoal.sub_goals, newSub];
    const completedCount = updatedSubGoals.filter((s) => s.completed).length;
    const newProgress = Math.round((completedCount / updatedSubGoals.length) * 100);

    const updated = {
      ...currentGoal,
      sub_goals: updatedSubGoals,
      progress: newProgress,
    };

    setCurrentGoal(updated);
    setNewSubGoalTitle("");
    if (onUpdateGoal) onUpdateGoal(updated);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="space-y-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-semibold">
              {currentGoal.category}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs uppercase font-bold ${
                currentGoal.status === "completed"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {currentGoal.status.replace("_", " ")}
            </Badge>
          </div>

          <SheetTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {currentGoal.title}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
            {currentGoal.description}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Goal Completion</span>
              <span className="text-indigo-600 dark:text-indigo-400">{currentGoal.progress}%</span>
            </div>
            <Progress value={currentGoal.progress} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Sub-goals List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sub-Goals Breakdown ({currentGoal.sub_goals?.filter((s) => s.completed).length}/{currentGoal.sub_goals?.length})
            </h4>

            <div className="space-y-2">
              {currentGoal.sub_goals?.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => toggleSubGoal(sub.id)}
                  className="flex cursor-pointer items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                >
                  {sub.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-sm ${sub.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Sub-goal Form */}
            <form onSubmit={handleAddSubGoal} className="flex gap-2 pt-2">
              <Input
                placeholder="Add a new sub-goal..."
                value={newSubGoalTitle}
                onChange={(e) => setNewSubGoalTitle(e.target.value)}
                className="text-xs rounded-xl border-slate-200 dark:border-slate-800"
              />
              <Button type="submit" size="sm" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Target Date */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/20 text-xs">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span>Target Completion Date</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{currentGoal.target_date}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
