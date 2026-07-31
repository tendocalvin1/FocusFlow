import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Dashboard from "../pages/Dashboard/Dashboard";
import Goals from "../pages/Goals/Goals";
import Tasks from "../pages/Tasks/Tasks";
import Focus from "../pages/Focus/Focus";
import Analytics from "../pages/Analytics/Analytics";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/Login/ForgotPassword";
import ResetPassword from "../pages/Login/ResetPassword";
import Landing from "../pages/Landing/Landing";
import MainLayout from "../layouts/MainLayout";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute, { GuestRoute } from "./ProtectedRoute";

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The route you opened does not exist in FocusFlow.
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/landing" element={<Landing />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
