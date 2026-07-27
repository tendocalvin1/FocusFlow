import { useState } from "react";
import { Plus, CheckSquare, LayoutGrid, List, Search, Filter } from "lucide-react";
import { initialTasks } from "@/services/tasksService";
import TaskKanbanBoard from "@/components/tasks/TaskKanbanBoard";
import TaskListContainer from "@/components/tasks/TaskListContainer";
import TaskModal from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  const tags = ["All", "Frontend", "Backend", "Design", "DevOps"];
  const priorities = ["All", "High", "Medium", "Low"];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || t.tag === selectedTag;
    const matchesPriority = selectedPriority === "All" || t.priority === selectedPriority;
    return matchesSearch && matchesTag && matchesPriority;
  });

  const handleSaveTask = (savedTask) => {
    if (taskToEdit) {
      setTasks((prev) => prev.map((t) => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks((prev) => [savedTask, ...prev]);
    }
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === "done" ? "in_progress" : "done";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleOpenNewTask = (colStatus = "todo") => {
    setTaskToEdit(null);
    setDefaultStatus(colStatus);
    setIsModalOpen(true);
  };

  const handleSelectTaskToEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Task Workflows
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage sprint tasks, track focus sessions, and monitor completion states.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List View</span>
            </button>
          </div>

          <Button
            onClick={() => handleOpenNewTask("todo")}
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 font-semibold gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Tag Filter Pills */}
          <div className="flex items-center space-x-1">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(t)}
                className={`rounded-xl px-3 py-1 text-xs font-medium transition ${
                  selectedTag === t
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl border-slate-200/80 bg-white dark:border-slate-800 text-xs"
          />
        </div>
      </div>

      {/* Active View */}
      {viewMode === "kanban" ? (
        <TaskKanbanBoard
          tasks={filteredTasks}
          onSelectTask={handleSelectTaskToEdit}
          onAddTask={handleOpenNewTask}
        />
      ) : (
        <TaskListContainer
          tasks={filteredTasks}
          onSelectTask={handleSelectTaskToEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}