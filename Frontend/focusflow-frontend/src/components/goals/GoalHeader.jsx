import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function GoalHeader() {
    return (
        <div className="mb-8 flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold">
                    Goals
                </h1>

                <p className="mt-2 text-slate-500">
                    Organize your long-term objectives.
                </p>

            </div>

            <Button className="rounded-xl">

                <Plus className="mr-2 h-4 w-4"/>

                New Goal

            </Button>

        </div>
    );
}