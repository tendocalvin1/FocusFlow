import { CheckCircle2, History } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SessionHistoryList() {
  const { history } = useFocusTimer();

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <History className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Session History
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Logged focus sessions for today
            </p>
          </div>
        </div>

        <Badge variant="outline" className="text-xs font-medium">
          {history.length} completed
        </Badge>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {history.map((session) => (
            <div key={session.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {session.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Completed at {session.completedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-[10px]">
                  {session.tag}
                </Badge>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {session.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
