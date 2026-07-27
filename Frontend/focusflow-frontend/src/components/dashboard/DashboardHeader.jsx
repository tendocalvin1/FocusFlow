import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function DashboardHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Tendo 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's your productivity overview for today.
        </p>
      </div>

      <Button className="rounded-xl">
        <Plus className="mr-2 h-4 w-4" />
        New Goal
      </Button>
    </div>
  );
}

export default DashboardHeader;