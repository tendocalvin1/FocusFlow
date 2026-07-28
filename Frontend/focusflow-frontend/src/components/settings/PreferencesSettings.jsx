import { useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PreferencesSettings() {
  const [theme, setTheme] = useState("system"); // 'light' | 'dark' | 'system'
  const [focusLength, setFocusLength] = useState("25");
  const [breakLength, setBreakLength] = useState("5");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Theme Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Interface Appearance
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "light", label: "Light Mode", icon: Sun },
            { id: "dark", label: "Dark Mode", icon: Moon },
            { id: "system", label: "System Default", icon: Monitor },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`flex flex-col items-center justify-center rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5 mb-2" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Default Focus Timer Length */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Default Focus Duration (mins)
          </Label>
          <select
            value={focusLength}
            onChange={(e) => setFocusLength(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="15">15 minutes</option>
            <option value="25">25 minutes (Pomodoro Standard)</option>
            <option value="45">45 minutes (Deep Work)</option>
            <option value="60">60 minutes</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Short Break Duration (mins)
          </Label>
          <select
            value={breakLength}
            onChange={(e) => setBreakLength(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="3">3 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        className="rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {saved ? (
          <>
            <Check className="mr-1.5 h-4 w-4 text-emerald-500" /> Preferences Saved
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </form>
  );
}
