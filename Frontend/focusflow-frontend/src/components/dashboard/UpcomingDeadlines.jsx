import { useState } from "react";
import { CalendarAlert, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UpcomingDeadlines() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Submit DRF Backend Architecture Spec",
      type: "Task",
      dueDate: "Today, 5:00 PM",
      urgency: "urgent", // 'urgent' | 'warning' | 'normal'
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Complete Frontend UI Polish & Audit",
      type: "Goal",
      dueDate: "Tomorrow",
      urgency: "warning",
      priority: "High",
      completed: false,
    },
    {
      id: 3,
      title: "Design System Tokens Sync",
      type: "Task",
      dueDate: "In 2 days",
      urgency: "normal",
      priority: "Medium",
      completed: false,
    },
  ]);

  const toggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <CalendarAlert className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Upcoming Deadlines
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tasks and goals requiring attention
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400">
          View All <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between rounded-xl border p-3 transition duration-150 ${
              item.completed
                ? "border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-900/40"
                : "border-slate-200/70 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleComplete(item.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition hover:border-emerald-500 hover:text-emerald-500 dark:border-slate-700"
              >
                {item.completed && <CheckCircle className="h-5 w-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />}
              </button>

              <div>
                <p className={`text-sm font-medium ${item.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100"}`}>
                  {item.title}
                </p>

                <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" /> {item.dueDate}
                  </span>
                  <span>•</span>
                  <span>{item.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  item.urgency === "urgent"
                    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                    : item.urgency === "warning"
                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {item.priority}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
