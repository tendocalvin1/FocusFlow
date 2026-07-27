import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export default function GoalItem({
    title,
    progress,
    tasks,
}) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-slate-100 p-3">
                        <Target size={18} />
                    </div>

                    <div>

                        <h3 className="font-semibold">
                            {title}
                        </h3>

                        <p className="text-sm text-slate-500">
                            {tasks} Tasks
                        </p>

                    </div>

                </div>

                <span className="font-semibold text-slate-700">
                    {progress}%
                </span>

            </div>

            <Progress
                value={progress}
                className="mt-5 h-2"
            />

        </div>
    );
}