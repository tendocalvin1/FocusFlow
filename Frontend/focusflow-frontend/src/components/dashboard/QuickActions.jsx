import { useNavigate } from "react-router-dom";

import {
    PlusCircle,
    ListTodo,
    PlayCircle,
    BarChart3,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import ActionCard from "../common/ActionCard";

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <Card className="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>
                    Quick Actions
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">

                    <ActionCard
                        icon={PlusCircle}
                        title="New Goal"
                        description="Create a new productivity goal."
                        onClick={() => navigate("/goals")}
                    />

                    <ActionCard
                        icon={ListTodo}
                        title="New Task"
                        description="Add today's next task."
                        onClick={() => navigate("/tasks")}
                    />

                    <ActionCard
                        icon={PlayCircle}
                        title="Start Focus Session"
                        description="Begin a Pomodoro session."
                        onClick={() => navigate("/focus")}
                    />

                    <ActionCard
                        icon={BarChart3}
                        title="Open Analytics"
                        description="Review your productivity."
                        onClick={() => navigate("/analytics")}
                    />

                </div>
            </CardContent>
        </Card>
    );
}