import * as React from "react";
import {
  History,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import { useFocusTimer } from "@/context/FocusTimerContext";
import {
  focusModeLabels,
  focusStatusLabels,
} from "@/constants/focusConstants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FocusCardSkeleton from "./FocusCardSkeleton";
import FocusErrorState from "./FocusErrorState";
import FocusEmptyState from "./FocusEmptyState";

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(dateStr + "T00:00:00");

  if (targetDate.getTime() === today.getTime()) return "Today";
  if (targetDate.getTime() === yesterday.getTime()) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function getStatusIcon(status) {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "skipped":
      return XCircle;
    case "interrupted":
      return AlertCircle;
    default:
      return Clock;
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900";
    case "skipped":
      return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:ring-slate-800";
    case "interrupted":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-900";
    default:
      return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

function getModeBadge(mode) {
  switch (mode) {
    case "pomodoro":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:ring-indigo-900";
    case "shortBreak":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900";
    case "longBreak":
      return "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:ring-teal-900";
    case "custom":
      return "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:ring-violet-900";
    default:
      return "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
}

function SessionRow({ session, index }) {
  const statusClass = getStatusBadge(session.status);
  const modeClass = getModeBadge(session.mode);
  const statusIconConfig = getStatusIcon(session.status);

  return (
    <div
      className="group flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between first:pt-0 last:pb-0"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-start gap-3 sm:items-center min-w-0">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            session.status === "completed"
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              : session.status === "skipped"
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          }`}
        >
          {React.createElement(statusIconConfig, {
            className: "h-4.5 w-4.5",
            strokeWidth: 2,
          })}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {session.title}
            </h4>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(session.date)}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.completedAt}
            </span>
            {session.tag && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {session.tag}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 pl-12 sm:pl-0">
        <Badge
          variant="outline"
          className={`rounded-full border-0 py-0.5 text-[10px] font-semibold ${modeClass}`}
        >
          {focusModeLabels[session.mode] || "Custom"}
        </Badge>
        <Badge
          variant="outline"
          className={`rounded-full border-0 py-0.5 text-[10px] font-semibold capitalize ${statusClass}`}
        >
          {focusStatusLabels[session.status] || session.status}
        </Badge>
        <span className="min-w-[52px] text-right text-sm font-bold tabular-nums text-slate-700 dark:text-slate-300">
          {session.durationMinutes ||
            parseInt(session.duration, 10) ||
            25}{" "}
          min
        </span>
      </div>
    </div>
  );
}

export default function SessionHistoryCard({
  isLoading = false,
  error,
  onRetry,
  limit,
  title = "Session History",
  subtitle = "All logged focus sessions",
  showTodayOnly = false,
}) {
  const { history, todaySessions } = useFocusTimer();

  const sessions = React.useMemo(() => {
    const list = showTodayOnly ? todaySessions : history;
    return limit ? list.slice(0, limit) : list;
  }, [history, todaySessions, showTodayOnly, limit]);

  if (isLoading) return <FocusCardSkeleton className="h-[400px]" />;

  if (error) {
    return (
      <FocusErrorState
        message="Could not load session history."
        onRetry={onRetry}
      />
    );
  }

  return (
    <Card
      aria-labelledby="session-history-title"
      className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <History className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <CardTitle
              id="session-history-title"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {title}
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
        >
          {sessions.length} total
        </Badge>
      </CardHeader>

      <CardContent className="pt-1">
        {sessions.length === 0 ? (
          <FocusEmptyState
            title={showTodayOnly ? "No sessions today" : "No history yet"}
            description={
              showTodayOnly
                ? "Start a focus session above to log your first deep work block of the day."
                : "Complete your first focus session. Your session log will appear here to track your progress."
            }
          />
        ) : (
          <div
            role="list"
            aria-label="Focus sessions"
            className="divide-y divide-slate-100 dark:divide-slate-800"
          >
            {sessions.map((session, index) => (
              <div key={session.id} role="listitem">
                <SessionRow session={session} index={index} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
