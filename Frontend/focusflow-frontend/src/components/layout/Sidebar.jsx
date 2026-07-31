import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  LayoutDashboard,
  Target,
  CheckSquare,
  Timer,
  BarChart3,
  Bot,
  Settings,
  User,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Goals",
    icon: Target,
    path: "/goals",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    title: "Focus",
    icon: Timer,
    path: "/focus",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },

  // Uncomment once the AI Planner page exists.
  // {
  //   title: "AI Planner",
  //   icon: Bot,
  //   path: "/ai",
  // },
];

const bottomItems = [
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white">
      <div className="border-b px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight">
          FocusFlow
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Productivity Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t px-4 py-6">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {item.title}
            </NavLink>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;