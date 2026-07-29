import { mockFocusSessions, mockFocusStats } from "@/data/mockSessions";

const delay = (data, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

const clone = (obj) => JSON.parse(JSON.stringify(obj));

const isSameDay = (dateStr, ref = new Date()) => {
  const target = new Date(dateStr + "T00:00:00");
  const refDay = new Date(ref);
  refDay.setHours(0, 0, 0, 0);
  return (
    target.getFullYear() === refDay.getFullYear() &&
    target.getMonth() === refDay.getMonth() &&
    target.getDate() === refDay.getDate()
  );
};

export const focusService = {
  getSessions: async (filters = {}) => {
    let result = clone(mockFocusSessions);

    if (filters?.date === "today") {
      result = result.filter((s) => isSameDay(s.date));
    } else if (filters?.dateFrom) {
      const from = new Date(filters.dateFrom);
      result = result.filter((s) => new Date(s.date) >= from);
    }
    if (filters?.status && filters.status !== "All") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.mode && filters.mode !== "All") {
      result = result.filter((s) => s.mode === filters.mode);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }
    return delay(result);
  },

  getTodaysSessions: async () => {
    return focusService.getSessions({ date: "today" });
  },

  createSession: async (payload) => {
    const now = new Date();
    const durationMinutes = payload.durationMinutes || Math.round((payload.durationSeconds || 0) / 60) || 25;
    const newSession = {
      id: Date.now(),
      title: payload.title || "Focus Session",
      mode: payload.mode || "pomodoro",
      durationMinutes,
      duration: `${durationMinutes} min`,
      status: payload.status || "completed",
      completedAt: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toISOString().slice(0, 10),
      tag:
        payload.tag ||
        (payload.mode === "pomodoro" || payload.mode === "custom"
          ? "Work"
          : "Recovery"),
    };
    mockFocusSessions.unshift(newSession);
    return delay(clone(newSession), 80);
  },

  getStats: async () => {
    const sessions = clone(mockFocusSessions);
    const completed = sessions.filter((s) => s.status === "completed");
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayFocusMinutes = sessions
      .filter((s) => s.date === todayKey && s.status === "completed")
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const weekFocusMinutes = completed.reduce(
      (acc, s) => acc + (s.durationMinutes || 0),
      0
    );
    const completedPomodoros = completed.filter(
      (s) => s.mode === "pomodoro"
    ).length;

    return delay({
      todayFocusMinutes,
      weekFocusMinutes,
      completedPomodoros,
      currentStreak: mockFocusStats.currentStreak,
      longestStreak: mockFocusStats.longestStreak,
      averageDailyFocusMinutes: Math.round(weekFocusMinutes / 7),
    });
  },
};
