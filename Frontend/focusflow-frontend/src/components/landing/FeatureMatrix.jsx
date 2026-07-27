import { Target, CheckSquare, Clock, BarChart2, Flame, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureMatrix() {
  const features = [
    {
      title: "Strategic Goal Breakdown",
      desc: "Decompose long-term milestones into actionable sub-goals with live completion tracking.",
      icon: Target,
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
    },
    {
      title: "Priority Kanban Workflows",
      desc: "Visualize sprint tasks across To Do, In Progress, In Review, and Done columns with tag filtering.",
      icon: CheckSquare,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      title: "Pomodoro & Custom Focus Timers",
      desc: "Immerse yourself in deep work with animated circular countdown rings and ambient audio soundscapes.",
      icon: Clock,
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    },
    {
      title: "Activity Heatmaps & Analytics",
      desc: "Monitor focus velocity, domain time allocation, and daily consistency heatmaps over time.",
      icon: BarChart2,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    },
  ];

  return (
    <section className="py-16 bg-slate-100/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Engineered for Uninterrupted Execution
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Every feature is crafted to eliminate distraction and maximize flow state output.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xs transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
                <CardContent className="p-0 space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
