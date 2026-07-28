export const taskStatuses = [
  { key: "todo", title: "To Do", color: "bg-slate-500" },
  { key: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { key: "in_review", title: "In Review", color: "bg-amber-500" },
  { key: "done", title: "Done", color: "bg-emerald-500" },
];

export const taskPriorities = ["All", "High", "Medium", "Low"];

export const taskTags = ["All", "Frontend", "Backend", "Design", "DevOps"];

export const priorityBadgeClasses = {
  High: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900",
  Low: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export const tagBadgeClasses = {
  Frontend: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  Backend: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  Design: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  DevOps: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};
