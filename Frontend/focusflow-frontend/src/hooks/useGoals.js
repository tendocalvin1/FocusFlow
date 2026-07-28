import { useState } from "react";
import { mockGoals } from "@/data/mockGoals";

export function useGoals() {
    const [goals, setGoals] = useState(mockGoals);

    const addGoal = (goal) => {
        const newGoal = {
            id: Date.now(),
            progress: 0,
            status: "active",
            sub_goals: [],
            ...goal,
        };

        setGoals((prev) => [newGoal, ...prev]);
    };

    const updateGoal = (updatedGoal) => {
        setGoals((prev) =>
            prev.map((goal) =>
                goal.id === updatedGoal.id ? updatedGoal : goal
            )
        );
    };

    const deleteGoal = (id) => {
        setGoals((prev) =>
            prev.filter((goal) => goal.id !== id)
        );
    };

    return {
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
    };
}