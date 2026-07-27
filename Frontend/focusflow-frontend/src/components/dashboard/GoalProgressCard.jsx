import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

function GoalProgressCard() {
    const completedGoals = 3;
    const totalGoals = 5;

    const percentage = Math.round(
        (completedGoals / totalGoals) * 100
    );

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">

            <CardContent className="space-y-5 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-semibold">
                            Goal Progress
                        </h2>

                        <p className="text-sm text-slate-500">
                            Track today's goals.
                        </p>

                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">

                        <Target className="h-5 w-5 text-slate-700" />

                    </div>

                </div>

                <Progress
                    value={percentage}
                    className="h-3"
                />

                <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">

                        {completedGoals} of {totalGoals} completed

                    </span>

                    <span className="font-semibold">

                        {percentage}%

                    </span>

                </div>

            </CardContent>

        </Card>
    );
}

export default GoalProgressCard;