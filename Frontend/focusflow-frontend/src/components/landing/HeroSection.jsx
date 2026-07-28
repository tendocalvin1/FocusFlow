import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 text-center space-y-8 relative z-10">
        {/* Release Tag */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 backdrop-blur-md dark:border-indigo-900/60 dark:bg-indigo-950/40">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            FocusFlow v1.0 Production Launch
          </span>
          <span className="text-xs text-indigo-500">• See what's new</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl lg:text-7xl leading-tight">
          Where high-output engineers & designers stay in <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">deep flow</span>.
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Unify strategic goal decomposition, priority kanban boards, customizable Pomodoro timers, and activity heatmaps into one sleek, distraction-free workspace.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button size="lg" className="h-13 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-bold text-base shadow-xl gap-2">
              Start Free Workspace Trial <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link to="/login">
            <Button size="lg" variant="outline" className="h-13 px-8 rounded-2xl border-slate-300 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 font-bold text-base gap-2">
              <Play className="h-4 w-4 fill-current text-indigo-600" /> Live Interactive Demo
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Instant Setup in 30 Seconds</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>DRF API Backend Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
