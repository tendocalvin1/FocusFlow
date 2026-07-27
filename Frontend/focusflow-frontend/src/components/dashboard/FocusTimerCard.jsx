import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function FocusTimerCard() {
    return (
        <Card className="rounded-2xl shadow-sm">

            <CardHeader>
                <CardTitle className="text-lg">
                    Focus Session
                </CardTitle>
            </CardHeader>

            <CardContent>

                <div className="flex flex-col items-center justify-center py-8">

                    <p className="text-6xl font-bold tracking-tight">
                        25:00
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Pomodoro Session
                    </p>

                    <div className="mt-8 flex gap-3">

                        <Button size="icon" className="rounded-xl">
                            <Play size={18}/>
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                        >
                            <Pause size={18}/>
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                        >
                            <RotateCcw size={18}/>
                        </Button>

                    </div>

                </div>

            </CardContent>

        </Card>
    );
}