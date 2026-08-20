import { useState } from "react";
import { Sparkles, RefreshCw, Target, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aiService } from "@/services/aiService";

export default function ProductivityInsights() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generatePlan = async () => {
    setIsLoading(true);
    setError("");
    try {
      setPlan(await aiService.generateProductivityPlan());
    } catch {
      setError("We couldn't generate your plan right now. Your existing tasks and goals are still available. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm transition duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              AI Productivity Coach
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A realistic execution plan grounded in your FocusFlow data
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={generatePlan} disabled={isLoading}>
          <RefreshCw className={isLoading ? "animate-spin" : ""} />
          {plan ? "Refresh Plan" : "Generate My Plan"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        {!plan && !error && <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">Generate a weekly plan to see which goals deserve attention, what to do next, and the risks to keep visible.</p>}
        {plan?.empty && <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{plan.summary} Create a goal and a few tasks first, then I can build a personalized execution plan for you.</p>}
        {plan && !plan.empty && (
          <>
            <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">{plan.summary}</p>
            <PlanSection icon={Target} title="Your focus">
              {plan.priorities.map((item, index) => <li key={`${item.goal_id}-${index}`}><span className="font-medium">{item.priority}</span> {item.reason}</li>)}
            </PlanSection>
            <PlanSection icon={Target} title="Weekly plan">
              {plan.plan.map((day) => <li key={day.day}><span className="font-medium">{day.day}:</span> {day.tasks.map((task) => `${task.title} (${task.estimated_minutes} min)`).join(", ") || "Recovery or review"}</li>)}
            </PlanSection>
            {plan.risks.length > 0 && <PlanSection icon={AlertTriangle} title="Risks">{plan.risks.map((risk) => <li key={risk}>{risk}</li>)}</PlanSection>}
            {plan.recommendations.length > 0 && <PlanSection icon={Lightbulb} title="Recommendations">{plan.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}</PlanSection>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PlanSection({ icon: Icon, title, children }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" /> {title}
      </h3>
      <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </ul>
    </section>
  );
}
