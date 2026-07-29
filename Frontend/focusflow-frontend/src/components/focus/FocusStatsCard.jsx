import {
  Clock,
  Calendar,
  CheckCircle2,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FocusCardSkeleton from "./FocusCardSkeleton";
import FocusEmptyState from "./FocusEmptyState";
import FocusErrorState from "./FocusErrorState";

function formatHours(minutes) {
  if (minutes === 0) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatTile({ icon: Icon, label, value, sublabel, accent }) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        {sublabel && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {sublabel}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default function FocusStatsCard({ isLoading = false, error, onRetry }) {
  const { stats } = useFocusTimer();

  if (isLoading) return <FocusCardSkeleton className="h-[360px]" />;

  if (error) {
    return (
      <FocusErrorState
        message="Could not load focus statistics."
        onRetry={onRetry}
      />
    );
  }

  const hasAnyStat =
    stats.todayFocusMinutes > 0 ||
    stats.weekFocusMinutes > 0 ||
    stats.completedPomodoros > 0 ||
    stats.currentStreak > 0;

  if (!hasAnyStat) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Productivity Metrics
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Focus time, streaks, and session stats
          </p>
        </CardHeader>
        <CardContent>
          <FocusEmptyState
            title="No statistics yet"
            description="Complete your first focus session to start tracking your productivity trends here."
          />
        </CardContent>
      </Card>
    );
  }

  const statsData = [
    {
      icon: Clock,
      label: "Today's Focus Time",
      value: formatHours(stats.todayFocusMinutes),
      sublabel: "Today",
      accent: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    },
    {
      icon: Calendar,
      label: "This Week's Focus",
      value: formatHours(stats.weekFocusMinutes),
      sublabel: "7 days",
      accent: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
    },
    {
      icon: CheckCircle2,
      label: "Completed Pomodoros",
      value: `${stats.completedPomodoros}`,
      sublabel: "Total",
      accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${stats.currentStreak} days`,
      sublabel: "Active",
      accent: "bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
    },
    {
      icon: Trophy,
      label: "Longest Streak",
      value: `${stats.longestStreak} days`,
      sublabel: "Record",
      accent: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    },
    {
      icon: TrendingUp,
      label: "Avg Daily Focus",
      value: formatHours(stats.averageDailyFocusMinutes),
      sublabel: "Per day",
      accent: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
    },
  ];

  return (
    <Card
      aria-labelledby="focus-stats-title"
      className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle
              id="focus-stats-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              Productivity Metrics
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Focus time, streaks, and session stats
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {statsData.map((stat) => (
            <StatTile
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              sublabel={stat.sublabel}
              accent={stat.accent}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
