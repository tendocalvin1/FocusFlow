import { useState } from "react";
import { BarChart2, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WeeklyActivityChart() {
  const [metric, setMetric] = useState("hours"); // 'hours' | 'tasks'

  const weeklyData = [
    { day: "Mon", hours: 4.5, tasks: 6 },
    { day: "Tue", hours: 6.2, tasks: 9 },
    { day: "Wed", hours: 5.8, tasks: 8 },
    { day: "Thu", hours: 7.0, tasks: 11 },
    { day: "Fri", hours: 4.0, tasks: 5 },
    { day: "Sat", hours: 2.5, tasks: 3 },
    { day: "Sun", hours: 1.8, tasks: 2 },
  ];

  const maxHours = 8;
  const maxTasks = 12;

  const totalHours = weeklyData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);
  const totalTasks = weeklyData.reduce((acc, curr) => acc + curr.tasks, 0);

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Weekly Activity
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {metric === "hours" ? `${totalHours} total focus hours this week` : `${totalTasks} total tasks completed this week`}
            </p>
          </div>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setMetric("hours")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              metric === "hours"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Focus Hours
          </button>
          <button
            onClick={() => setMetric("tasks")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              metric === "tasks"
                ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Tasks Completed
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Custom Bar Chart Visualization */}
        <div className="flex h-44 items-end justify-between gap-2 pt-4 pb-2">
          {weeklyData.map((item) => {
            const value = metric === "hours" ? item.hours : item.tasks;
            const maxVal = metric === "hours" ? maxHours : maxTasks;
            const heightPercent = Math.min(100, Math.round((value / maxVal) * 100));
            const isPeak = item.day === "Thu";

            return (
              <div key={item.day} className="group relative flex flex-1 flex-col items-center">
                {/* Tooltip on Hover */}
                <div className="pointer-events-none absolute -top-10 opacity-0 transition-all duration-150 group-hover:-top-11 group-hover:opacity-100">
                  <div className="rounded-md bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md dark:bg-slate-100 dark:text-slate-900">
                    {metric === "hours" ? `${item.hours} hrs` : `${item.tasks} tasks`}
                  </div>
                </div>

                {/* Bar Container */}
                <div className="relative flex h-36 w-full items-end justify-center rounded-lg bg-slate-100/60 p-1 dark:bg-slate-800/50">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-md transition-all duration-300 group-hover:brightness-110 ${
                      isPeak
                        ? "bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm"
                        : "bg-gradient-to-t from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600"
                    }`}
                  />
                </div>

                {/* Label */}
                <span className={`mt-2 text-xs font-medium ${isPeak ? "font-semibold text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
