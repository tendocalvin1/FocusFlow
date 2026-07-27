import { useState } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAnalyticsData } from "@/services/analyticsService";

export default function ProductivityTrendChart() {
  const [timeRange, setTimeRange] = useState("7d");
  const data = mockAnalyticsData.trend7Days;

  const maxVal = 8;

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Productivity Velocity
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily deep focus hours over time
            </p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition ${
                timeRange === range
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex h-48 items-end justify-between gap-3 pt-6 pb-2">
          {data.map((item, idx) => {
            const heightPercent = Math.round((item.hours / maxVal) * 100);
            return (
              <div key={idx} className="group relative flex flex-1 flex-col items-center">
                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-9 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-md bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
                    {item.hours}h ({item.tasks} tasks)
                  </span>
                </div>

                <div className="relative flex h-40 w-full items-end justify-center rounded-xl bg-slate-100/60 p-1.5 dark:bg-slate-800/50">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[32px] rounded-lg bg-gradient-to-t from-indigo-600 to-blue-500 shadow-2xs transition-all duration-300 group-hover:brightness-110"
                  />
                </div>

                <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
