// Categories

export const goalCategories = [
  { label: "Career", value: "CAREER" },
  { label: "Learning", value: "LEARNING" },
  { label: "Health", value: "HEALTH" },
  { label: "Finance", value: "FINANCE" },
  { label: "Personal", value: "PERSONAL" },
];

// Priorities

export const goalPriorities = [
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

// Status Labels

export const statusLabels = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

// Status Colors

export const statusColors = {
  NOT_STARTED: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
};

// Category Colors

export const categoryColors = {
  CAREER:
    "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-900",

  LEARNING:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",

  HEALTH:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",

  FINANCE:
    "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-900",

  PERSONAL:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900",
};

// Priority Colors

export const priorityColors = {
  HIGH:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300",

  MEDIUM:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300",

  LOW:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300",
};