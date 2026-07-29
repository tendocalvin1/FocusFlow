import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { focusModes } from "@/constants/focusConstants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FocusCardSkeleton from "./FocusCardSkeleton";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function TimerModeSelector({ mode, onChange }) {
  return (
    <div
      className="flex w-full flex-wrap justify-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
      role="tablist"
      aria-label="Timer mode selector"
    >
      {focusModes.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={mode === item.id}
          onClick={() => onChange(item.id)}
          className={`flex-1 min-w-[70px] rounded-lg px-2 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
            mode === item.id
              ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-700/50"
          }`}
        >
          <span className="block text-[11px] sm:text-xs">{item.shortLabel}</span>
          <span className="block mt-0.5 text-[9px] sm:text-[10px] font-normal text-slate-400 dark:text-slate-500">
            {mode === item.id && item.description}
          </span>
        </button>
      ))}
    </div>
  );
}

function CircularProgress({ progress, mode, children }) {
  const radius = 116;
  const circumference = 2 * Math.PI * radius;
  const isBreak = mode === "shortBreak" || mode === "longBreak";

  return (
    <div className="relative flex items-center justify-center py-2">
      <svg
        className="h-64 w-64 -rotate-90 sm:h-72 sm:w-72 md:h-80 md:w-80" viewBox="0 0 280 280"
        aria-hidden="true"
      >
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
          className={isBreak
            ? "stroke-emerald-500 dark:stroke-emerald-400"
            : "stroke-indigo-600 dark:stroke-indigo-400"
          }
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          animate={{ strokeDashoffset: circumference - progress * circumference }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}

function TimerControls({
  isActive,
  hasStarted,
  isBreak,
  onPrimaryAction,
  onReset,
  onSkip,
}) {
  const primaryLabel = isActive ? "Pause" : hasStarted ? "Resume" : "Start";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onClick={onReset}
        aria-label="Reset timer"
        className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      <Button
        type="button"
        onClick={onPrimaryAction}
        aria-label={`${primaryLabel} timer`}
        className={`h-14 rounded-2xl px-6 sm:px-8 text-base font-bold shadow-md transition-all hover:shadow-lg active:scale-[0.98] ${
          isActive
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : isBreak
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        }`}
      >
        {isActive ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 fill-current" />
        )}
        <span className="hidden sm:inline ml-1.5">{primaryLabel}</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        onClick={onSkip}
        aria-label={isBreak ? "Skip break and start focus" : "Restart timer"}
        title={isBreak ? "Skip break" : "Restart"}
        className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
      >
        <SkipForward className="h-5 w-5" />
      </Button>
    </div>
  );
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
    return <FocusCardSkeleton className="h-[600px]" />;
  }

  const { minutes, seconds } = formatTime(timeLeft);
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;
  const currentMode = focusModes.find((item) => item.id === mode);
  const isBreak = mode === "shortBreak" || mode === "longBreak";

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

  const handleSkip = () => {
    if (isBreak) {
      skipBreak();
    } else {
      resetTimer();
    }
  };

  return (
    <section
      aria-labelledby="focus-timer-card"
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-center shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent dark:via-indigo-400/30 opacity-60" />

      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6">
        <TimerModeSelector mode={mode} onChange={changeMode} />

        <div className="w-full max-w-sm">
          <Input
          aria-label="Current focus session title"
          type="text"
          value={sessionTitle}
          onChange={(event) => setSessionTitle(event.target.value)}
          placeholder="What are you focusing on?"
          className="h-11 rounded-xl border-transparent text-center text-sm font-medium hover:border-slate-200 focus-visible:ring-indigo-500 dark:border-transparent dark:hover:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
        />
        </div>

        <CircularProgress progress={progress} mode={mode}>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isBreak
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {currentMode?.label}
          </span>
          <div
            className="mt-3 flex items-baseline font-mono text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl sm:text-7xl tabular-nums">
            <motion.span
              key={minutes}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {minutes}
            </motion.span>
            <span className="mx-1 text-slate-300 dark:text-slate-700 animate-pulse">
              :
            </span>
            <motion.span
              key={seconds}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {seconds}
            </motion.span>
          </div>
          <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {isActive ? "Running" : hasStarted ? "Paused" : "Ready to focus"}
          </span>
        </CircularProgress>

        <TimerControls
          isActive={isActive}
          hasStarted={hasStarted}
          isBreak={isBreak}
          onPrimaryAction={handlePrimaryAction}
          onReset={resetTimer}
          onSkip={handleSkip}
        />
      </div>
    </section>
  );
}
