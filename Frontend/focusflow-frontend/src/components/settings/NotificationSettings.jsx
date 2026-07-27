import { useState } from "react";
import { Bell, Mail, Volume2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    timerChime: true,
    emailWeekly: true,
    dueReminders: true,
    achievementAlerts: false,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-3">
        {[
          { key: "timerChime", label: "Focus Session Chime", desc: "Play an audio tone when a focus or break interval completes." },
          { key: "dueReminders", label: "Upcoming Deadline Alerts", desc: "Receive browser notifications 30 minutes before task due dates." },
          { key: "emailWeekly", label: "Weekly Efficiency Summary", desc: "Email report digest with total focus hours and weekly completion rate." },
          { key: "achievementAlerts", label: "Achievement Unlock Badges", desc: "Notify when new streak milestones or badges are earned." },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggle(item.key)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                notifications[item.key] ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  notifications[item.key] ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {saved ? (
          <>
            <Check className="mr-1.5 h-4 w-4 text-emerald-500" /> Notifications Updated
          </>
        ) : (
          "Save Notifications"
        )}
      </Button>
    </form>
  );
}
