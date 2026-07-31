import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function DashboardHeader() {
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm text-slate-500">{today}</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {greeting}, Tendo 👋
        </h1>

        <p className="mt-3 text-slate-500">
          Here's your productivity overview for today.
        </p>
      </div>

      <Button
        className="rounded-xl"
        onClick={() => navigate("/goals")}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Goal
      </Button>

    </div>
  );
}

export default DashboardHeader;