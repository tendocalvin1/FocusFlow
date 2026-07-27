import { useState } from "react";
import { ShieldCheck, Lock, Key, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <div className="space-y-1.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Password & Authentication
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ensure your FocusFlow workspace remains protected with a strong password.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="curr-pass" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Current Password
          </Label>
          <Input
            id="curr-pass"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs max-w-md"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="new-pass" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              New Password
            </Label>
            <Input
              id="new-pass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="conf-pass" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </Label>
            <Input
              id="conf-pass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs"
              required
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {saved ? (
          <>
            <Check className="mr-1.5 h-4 w-4 text-emerald-500" /> Password Updated
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}
