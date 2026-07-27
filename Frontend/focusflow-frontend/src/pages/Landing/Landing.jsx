import HeroSection from "@/components/landing/HeroSection";
import FeatureMatrix from "@/components/landing/FeatureMatrix";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight">FocusFlow</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sections */}
      <HeroSection />
      <FeatureMatrix />
      <PricingSection />
      <TestimonialsSection />
      <LandingFooter />
    </div>
  );
}
