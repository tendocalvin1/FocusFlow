import { mockTasks } from "@/data/mockTasks";

const delay = (data, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const tasksService = {
  getTasks: async (filters = {}) => {
    let result = clone(mockTasks);

    if (filters?.status && filters.status !== "All") {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== "All") {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters?.tag && filters.tag !== "All") {
      result = result.filter((t) => t.tag === filters.tag);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (filters?.sortBy === "due_date") {
      result.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    } else if (filters?.sortBy === "priority") {
      const rank = { High: 0, Medium: 1, Low: 2 };
      result.sort(
        (a, b) => (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3)
      );
    }
    return delay(result);
  },

  getTaskById: async (id) => {
    const task = mockTasks.find((t) => t.id === id);
    return delay(task ? clone(task) : null);
  },

  createTask: async (payload) => {
    const newTask = {
      id: Date.now(),
      status: payload.status || "todo",
      estimated_sessions: 1,
      completed_sessions: 0,
      ...payload,
    };
    mockTasks.unshift(newTask);
    return delay(clone(newTask), 100);
  },

  updateTask: async (id, payload) => {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) return delay(null);
    mockTasks[idx] = { ...mockTasks[idx], ...payload };
    return delay(clone(mockTasks[idx]), 100);
  },

  updateTaskStatus: async (id, status) => {
    return tasksService.updateTask(id, { status });
  },

  incrementCompletedSessions: async (id) => {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) return delay(null);
    mockTasks[idx].completed_sessions = Math.min(
      mockTasks[idx].completed_sessions + 1,
      mockTasks[idx].estimated_sessions || 99
    );
    return delay(clone(mockTasks[idx]), 50);
  },

  deleteTask: async (id) => {
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) return delay(false);
    mockTasks.splice(idx, 1);
    return delay(true, 100);
  },
};
