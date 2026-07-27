import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a password reset link"
    >
      {submitted ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Check your inbox
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We sent a password reset link to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
          </p>

          <Link to="/login" className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-medium py-2.5"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
