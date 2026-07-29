import {
  Settings,
  Clock,
  Coffee,
  Zap,
  Bell,
  Volume2,
  Repeat,
  PlayCircle,
} from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { defaultFocusSettings } from "@/constants/focusConstants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FocusCardSkeleton from "./FocusCardSkeleton";
import FocusErrorState from "./FocusErrorState";

function DurationField({
  icon: Icon,
  label,
  description,
  value,
  min,
  max,
  onChange,
  accent,
  id,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <Label
            htmlFor={id}
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            {label}
          </Label>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!Number.isNaN(val)) {
              onChange(Math.max(min, Math.min(max, val)));
            }
          }}
          className="h-9 w-20 rounded-xl text-center text-sm font-bold tabular-nums border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 focus-visible:ring-indigo-500"
          aria-label={`${label} in minutes`}
        />
        <span className="text-xs font-medium text-slate-400 w-6">min</span>
      </div>
    </div>
  );
}

function ToggleField({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  accent,
  id,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <Label
            htmlFor={id}
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
          >
            {label}
          </Label>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={label}
      />
    </div>
  );
}

export default function TimerSettingsCard({
  isLoading = false,
  error,
  onRetry,
}) {
  const { settings, updateSettings } = useFocusTimer();

  if (isLoading) return <FocusCardSkeleton className="h-[640px]" />;

  if (error) {
    return (
      <FocusErrorState
        message="Could not load timer settings."
        onRetry={onRetry}
      />
    );
  }

  const handleReset = () => {
    updateSettings(defaultFocusSettings);
  };

  return (
    <Card
      aria-labelledby="timer-settings-title"
      className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Settings className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <CardTitle
              id="timer-settings-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              Timer Settings
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize durations and auto-start behavior
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleReset}
          className="rounded-lg text-[11px] h-7 border-slate-200 dark:border-slate-800"
          aria-label="Reset timer settings to defaults"
        >
          Reset defaults
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-0">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
            Durations
          </p>
          <DurationField
            id="setting-pomodoro"
            icon={Clock}
            label="Pomodoro Duration"
            description="Deep focus work block length"
            value={settings.pomodoroMinutes}
            min={1}
            max={120}
            onChange={(val) => updateSettings({ pomodoroMinutes: val })}
            accent="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <DurationField
            id="setting-short-break"
            icon={Coffee}
            label="Short Break Duration"
            description="Quick recovery between pomodoros"
            value={settings.shortBreakMinutes}
            min={1}
            max={30}
            onChange={(val) => updateSettings({ shortBreakMinutes: val })}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <DurationField
            id="setting-long-break"
            icon={Zap}
            label="Long Break Duration"
            description="Extended recovery after 4 pomodoros"
            value={settings.longBreakMinutes}
            min={5}
            max={60}
            onChange={(val) => updateSettings({ longBreakMinutes: val })}
            accent="bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400"
          />
          <DurationField
            id="setting-custom"
            icon={PlayCircle}
            label="Custom Timer Default"
            description="Default length for custom focus blocks"
            value={settings.customMinutes}
            min={1}
            max={180}
            onChange={(val) => updateSettings({ customMinutes: val })}
            accent="bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400"
          />
        </div>

        <Separator className="my-5 bg-slate-100 dark:bg-slate-800" />

        <div className="space-y-0">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
            Automation
          </p>
          <ToggleField
            id="setting-auto-breaks"
            icon={Repeat}
            label="Auto-start Breaks"
            description="Start breaks immediately after pomodoro ends"
            checked={settings.autoStartBreaks}
            onChange={(val) => updateSettings({ autoStartBreaks: val })}
            accent="bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400"
          />
          <ToggleField
            id="setting-auto-next"
            icon={PlayCircle}
            label="Auto-start Next Session"
            description="Start next pomodoro right after a break"
            checked={settings.autoStartNextSession}
            onChange={(val) => updateSettings({ autoStartNextSession: val })}
            accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        <Separator className="my-5 bg-slate-100 dark:bg-slate-800" />

        <div className="space-y-0">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
            Alerts
          </p>
          <ToggleField
            id="setting-notifications"
            icon={Bell}
            label="Browser Notifications"
            description="Push alerts when sessions complete"
            checked={settings.notifications}
            onChange={(val) => updateSettings({ notifications: val })}
            accent="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          />
          <ToggleField
            id="setting-sound"
            icon={Volume2}
            label="Completion Sound"
            description="Play gentle chime when timer finishes"
            checked={settings.sound}
            onChange={(val) => updateSettings({ sound: val })}
            accent="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          />
        </div>
      </CardContent>
    </Card>
  );
}
