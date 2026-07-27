import { Flame, Award, Zap, Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function AchievementStreakCard() {
  const currentStreak = 14;
  const xpCurrent = 850;
  const xpNextLevel = 1000;
  const levelProgress = Math.round((xpCurrent / xpNextLevel) * 100);

  const badges = [
    { title: "Deep Worker", desc: "4+ hrs focus in 1 day", icon: Zap, unlocked: true },
    { title: "Early Bird", desc: "Started session before 8 AM", icon: Star, unlocked: true },
    { title: "Streak Master", desc: "10-day active streak", icon: Flame, unlocked: true },
    { title: "Goal Crusher", desc: "Completed 5 goals in a week", icon: Trophy, unlocked: false },
  ];

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Focus Streak & Badges
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gamified productivity progress
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs">
          Level 7 Focus Master
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Streak Counter & XP Bar */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Flame className="h-6 w-6 animate-pulse text-orange-500" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {currentStreak} Days
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Active daily focus streak
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {xpCurrent} / {xpNextLevel} XP
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">150 XP to Level 8</p>
            </div>
          </div>

          <div className="mt-3">
            <Progress value={levelProgress} className="h-2 bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* Badges Grid */}
        <div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Recent Badges & Milestones
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2.5 rounded-lg border p-2.5 transition ${
                    badge.unlocked
                      ? "border-slate-200/80 bg-white text-slate-900 shadow-2xs dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      : "border-dashed border-slate-200 bg-slate-50/50 opacity-50 dark:border-slate-800 dark:bg-slate-900/20"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      badge.unlocked
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{badge.title}</p>
                    <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
