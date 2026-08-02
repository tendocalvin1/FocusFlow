import { useEffect, useState } from "react";

import GoalHeader from "@/components/goals/GoalHeader";
import GoalGrid from "@/components/goals/GoalGrid";
import GoalFormModal from "@/components/goals/CreateGoalModal";
import GoalDetailDrawer from "@/components/goals/GoalDetailDrawer";

import { goalsService } from "@/services/goalsService";

export default function Goals() {
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedGoal, setSelectedGoal] = useState(null);

  const [goalModalOpen, setGoalModalOpen] = useState(false);

  const [goalToEdit, setGoalToEdit] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      setLoading(true);

      const data = await goalsService.getGoals();

      setGoals(data);
    } catch (error) {
      console.error("Failed to load goals", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateGoal(payload) {
    try {
      const createdGoal = await goalsService.createGoal(payload);

      setGoals((prev) => [createdGoal, ...prev]);

      setGoalModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateGoal(payload) {
    try {
      const updatedGoal = await goalsService.updateGoal(
        goalToEdit.id,
        payload
      );

      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === updatedGoal.id ? updatedGoal : goal
        )
      );

      setSelectedGoal(updatedGoal);

      setGoalToEdit(null);

      setGoalModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteGoal(id) {
    try {
      await goalsService.deleteGoal(id);

      setGoals((prev) =>
        prev.filter((goal) => goal.id !== id)
      );

      setSelectedGoal(null);
    } catch (error) {
      console.error(error);
    }
  }

  function handleOpenCreateModal() {
    setGoalToEdit(null);

    setGoalModalOpen(true);
  }

  function handleOpenEditModal(goal) {
    setGoalToEdit(goal);

    setGoalModalOpen(true);
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading goals...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <GoalHeader
        onCreateGoal={handleOpenCreateModal}
      />

      <GoalGrid
        goals={goals}
        onSelectGoal={setSelectedGoal}
      />

      <GoalFormModal
        open={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
        onCreateGoal={handleCreateGoal}
        onUpdateGoal={handleUpdateGoal}
      />

      <GoalDetailDrawer
        goal={selectedGoal}
        open={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        onDeleteGoal={handleDeleteGoal}
        onEditGoal={handleOpenEditModal}
      />

    </div>
  );
}