import { useState } from "react";
import { User, Sliders, Bell, ShieldCheck, Server, Settings as SettingsIcon } from "lucide-react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import IntegrationsSettings from "@/components/settings/IntegrationsSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "integrations", label: "Integrations", icon: Server },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          Workspace Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile, focus preferences, notification alerts, and API settings.
        </p>
      </div>

      {/* Main Settings Layout: Tab Sidebar + Content Panel */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 flex flex-row md:flex-col gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition shrink-0 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-2xs backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "integrations" && <IntegrationsSettings />}
        </div>
      </div>
    </div>
  );
}