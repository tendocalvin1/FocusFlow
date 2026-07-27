import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Play } from "lucide-react";

function FocusTimerCard() {
    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm">

            <CardContent className="flex flex-col items-center justify-center p-8">

                <div className="mb-4 rounded-full bg-slate-100 p-4">

                    <Timer
                        size={28}
                        className="text-slate-700"
                    />

                </div>

                <h2 className="text-lg font-semibold">

                    Focus Session

                </h2>

                <p className="mt-2 text-6xl font-bold tracking-tight">

                    25:00

                </p>

                <p className="mt-3 text-sm text-slate-500">

                    Ready to enter deep work?

                </p>

                <Button
                    className="mt-8 w-full rounded-xl"
                >

                    <Play className="mr-2 h-4 w-4" />

                    Start Focus Session

                </Button>

            </CardContent>

        </Card>
    );
}

export default FocusTimerCard;