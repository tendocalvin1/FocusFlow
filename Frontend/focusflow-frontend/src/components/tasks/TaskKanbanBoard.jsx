import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskKanbanBoard({ tasks, onSelectTask, onAddTask, onMoveTask }) {
  const columns = [
    { key: "todo", title: "To Do", color: "bg-slate-500" },
    { key: "in_progress", title: "In Progress", color: "bg-blue-500" },
    { key: "in_review", title: "In Review", color: "bg-amber-500" },
    { key: "done", title: "Done", color: "bg-emerald-500" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center space-x-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {col.title}
                </h3>
                <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-2xs dark:bg-slate-800 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onAddTask(col.key)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Task List */}
            <div className="space-y-3 pt-1">
              {columnTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 dark:border-slate-800">
                  No tasks in {col.title.toLowerCase()}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={onSelectTask}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
