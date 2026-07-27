import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Finish React Dashboard",
    completed: true,
    priority: "High",
  },
  {
    id: 2,
    title: "Deploy Backend",
    completed: true,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Read AI Engineering Chapter",
    completed: false,
    priority: "Medium",
  },
  {
    id: 4,
    title: "Exercise",
    completed: false,
    priority: "Low",
  },
];

function priorityColor(priority) {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
}

export default function TaskListCard() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          Today's Tasks
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {tasks.map((task) => (

          <div
            key={task.id}
            className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-slate-50 hover:shadow-sm cursor-pointer"
          >

            <div className="flex items-center gap-3">

              {task.completed ? (
                <CheckCircle2 className="text-green-600" size={20} />
              ) : (
                <Circle className="text-slate-400" size={20} />
              )}

              <span
                className={`text-sm ${
                  task.completed
                    ? "line-through text-slate-400"
                    : "text-slate-700"
                }`}
              >
                {task.title}
              </span>

            </div>

            <Badge
            variant="secondary"
            className={`${priorityColor(task.priority)} px-3 py-1 rounded-full`}>
              {task.priority}
            </Badge>

          </div>

        ))}

      </CardContent>
    </Card>
  );
}