import { Sparkles, CheckCircle2 } from "lucide-react";
//import Logo from "@/components/layout/Logo";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Left Feature Showcase Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Master your attention. Build unstoppable daily momentum.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Designed for high-output engineers, designers, and creators who need continuous deep focus and intelligent workflow tracking.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "Minimalist Pomodoro & Custom Focus Timers",
              "Sub-goal progress & priority kanban boards",
              "Deep activity heatmaps & efficiency analytics",
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 text-slate-200 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <p className="text-sm italic text-slate-300">
            "FocusFlow completely transformed how our product design team operates. The interface is razor-sharp, distraction-free, and delightful."
          </p>
          <div className="mt-4 flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
              alt="Elena Rostova"
              className="h-9 w-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-xs font-semibold text-white">Elena Rostova</p>
              <p className="text-[11px] text-slate-400">Head of Product at Linear</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
