import { Inbox } from "lucide-react";

export default function FocusEmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <Inbox className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
