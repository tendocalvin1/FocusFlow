import { Sparkles, TrendingUp, Clock, Zap, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductivityInsights() {
  const insights = [
    {
      icon: Clock,
      title: "Peak Focus Window",
      value: "9:00 AM – 11:30 AM",
      desc: "Your deepest focus sessions occur during morning hours.",
      highlight: "+24% output",
    },
    {
      icon: Zap,
      title: "Efficiency Rating",
      value: "94 / 100",
      desc: "Based on task completions vs. context switching.",
      highlight: "Top 5% user",
    },
    {
      icon: TrendingUp,
      title: "Weekly Growth",
      value: "+4.5 hrs",
      desc: "More deep work hours completed compared to last week.",
      highlight: "Streak active",
    },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Productivity Insights
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized performance metrics & habits
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-indigo-200 bg-indigo-50/50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300">
          Updated Today
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid gap-3 sm:grid-cols-3">
          {insights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    {item.highlight}
                    <ArrowUpRight className="ml-0.5 h-3 w-3" />
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {item.title}
                  </span>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {item.value}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
