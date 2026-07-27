import { useState, useEffect } from "react";
import { CheckSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TaskModal({ open, onClose, onSaveTask, taskToEdit, defaultStatus = "todo" }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tag, setTag] = useState("Frontend");
  const [status, setStatus] = useState(defaultStatus);
  const [estimatedSessions, setEstimatedSessions] = useState(2);
  const [dueDate, setDueDate] = useState("2026-07-30");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setTag(taskToEdit.tag);
      setStatus(taskToEdit.status);
      setEstimatedSessions(taskToEdit.estimated_sessions);
      setDueDate(taskToEdit.due_date);
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setTag("Frontend");
      setStatus(defaultStatus);
      setEstimatedSessions(2);
    }
  }, [taskToEdit, defaultStatus, open]);

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
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
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
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
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

          <div className="flex justify-end space-x-2 pt-4">
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
        </form>
      </div>
    </div>
  );
}
