import * as React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/services/analyticsService";

export default function ProductivityHeatmap() {
  const [grid, setGrid] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    analyticsService
      .getHeatmapGrid("28d")
      .then((data) => {
        if (mounted) setGrid(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const intensityColors = [
    "bg-slate-100 dark:bg-slate-800/80",
    "bg-indigo-200 dark:bg-indigo-950",
    "bg-indigo-400 dark:bg-indigo-700",
    "bg-indigo-600 dark:bg-indigo-500",
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

        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          {intensityColors.map((color, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-xs ${color}`} />
          ))}
          <span>More</span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        {isLoading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {grid.map((item) => (
              <div
                key={item.day}
                className={`group relative flex h-9 w-full flex-col items-center justify-center rounded-lg ${intensityColors[item.intensity]} transition hover:scale-105`}
              >
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {item.day}
                </span>

                <div className="pointer-events-none absolute -top-8 opacity-0 transition group-hover:opacity-100 z-10">
                  <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white shadow-md">
                    Day {item.day}: {item.intensity * 2} hrs focus
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
