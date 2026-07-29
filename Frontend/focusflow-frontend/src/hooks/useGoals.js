import { useState, useEffect } from "react";
import { goalsService } from "@/services/goalsService";

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    goalsService
      .getGoals()
      .then((data) => {
        if (mounted) setGoals(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || "Failed to load goals");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const addGoal = (goal) => {
    return goalsService.createGoal(goal).then((created) => {
      setGoals((prev) => [created, ...prev]);
      return created;
    });
  };

  const updateGoal = (updatedGoal) => {
    return goalsService
      .updateGoal(updatedGoal.id, updatedGoal)
      .then((saved) => {
        if (!saved) return updatedGoal;
        setGoals((prev) =>
          prev.map((goal) => (goal.id === saved.id ? saved : goal))
        );
        return saved;
      });
  };

  const deleteGoal = (id) => {
    return goalsService.deleteGoal(id).then((ok) => {
      if (ok) {
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
      }
      return ok;
    });
  };

  const toggleSubGoal = (goalId, subGoalId) => {
    const goal = goals.find((g) => g.id === goalId);
    const sub = goal?.sub_goals?.find((s) => s.id === subGoalId);
    if (!sub) return Promise.resolve(goal);
    return goalsService
      .updateSubGoal(goalId, subGoalId, { completed: !sub.completed })
      .then((saved) => {
        if (!saved) return goal;
        setGoals((prev) =>
          prev.map((g) => (g.id === saved.id ? saved : g))
        );
        return saved;
      });
  };

  return {
    goals,
    isLoading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleSubGoal,
  };
}
