import { useState, useEffect } from "react";
import { AlertCircle, Plus, Search, Target } from "lucide-react";
import { goalsService } from "@/services/goalsService";
import GoalCard from "@/components/goals/GoalCard";
import GoalDetailDrawer from "@/components/goals/GoalDetailDrawer";
import GoalFormModal from "@/components/goals/CreateGoalModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { goalCategories } from "@/constants/goalConstants";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", ...goalCategories];

  useEffect(() => {
    let isMounted = true;

    goalsService
      .getGoals()
      .then((data) => {
        if (isMounted) setGoals(data);
      })
      .catch(() => {
        if (isMounted) setError("Goals could not be loaded from mock data.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGoals = goals.filter((g) => {
    const matchesCategory = selectedCategory === "All" || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCount = goals.filter((g) => g.status === "in_progress").length;
  const completedCount = goals.filter((g) => g.status === "completed").length;
  const totalSubGoals = goals.reduce((acc, curr) => acc + (curr.sub_goals?.length || 0), 0);

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    setIsDrawerOpen(true);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
    );
    setSelectedGoal(updatedGoal);
  };

  const handleCreateGoal = (newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    setSelectedGoal(null);
  };

  const handleOpenEditGoal = (goal) => {
    setGoalToEdit(goal);
    setIsDrawerOpen(false);
    setIsModalOpen(true);
  };

  const handleOpenCreateGoal = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGoalToEdit(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Strategic Goals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Define objectives, break down sub-goals, and track long-term progress.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateGoal}
          className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 font-semibold gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Goal
        </Button>
      </div>

      {/* Goal Summary Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Goals</span>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{goals.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Objectives</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sub-Goals Defined</span>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{totalSubGoals}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl border-slate-200/80 bg-white dark:border-slate-800 text-xs"
          />
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : filteredGoals.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onSelect={handleSelectGoal} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-10 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <Target className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
            No goals found
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Adjust your filters or create a new goal to start tracking progress.
          </p>
          <Button onClick={handleOpenCreateGoal} className="mt-5 rounded-xl">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>
      )}

      {/* Goal Details Drawer */}
      {selectedGoal && (
        <GoalDetailDrawer
          key={selectedGoal.id}
          goal={selectedGoal}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onDeleteGoal={handleDeleteGoal}
          onEditGoal={handleOpenEditGoal}
          onUpdateGoal={handleUpdateGoal}
        />
      )}

      {/* Create Goal Modal */}
      {isModalOpen && (
        <GoalFormModal
          key={goalToEdit?.id || "new-goal"}
          open={isModalOpen}
          onClose={handleCloseModal}
          onCreateGoal={handleCreateGoal}
          goalToEdit={goalToEdit}
          onUpdateGoal={handleUpdateGoal}
        />
      )}
    </div>
  );
}
