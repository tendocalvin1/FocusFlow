import { CheckCircle2, Circle, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { priorityBadgeClasses, tagBadgeClasses, taskStatuses } from "@/constants/taskConstants";

export default function TaskListContainer({ tasks, onSelectTask, onToggleStatus, onStatusChange }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900/90">
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.map((task) => {
          const isDone = task.status === "done";
          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <button
                  onClick={() => onToggleStatus(task.id)}
                  className="text-slate-400 hover:text-emerald-500 transition shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-50 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectTask(task)}>
                  <h4 className={`text-sm font-semibold truncate ${isDone ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100"}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 text-xs ml-4">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${priorityBadgeClasses[task.priority]}`}
                >
                  {task.priority}
                </Badge>

                <Badge
                  variant="outline"
                  className={`text-[10px] ${tagBadgeClasses[task.tag] || ""}`}
                >
                  {task.tag}
                </Badge>

                <div className="hidden sm:flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>{task.completed_sessions}/{task.estimated_sessions}</span>
                </div>

                <span className="hidden md:inline rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
                  {task.due_date}
                </span>

                <select
                  value={task.status}
                  onChange={(event) => onStatusChange(task.id, event.target.value)}
                  className="hidden rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 lg:block"
                >
                  {taskStatuses.map((status) => (
                    <option key={status.key} value={status.key}>
                      {status.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
