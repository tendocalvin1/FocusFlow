import * as React from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...props
}) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = React.useCallback(() => {
    if (disabled) return;
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onCheckedChange?.(newValue);
  }, [disabled, isChecked, isControlled, onCheckedChange]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isChecked
          ? "bg-indigo-600 dark:bg-indigo-500"
          : "bg-slate-200 dark:bg-slate-700",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out dark:bg-slate-100",
          isChecked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export { Switch };
