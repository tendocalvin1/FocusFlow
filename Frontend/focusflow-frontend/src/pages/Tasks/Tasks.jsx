import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckSquare, LayoutGrid, List, Plus, Search } from "lucide-react";
import { tasksService } from "@/services/tasksService";
import TaskKanbanBoard from "@/components/tasks/TaskKanbanBoard";
import TaskListContainer from "@/components/tasks/TaskListContainer";
import TaskModal from "@/components/tasks/TaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { taskPriorities, taskStatuses, taskTags } from "@/constants/taskConstants";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    tasksService
      .getTasks()
      .then((data) => {
        if (isMounted) setTasks(data);
      })
      .catch(() => {
        if (isMounted) setError("Tasks could not be loaded from mock data.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const normalizedSearch = searchQuery.toLowerCase();
      const matchesSearch =
        t.title.toLowerCase().includes(normalizedSearch) ||
        t.description.toLowerCase().includes(normalizedSearch);
      const matchesTag = selectedTag === "All" || t.tag === selectedTag;
      const matchesPriority =
        selectedPriority === "All" || t.priority === selectedPriority;
      const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;

      return matchesSearch && matchesTag && matchesPriority && matchesStatus;
    });
  }, [searchQuery, selectedPriority, selectedStatus, selectedTag, tasks]);

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

  const handleStatusChange = (taskId, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setTaskToEdit(null);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
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
            {taskTags.map((t) => (
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

          <select
            value={selectedPriority}
            onChange={(event) => setSelectedPriority(event.target.value)}
            className="h-8 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority === "All" ? "All priorities" : `${priority} priority`}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="h-8 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="All">All statuses</option>
            {taskStatuses.map((status) => (
              <option key={status.key} value={status.key}>
                {status.title}
              </option>
            ))}
          </select>
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

      {error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-10 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <CheckSquare className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100">
            No tasks found
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Clear a filter or create a task to keep the workflow moving.
          </p>
          <Button onClick={() => handleOpenNewTask("todo")} className="mt-5 rounded-xl">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      ) : viewMode === "kanban" ? (
        <TaskKanbanBoard
          tasks={filteredTasks}
          onSelectTask={handleSelectTaskToEdit}
          onAddTask={handleOpenNewTask}
          onMoveTask={handleStatusChange}
        />
      ) : (
        <TaskListContainer
          tasks={filteredTasks}
          onSelectTask={handleSelectTaskToEdit}
          onToggleStatus={handleToggleStatus}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          key={taskToEdit?.id || `new-${defaultStatus}`}
          open={isModalOpen}
          onClose={handleCloseModal}
          onDeleteTask={handleDeleteTask}
          onSaveTask={handleSaveTask}
          taskToEdit={taskToEdit}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );
}
