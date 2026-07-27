import { useState } from "react";
import { Link2, Server, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsSettings() {
  const [apiStatus, setApiStatus] = useState("connected"); // 'connected' | 'testing'

  const integrations = [
    {
      name: "Django REST Backend API",
      desc: "Local/Staging Django REST Framework API instance serving task & goal models.",
      status: "Connected (Mock Mode)",
      icon: Server,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
    },
    {
      name: "GitHub Commits & PR Sync",
      desc: "Automatically log focus sessions when opening or merging PRs.",
      status: "Active",
      icon: Link2,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
    },
    {
      name: "Google Calendar",
      desc: "Sync focus session blocks directly into your work calendar.",
      status: "Connected",
      icon: Link2,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Server className="h-4 w-4 text-indigo-600" /> API & Workspace Integrations
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Connect third-party developer platforms and backend API endpoints.
        </p>
      </div>

      <div className="space-y-3">
        {integrations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-xs"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" /> {item.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
