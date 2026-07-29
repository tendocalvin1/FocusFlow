import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Loading FocusFlow...
        </p>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ next: location.pathname + location.search }}
      />
    );
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const next = location.state?.next || "/";

  if (isLoading) return <Spinner />;

  if (isAuthenticated) {
    return <Navigate to={next} replace />;
  }

  return children;
}
