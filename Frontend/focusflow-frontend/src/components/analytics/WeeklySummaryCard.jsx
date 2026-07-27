import { CheckCircle2, Clock, Flame, Zap, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnalyticsData } from "@/services/analyticsService";

export default function WeeklySummaryCard() {
  const { summary } = mockAnalyticsData;

  const kpis = [
    { title: "Total Focus Time", value: summary.total_focus_hours, icon: Clock, color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Completion Rate", value: summary.completion_rate, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Peak Output Hour", value: summary.peak_hour, icon: Zap, color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400" },
    { title: "Active Streak", value: `${summary.streak_days} Days`, icon: Flame, color: "text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card key={idx} className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {kpi.value}
                </p>
              </div>

              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
