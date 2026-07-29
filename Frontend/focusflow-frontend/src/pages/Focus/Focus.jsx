import { FocusTimerProvider } from "@/context/FocusTimerContext";
import FocusTimer from "@/components/focus/FocusTimer";
import AmbientSoundPlayer from "@/components/focus/AmbientSoundPlayer";
import SessionHistoryCard from "@/components/focus/SessionHistoryCard";
import FocusStatsCard from "@/components/focus/FocusStatsCard";
import TimerSettingsCard from "@/components/focus/TimerSettingsCard";
import TodayFocusSummaryCard from "@/components/focus/TodayFocusSummaryCard";
import { Clock, Sparkles } from "lucide-react";

export default function Focus() {
  return (
    <FocusTimerProvider>
      <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 sm:px-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Focus
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Sparkles className="h-3 w-3" />
                Deep work
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Structured Pomodoro sessions, ambient soundscapes, and focus
              tracking. Build your deep work muscle with measurable sessions.
            </p>
          </div>
        </div>

        <TodayFocusSummaryCard />

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <FocusTimer />
            <FocusStatsCard />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <AmbientSoundPlayer />
            <SessionHistoryCard
              title="Today's Sessions"
              subtitle="What you've accomplished today"
              showTodayOnly={true}
            />
            <SessionHistoryCard
              title="Recent History"
              subtitle="All sessions from the past days"
              limit={8}
            />
            <TimerSettingsCard />
          </div>
        </div>
      </div>
    </FocusTimerProvider>
  );
}
