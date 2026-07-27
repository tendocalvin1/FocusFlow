import { Calendar, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnalyticsData } from "@/services/analyticsService";

export default function ProductivityHeatmap() {
  const grid = mockAnalyticsData.heatmapGrid;

  const intensityColors = [
    "bg-slate-100 dark:bg-slate-800/80", // 0 hours
    "bg-indigo-200 dark:bg-indigo-950", // 1-2 hours
    "bg-indigo-400 dark:bg-indigo-700", // 3-4 hours
    "bg-indigo-600 dark:bg-indigo-500", // 5+ hours
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Focus Activity Heatmap
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consistency matrix for July 2026
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          {intensityColors.map((color, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-xs ${color}`} />
          ))}
          <span>More</span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-7 gap-2">
          {grid.map((item) => (
            <div
              key={item.day}
              className={`group relative flex h-9 w-full flex-col items-center justify-center rounded-lg ${intensityColors[item.intensity]} transition hover:scale-105`}
            >
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {item.day}
              </span>

              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-8 opacity-0 transition group-hover:opacity-100 z-10">
                <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white shadow-md">
                  Day {item.day}: {item.intensity * 2} hrs focus
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
