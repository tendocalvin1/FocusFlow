import { useState } from "react";
import { CheckSquare, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taskStatuses, taskTags } from "@/constants/taskConstants";

function getInitialTaskForm(taskToEdit, defaultStatus) {
  return {
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    priority: taskToEdit?.priority || "Medium",
    tag: taskToEdit?.tag || "Frontend",
    status: taskToEdit?.status || defaultStatus,
    estimatedSessions: taskToEdit?.estimated_sessions || 2,
    dueDate: taskToEdit?.due_date || "2026-07-30",
  };
}

export default function TaskModal({
  open,
  onClose,
  onDeleteTask,
  onSaveTask,
  taskToEdit,
  defaultStatus = "todo",
}) {
  const initialForm = getInitialTaskForm(taskToEdit, defaultStatus);
  const [title, setTitle] = useState(initialForm.title);
  const [description, setDescription] = useState(initialForm.description);
  const [priority, setPriority] = useState(initialForm.priority);
  const [tag, setTag] = useState(initialForm.tag);
  const [status, setStatus] = useState(initialForm.status);
  const [estimatedSessions, setEstimatedSessions] = useState(initialForm.estimatedSessions);
  const [dueDate, setDueDate] = useState(initialForm.dueDate);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      id: taskToEdit ? taskToEdit.id : Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      tag,
      status,
      estimated_sessions: Number(estimatedSessions),
      completed_sessions: taskToEdit ? taskToEdit.completed_sessions : 0,
      due_date: dueDate,
    };

    onSaveTask(taskData);
    onClose();
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    onDeleteTask(taskToEdit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {taskToEdit ? "Edit Task" : "Create New Task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Implement DRF JWT token interceptor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </Label>
            <Input
              id="task-desc"
              placeholder="Context or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tag / Domain
              </Label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {taskTags
                  .filter((taskTag) => taskTag !== "All")
                  .map((taskTag) => (
                    <option key={taskTag} value={taskTag}>
                      {taskTag}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {taskStatuses.map((taskStatus) => (
                  <option key={taskStatus.key} value={taskStatus.key}>
                    {taskStatus.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Est. Focus Sessions
              </Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={estimatedSessions}
                onChange={(e) => setEstimatedSessions(e.target.value)}
                className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-due-date" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Due Date
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
            />
          </div>

          {showDeleteConfirm && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              Confirm deletion to remove this task from the mock workspace.
            </p>
          )}

          <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-between">
            {taskToEdit ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="rounded-xl text-xs font-medium"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {showDeleteConfirm ? "Confirm Delete" : "Delete Task"}
              </Button>
            ) : (
              <span />
            )}

            <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-slate-200 text-xs font-medium dark:border-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {taskToEdit ? "Save Changes" : "Create Task"}
            </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
