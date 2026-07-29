import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { focusModes } from "@/constants/focusConstants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function FocusTimer({ isLoading = false }) {
  const {
    mode,
    duration,
    timeLeft,
    isActive,
    hasStarted,
    sessionTitle,
    setSessionTitle,
    changeMode,
    pauseTimer,
    resetTimer,
    resumeTimer,
    skipBreak,
    startTimer,
  } = useFocusTimer();

  if (isLoading) {
    return (
      <div className="h-[560px] animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900" />
    );
  }

  const { minutes, seconds } = formatTime(timeLeft);
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const radius = 116;
  const circumference = 2 * Math.PI * radius;
  const currentMode = focusModes.find((item) => item.id === mode);
  const isBreak = mode === "shortBreak" || mode === "longBreak";
  const primaryLabel = isActive ? "Pause" : hasStarted ? "Resume" : "Start";

  const handlePrimaryAction = () => {
    if (isActive) {
      pauseTimer();
      return;
    }

    if (hasStarted) {
      resumeTimer();
      return;
    }

    startTimer();
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-center shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6">
        <div
          className="flex w-full flex-wrap justify-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
          role="tablist"
          aria-label="Timer mode"
        >
          {focusModes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => changeMode(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                mode === item.id
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              {item.shortLabel}
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm">
          <Input
            aria-label="Current focus session title"
            type="text"
            value={sessionTitle}
            onChange={(event) => setSessionTitle(event.target.value)}
            placeholder="What are you focusing on?"
            className="h-10 rounded-xl border-transparent text-center text-sm font-medium hover:border-slate-200 focus-visible:ring-indigo-500 dark:border-transparent dark:hover:border-slate-800"
          />
        </div>

        <div className="relative flex items-center justify-center py-2">
          <svg className="h-72 w-72 -rotate-90 sm:h-80 sm:w-80" viewBox="0 0 280 280">
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="12"
              fill="transparent"
            />
            <motion.circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeLinecap="round"
              fill="transparent"
              animate={{ strokeDashoffset: circumference - progress * circumference }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {currentMode?.label}
            </span>
            <div className="mt-3 flex items-baseline font-mono text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              <span>{minutes}</span>
              <span className="mx-1 text-slate-300 dark:text-slate-700">:</span>
              <span>{seconds}</span>
            </div>
            <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isActive ? "Running" : hasStarted ? "Paused" : "Ready"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={resetTimer}
            aria-label="Reset timer"
            className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            onClick={handlePrimaryAction}
            aria-label={`${primaryLabel} timer`}
            className={`h-14 rounded-2xl px-8 text-base font-bold shadow-md ${
              isActive
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            }`}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            {primaryLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={isBreak ? skipBreak : resetTimer}
            aria-label={isBreak ? "Skip break" : "Restart current timer"}
            className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
