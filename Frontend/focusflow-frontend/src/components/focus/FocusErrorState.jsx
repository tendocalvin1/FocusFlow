import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FocusErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <span>{message}</span>
      </div>
      <Button type="button" variant="outline" onClick={onRetry} className="rounded-xl">
        Retry
      </Button>
    </div>
  );
}
