import { useState } from "react";
import { User, Mail, Briefcase, Camera, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex.morgan@focusflow.io");
  const [role, setRole] = useState(user?.role || "Senior Product Designer");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
            alt={name}
            className="h-20 w-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="prof-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="prof-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9 rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="prof-email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9 rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="prof-role" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Role / Job Title
        </Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="prof-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 focus-visible:ring-indigo-500 dark:border-slate-800 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Button
          type="submit"
          className="rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {saved ? (
            <>
              <Check className="mr-1.5 h-4 w-4 text-emerald-500" /> Saved Changes
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </form>
  );
}
