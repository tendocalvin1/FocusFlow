import { useState } from "react";
import { Volume2, VolumeX, CloudRain, Trees, Coffee, Waves, Disc } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AmbientSoundPlayer() {
  const [activeSound, setActiveSound] = useState(null);
  const [volume, setVolume] = useState(60);

  const sounds = [
    { id: "rain", title: "Heavy Rain", icon: CloudRain, color: "text-blue-500" },
    { id: "forest", title: "Pine Forest", icon: Trees, color: "text-emerald-500" },
    { id: "cafe", title: "Cozy Café", icon: Coffee, color: "text-amber-500" },
    { id: "waves", title: "Ocean Waves", icon: Waves, color: "text-cyan-500" },
    { id: "binaural", title: "Alpha Waves (40Hz)", icon: Disc, color: "text-purple-500" },
  ];

  const toggleSound = (soundId) => {
    setActiveSound((prev) => (prev === soundId ? null : soundId));
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400">
            <Volume2 className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Ambient Soundscapes
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Background noise for deep concentration
            </p>
          </div>
        </div>

        {activeSound && (
          <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Playing
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Sound Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {sounds.map((sound) => {
            const Icon = sound.icon;
            const isSelected = activeSound === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`flex items-center space-x-2.5 rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/50 shadow-2xs dark:border-indigo-600 dark:bg-indigo-950/40"
                    : "border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {sound.title}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isSelected ? "Active" : "Tap to play"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-3 pt-2">
          {volume === 0 ? (
            <VolumeX className="h-4 w-4 text-slate-400" />
          ) : (
            <Volume2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          )}
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700"
          />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 min-w-[32px] text-right">
            {volume}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
