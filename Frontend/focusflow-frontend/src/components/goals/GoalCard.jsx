import {
  Calendar,
  CheckSquare,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {categoryColors,priorityColors,statusColors,statusLabels} from "@/constants/goalConstants";



export default function GoalCard({ goal, onSelect }) {
  const completedSubGoals =
    goal.sub_goals?.filter((s) => s.completed).length || 0;

  const totalSubGoals = goal.sub_goals?.length || 0;

  return (
    <Card
      onClick={() => onSelect(goal)}
      className="
        group
        cursor-pointer
        rounded-2xl
        border
        border-slate-200/80
        bg-white/90
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:scale-[1.01]
        hover:shadow-lg
        dark:border-slate-800
        dark:bg-slate-900/90
      "
    >
      <CardContent className="space-y-5 p-0">

        {/* Top Row */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Badge
              variant="outline"
              className={categoryColors[goal.category]}
            >
              {goal.category}
            </Badge>

            <Badge
              variant="outline"
              className={priorityColors[goal.priority]}
            >
              {goal.priority}
            </Badge>

          </div>

          <div className="flex items-center gap-2">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                statusColors[goal.status]
              }`}
            />

            <span className="text-xs font-medium capitalize text-slate-500">

              {statusLabels[goal.status]}

            </span>

          </div>

        </div>

        {/* Title */}

        <div>

          <h3 className="text-lg font-bold transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">

            {goal.title}

          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">

            {goal.description}

          </p>

        </div>

        {/* Progress */}

        <div className="space-y-2">

          <div className="flex justify-between text-xs">

            <span className="text-slate-500">

              Progress

            </span>

            <span className="font-semibold">

              {goal.progress}% Complete

            </span>

          </div>

          <Progress
            value={goal.progress}
            className="h-2.5"
          />

        </div>

        {/* Footer */}

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">

          <div className="flex items-center justify-between text-xs text-slate-500">

            <div className="flex items-center gap-2">

              <CheckSquare className="h-4 w-4" />

              <span>

                {totalSubGoals > 0
                  ? `${completedSubGoals}/${totalSubGoals} Sub-goals`
                  : "No sub-goals"}

              </span>

            </div>

            <div className="flex items-center gap-2">

              <Calendar className="h-4 w-4" />

              <span>

                {goal.target_date}

              </span>

            </div>

          </div>

          <div className="mt-5 flex items-center justify-end text-sm font-medium text-indigo-600 transition group-hover:translate-x-1">

            View Details

            <ChevronRight className="ml-1 h-4 w-4" />

          </div>

        </div>

      </CardContent>

    </Card>
  );
}