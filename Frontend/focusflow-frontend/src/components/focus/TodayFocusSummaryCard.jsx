import { CheckCircle2, Clock, Flame } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FocusCardSkeleton from "./FocusCardSkeleton";

function formatHours(minutes) {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function TodayFocusSummaryCard({ isLoading = false }) {
  const { stats, todaySessions } = useFocusTimer();

  if (isLoading) return <FocusCardSkeleton className="h-44" />;

  const completedToday = todaySessions.filter((session) => session.status === "completed").length;
  const items = [
    { label: "Focused Today", value: formatHours(stats.todayFocusMinutes), icon: Clock },
    { label: "Completed", value: completedToday, icon: CheckCircle2 },
    { label: "Streak", value: `${stats.currentStreak} days`, icon: Flame },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Today's Focus Summary
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400">Progress across today's sessions</p>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <p className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{item.value}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
