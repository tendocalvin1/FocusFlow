import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">FocusFlow</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/login" className="hover:text-slate-900 dark:hover:text-slate-100">Login</Link>
          <Link to="/register" className="hover:text-slate-900 dark:hover:text-slate-100">Register</Link>
          <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-100">Dashboard</Link>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Terms of Service</a>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600">
          © 2026 FocusFlow Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
