import { mockGoals } from "@/data/mockGoals";

const delay = (data, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const goalsService = {
  getGoals: async (filters = {}) => {
    let result = clone(mockGoals);
    if (filters?.category && filters.category !== "All") {
      result = result.filter((g) => g.category === filters.category);
    }
    if (filters?.status && filters.status !== "All") {
      result = result.filter((g) => g.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }
    return delay(result);
  },

  getGoalById: async (id) => {
    const goal = mockGoals.find((g) => g.id === id);
    return delay(goal ? clone(goal) : null);
  },

  createGoal: async (payload) => {
    const newGoal = {
      id: Date.now(),
      progress: 0,
      status: "in_progress",
      sub_goals: [],
      ...payload,
    };
    mockGoals.unshift(newGoal);
    return delay(clone(newGoal), 100);
  },

  updateGoal: async (id, payload) => {
    const idx = mockGoals.findIndex((g) => g.id === id);
    if (idx === -1) return delay(null);
    mockGoals[idx] = { ...mockGoals[idx], ...payload };
    return delay(clone(mockGoals[idx]), 100);
  },

  deleteGoal: async (id) => {
    const idx = mockGoals.findIndex((g) => g.id === id);
    if (idx === -1) return delay(false);
    mockGoals.splice(idx, 1);
    return delay(true, 100);
  },

  updateSubGoal: async (goalId, subGoalId, patch) => {
    const goal = mockGoals.find((g) => g.id === goalId);
    if (!goal) return delay(null);
    const subIdx = goal.sub_goals.findIndex((s) => s.id === subGoalId);
    if (subIdx === -1) return delay(null);
    goal.sub_goals[subIdx] = { ...goal.sub_goals[subIdx], ...patch };
    const completedCount = goal.sub_goals.filter((s) => s.completed).length;
    goal.progress = goal.sub_goals.length
      ? Math.round((completedCount / goal.sub_goals.length) * 100)
      : 0;
    if (goal.progress === 100) goal.status = "completed";
    return delay(clone(goal), 100);
  },
};
