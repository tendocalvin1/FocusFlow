import { useState } from "react";
import { Calendar, CheckCircle, Circle, Edit3, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { categoryColors, priorityColors, statusLabels } from "@/constants/goalConstants";

function getProgress(subGoals = []) {
  if (!subGoals.length) return 0;

  return Math.round(
    (subGoals.filter((subGoal) => subGoal.completed).length / subGoals.length) * 100
  );
}

export default function GoalDetailDrawer({
  goal,
  open,
  onClose,
  onDeleteGoal,
  onEditGoal,
  onUpdateGoal,
}) {
  const [newSubGoalTitle, setNewSubGoalTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!goal) return null;

  const toggleSubGoal = (subId) => {
    const updatedSubGoals = goal.sub_goals.map((sub) =>
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    const newProgress = getProgress(updatedSubGoals);

    const updated = {
      ...goal,
      sub_goals: updatedSubGoals,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in_progress",
    };

    if (onUpdateGoal) onUpdateGoal(updated);
  };

  const removeSubGoal = (subId) => {
    const updatedSubGoals = goal.sub_goals.filter((sub) => sub.id !== subId);
    const newProgress = getProgress(updatedSubGoals);
    const updated = {
      ...goal,
      sub_goals: updatedSubGoals,
      progress: newProgress,
      status: newProgress === 100 && updatedSubGoals.length > 0 ? "completed" : "in_progress",
    };

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

    const updatedSubGoals = [...goal.sub_goals, newSub];
    const newProgress = getProgress(updatedSubGoals);

    const updated = {
      ...goal,
      sub_goals: updatedSubGoals,
      progress: newProgress,
      status: newProgress === 100 ? "completed" : "in_progress",
    };

    setNewSubGoalTitle("");
    if (onUpdateGoal) onUpdateGoal(updated);
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    onDeleteGoal(goal.id);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-md">
        <SheetHeader className="space-y-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${categoryColors[goal.category] || ""}`}
            >
              {goal.category}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${priorityColors[goal.priority] || ""}`}
            >
              {goal.priority || "Medium"}
            </Badge>
          </div>

          <SheetTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {goal.title}
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
            {goal.description}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {statusLabels[goal.status] || goal.status}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEditGoal(goal)}
                className="rounded-xl"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="rounded-xl"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {showDeleteConfirm ? "Confirm" : "Delete"}
              </Button>
            </div>
          </div>

          {showDeleteConfirm && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              This removes the goal from the current mock workspace.
            </p>
          )}

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Goal Completion</span>
              <span className="text-indigo-600 dark:text-indigo-400">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Sub-goals List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sub-Goals Breakdown ({goal.sub_goals?.filter((s) => s.completed).length || 0}/{goal.sub_goals?.length || 0})
            </h4>

            <div className="space-y-2">
              {goal.sub_goals?.length ? goal.sub_goals.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                >
                  <button type="button" onClick={() => toggleSubGoal(sub.id)}>
                    {sub.completed ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                  </button>
                  <span className={`flex-1 text-sm ${sub.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}`}>
                    {sub.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSubGoal(sub.id)}
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-400 dark:border-slate-800">
                  No sub-goals yet.
                </div>
              )}
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
            <span className="font-semibold text-slate-900 dark:text-slate-100">{goal.target_date}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
