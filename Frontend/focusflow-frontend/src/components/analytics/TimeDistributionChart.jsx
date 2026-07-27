import { PieChart, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockAnalyticsData } from "@/services/analyticsService";

export default function TimeDistributionChart() {
  const categories = mockAnalyticsData.categoryDistribution;

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <PieChart className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Domain Allocation
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Focus time breakdown by domain
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Stacked Percentage Bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${cat.percentage}%` }}
              className={`${cat.color} transition-all duration-300`}
              title={`${cat.category}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Category List */}
        <div className="space-y-3 pt-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`h-2.5 w-2.5 rounded-full ${cat.color}`} />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {cat.category}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
                <span>{cat.hours}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
