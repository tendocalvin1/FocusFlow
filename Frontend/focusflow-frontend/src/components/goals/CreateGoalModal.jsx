import { useState, useEffect } from "react";
import { Target, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  goalCategories,
  goalPriorities,
} from "@/constants/goalConstants";

const defaultGoalForm = {
  title: "",
  description: "",
  category: "PERSONAL",
  priority: "MEDIUM",
  target_date: "",
};

function getInitialForm(goalToEdit) {
  if (!goalToEdit) return defaultGoalForm;

  return {
    title: goalToEdit.title || "",
    description: goalToEdit.description || "",
    category: goalToEdit.category || "PERSONAL",
    priority: goalToEdit.priority || "MEDIUM",
    target_date: goalToEdit.target_date || "",
  };
}

export default function GoalFormModal({
  open,
  onClose,
  onCreateGoal,
  goalToEdit,
  onUpdateGoal,
}) {
  const [formData, setFormData] = useState(defaultGoalForm);

  useEffect(() => {
    setFormData(getInitialForm(goalToEdit));
  }, [goalToEdit, open]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      target_date: formData.target_date,
    };

    if (goalToEdit) {
      onUpdateGoal(payload);
    } else {
      onCreateGoal(payload);
    }

    setFormData(defaultGoalForm);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Target className="h-5 w-5" />
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {goalToEdit ? "Edit Goal" : "Create Goal"}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {goalToEdit
                  ? "Update your goal details."
                  : "Create a new long-term goal."}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Title */}

          <div>

            <Label htmlFor="goal-title">
              Goal Title
            </Label>

            <Input
              id="goal-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Become Senior Backend Engineer"
              className="mt-2"
              required
            />

          </div>

          {/* Description */}

          <div>

            <Label htmlFor="goal-description">
              Description
            </Label>

            <Input
              id="goal-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your goal..."
              className="mt-2"
            />

          </div>

          {/* Category + Priority */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <Label htmlFor="goal-category">
                Category
              </Label>

              <select
                id="goal-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {goalCategories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <Label htmlFor="goal-priority">
                Priority
              </Label>

              <select
                id="goal-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-2 h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {goalPriorities.map((priority) => (
                  <option
                    key={priority.value}
                    value={priority.value}
                  >
                    {priority.label}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Target Date */}

          <div>

            <Label htmlFor="goal-target-date">
              Target Date
            </Label>

            <Input
              id="goal-target-date"
              type="date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className="mt-2"
              required
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-4">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {goalToEdit ? "Save Changes" : "Create Goal"}
            </Button>

          </div>

        </form>

      </div>
    </div>
  );
}