import { BarChart2 } from "lucide-react";
import WeeklySummaryCard from "@/components/analytics/WeeklySummaryCard";
import ProductivityTrendChart from "@/components/analytics/ProductivityTrendChart";
import TimeDistributionChart from "@/components/analytics/TimeDistributionChart";
import ProductivityHeatmap from "@/components/analytics/ProductivityHeatmap";

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Performance & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          In-depth insights into your productivity patterns, domain allocation, and focus velocity.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <WeeklySummaryCard />

      {/* Grid Row: Productivity Velocity + Domain Allocation */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProductivityTrendChart />
        </div>
        <div className="lg:col-span-4">
          <TimeDistributionChart />
        </div>
      </div>

      {/* Focus Activity Heatmap */}
      <ProductivityHeatmap />
    </div>
  );
}