export const mockAnalyticsData = {
  summary: {
    total_focus_hours: "28.5 hrs",
    completion_rate: "91%",
    peak_hour: "10:00 AM",
    streak_days: 14,
  },
  trend7Days: [
    { label: "Mon", hours: 4.5, tasks: 6 },
    { label: "Tue", hours: 6.2, tasks: 9 },
    { label: "Wed", hours: 5.8, tasks: 8 },
    { label: "Thu", hours: 7.0, tasks: 11 },
    { label: "Fri", hours: 4.0, tasks: 5 },
    { label: "Sat", hours: 2.5, tasks: 3 },
    { label: "Sun", hours: 1.8, tasks: 2 },
  ],
  categoryDistribution: [
    { category: "Frontend", percentage: 42, hours: "12.0 hrs", color: "bg-blue-500" },
    { category: "Backend", percentage: 28, hours: "8.0 hrs", color: "bg-indigo-500" },
    { category: "Design", percentage: 18, hours: "5.0 hrs", color: "bg-purple-500" },
    { category: "DevOps", percentage: 12, hours: "3.5 hrs", color: "bg-emerald-500" },
  ],
  heatmapGrid: Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: Math.floor(Math.random() * 4),
  })),
};
