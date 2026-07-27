import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import GoalItem from "../common/GoalItem";

const goals = [

    {
        id: 1,
        title: "Backend Engineering",
        progress: 80,
        tasks: 5,
    },

    {
        id: 2,
        title: "AI Engineering",
        progress: 40,
        tasks: 3,
    },

    {
        id: 3,
        title: "Content Creation",
        progress: 65,
        tasks: 4,
    },

];

export default function TodaysGoals() {

    return (

        <Card className="rounded-2xl shadow-sm">

            <CardHeader>

                <CardTitle>

                    Today's Goals

                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="space-y-4">

                    {goals.map(goal => (

                        <GoalItem
                            key={goal.id}
                            {...goal}
                        />

                    ))}

                </div>

            </CardContent>

        </Card>

    );

}