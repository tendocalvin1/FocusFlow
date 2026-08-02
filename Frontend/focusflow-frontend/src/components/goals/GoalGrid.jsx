import { useEffect, useState } from "react";
import GoalCard from "./GoalCard";
import { goalsService } from "@/services/goalsService";

export default function GoalGrid() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGoals();
    }, []);

    async function loadGoals() {
        try {
            const data = await goalsService.getGoals();
            setGoals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <p className="text-slate-500">
                Loading goals...
            </p>
        );
    }

    if (!goals.length) {
        return (
            <p className="text-slate-500">
                No goals yet.
            </p>
        );
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
                <GoalCard
                    key={goal.id}
                    {...goal}
                />
            ))}
        </div>
    );
}