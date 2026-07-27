import { Clock, Tag, Flame, CheckCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TaskCard({ task, onSelect, onStatusChange }) {
  const priorityColors = {
    High: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900",
    Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900",
    Low: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  const tagColors = {
    Frontend: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    Backend: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    Design: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    DevOps: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  };

  return (
    <Card
      onClick={() => onSelect && onSelect(task)}
      className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
    >
      <CardContent className="p-0 space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-[10px] font-bold ${priorityColors[task.priority]}`}
          >
            {task.priority} Priority
          </Badge>

          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
              tagColors[task.tag] || "bg-slate-100 text-slate-700"
            }`}
          >
            {task.tag}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 transition line-clamp-1">
            {task.title}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Footer Meta: Focus Sessions & Due Date */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            <span>
              {task.completed_sessions}/{task.estimated_sessions} sessions
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{task.due_date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
