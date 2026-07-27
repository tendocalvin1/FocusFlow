import { Play, Pause, RotateCcw, SkipForward, Flame } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FocusTimer() {
  const {
    mode,
    duration,
    timeLeft,
    isActive,
    sessionCount,
    sessionTitle,
    setSessionTitle,
    changeMode,
    toggleTimer,
    resetTimer,
  } = useFocusTimer();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const progressPercent = Math.round(((duration - timeLeft) / duration) * 100);

  // SVG Circular progress math
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 text-center space-y-6">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        <button
          onClick={() => changeMode("pomodoro", 25)}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
            mode === "pomodoro"
              ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => changeMode("shortBreak", 5)}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
            mode === "shortBreak"
              ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Short Break (5m)
        </button>
        <button
          onClick={() => changeMode("longBreak", 15)}
          className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
            mode === "longBreak"
              ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* Editable Session Title Input */}
      <div className="w-full max-w-sm">
        <Input
          type="text"
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
          placeholder="What are you focusing on?"
          className="text-center font-medium border-transparent hover:border-slate-200 focus-visible:ring-indigo-500 text-sm dark:border-transparent dark:hover:border-slate-800"
        />
      </div>

      {/* Animated Circular SVG Timer Ring */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="h-64 w-64 -rotate-90 transform">
          {/* Background Track Circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-500 ease-linear"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-mono">
            {formattedTime}
          </span>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isActive ? "Session in progress" : "Paused"}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          onClick={resetTimer}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>

        <Button
          onClick={toggleTimer}
          size="lg"
          className={`h-14 px-8 rounded-2xl font-bold text-base shadow-md transition ${
            isActive
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="mr-2 h-5 w-5 fill-current" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5 fill-current" /> Start Focus
            </>
          )}
        </Button>

        <Button
          onClick={() => changeMode(mode, duration / 60)}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Streak / Session Counter Footer */}
      <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <span>Completed {sessionCount} focus sessions today</span>
      </div>
    </div>
  );
}
