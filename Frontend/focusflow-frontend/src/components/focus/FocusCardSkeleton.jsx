export default function FocusCardSkeleton({ className = "h-64" }) {
  return (
    <div
      className={`${className} animate-pulse rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900`}
    />
  );
}
