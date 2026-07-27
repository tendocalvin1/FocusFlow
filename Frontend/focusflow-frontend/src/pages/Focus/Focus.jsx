import { FocusTimerProvider } from "@/context/FocusTimerContext";
import FocusTimer from "@/components/focus/FocusTimer";
import AmbientSoundPlayer from "@/components/focus/AmbientSoundPlayer";
import SessionHistoryList from "@/components/focus/SessionHistoryList";
import { Clock } from "lucide-react";

export default function Focus() {
  return (
    <FocusTimerProvider>
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Focus Sessions & Soundscapes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Immerse yourself in deep work with customizable Pomodoro timers and ambient audio.
          </p>
        </div>

        {/* Top Grid: Timer & Sound player */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <FocusTimer />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <AmbientSoundPlayer />
            <SessionHistoryList />
          </div>
        </div>
      </div>
    </FocusTimerProvider>
  );
}