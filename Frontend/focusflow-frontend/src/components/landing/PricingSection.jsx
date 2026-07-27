import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      price: annual ? "$0" : "$0",
      desc: "For individual developers and creators starting out.",
      features: [
        "Up to 5 Active Goals",
        "Unlimited Tasks & Kanban Columns",
        "Pomodoro & Custom Focus Timer",
        "7-Day Analytics History",
      ],
      popular: false,
    },
    {
      name: "Pro Flow",
      price: annual ? "$12" : "$15",
      desc: "For high-output professionals seeking deep efficiency.",
      features: [
        "Unlimited Goals & Sub-Goals",
        "Ambient Soundscape Audio Player",
        "30-Day Velocity & Heatmap Analytics",
        "Django REST Framework Integration",
        "Priority Support",
      ],
      popular: true,
    },
    {
      name: "Team Workspace",
      price: annual ? "$29" : "$35",
      desc: "For engineering teams and product studios.",
      features: [
        "Shared Team Workspaces",
        "Role-Based Access Control",
        "Custom API Webhooks",
        "90-Day Enterprise Analytics",
        "Dedicated Customer Success Manager",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start for free, upgrade when you need advanced analytics and team sync.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center space-x-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                !annual ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100" : "text-slate-500"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                annual ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-slate-100" : "text-slate-500"
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl border p-8 transition duration-200 ${
                plan.popular
                  ? "border-indigo-500 bg-white shadow-xl dark:border-indigo-600 dark:bg-slate-900 ring-2 ring-indigo-500/20"
                  : "border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{plan.price}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">/ user / month</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link to="/register">
                  <Button
                    className={`w-full rounded-2xl font-bold text-xs py-3 ${
                      plan.popular
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    }`}
                  >
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
