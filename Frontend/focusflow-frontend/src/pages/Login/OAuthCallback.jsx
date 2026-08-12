import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TOKEN_ACCESS_KEY, TOKEN_REFRESH_KEY } from "@/services/api";
import { getCurrentUser } from "@/services/authService";

const ERROR_MESSAGES = {
  unauthenticated:
    "Google sign-in did not complete. Please try again or use email login.",
  cancelled:
    "You cancelled the Google sign-in. Please try again or use email login.",
  invalid:
    "We received invalid sign-in tokens. Please try again.",
  missing:
    "Sign-in response was missing credentials. Please try again.",
};

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { setUser, setIsAuthenticated } = useAuthUnsafe();
  const [status, setStatus] = React.useState("loading");
  const [message, setMessage] = React.useState("Completing Google sign-in...");

  React.useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      const error = params.get("error");
      if (error) {
        setStatus("error");
        setMessage(
          ERROR_MESSAGES[error] ||
            "Sign-in failed. Please try again or use email login."
        );
        return;
      }

      const access = params.get("access");
      const refresh = params.get("refresh");

      if (!access || !refresh) {
        setStatus("error");
        setMessage(ERROR_MESSAGES.missing);
        return;
      }

      try {
        localStorage.setItem(TOKEN_ACCESS_KEY, access);
        localStorage.setItem(TOKEN_REFRESH_KEY, refresh);
      } catch {
        setStatus("error");
        setMessage(ERROR_MESSAGES.invalid);
        return;
      }

      (async () => {
        try {
          const profile = await getCurrentUser();
          if (cancelled) return;
          if (setUser) setUser(profile);
          if (setIsAuthenticated) setIsAuthenticated(true);
          setStatus("success");
          setMessage("Sign-in complete. Redirecting...");
          setTimeout(() => navigate("/", { replace: true }), 400);
        } catch (err) {
          if (cancelled) return;
          setStatus("error");
          setMessage(
            err?.message ||
              "We couldn't load your profile. Please try logging in with email."
          );
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [params, navigate, setUser, setIsAuthenticated]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <div
            className={
              status === "error"
                ? "mb-4 rounded-full bg-rose-50 p-3 dark:bg-rose-950/40"
                : "mb-4 rounded-full bg-indigo-50 p-3 dark:bg-indigo-950/40"
            }
          >
            {status === "success" ? (
              <svg
                className="h-7 w-7 text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : status === "error" ? (
              <svg
                className="h-7 w-7 text-rose-600 dark:text-rose-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span className="block h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-400" />
            )}
          </div>

          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {status === "success"
              ? "Welcome to FocusFlow"
              : status === "error"
              ? "Sign-in incomplete"
              : "Completing sign-in"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {message}
          </p>

          {status === "error" && (
            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Return to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function useAuthUnsafe() {
  try {
    const ctx = useAuth();
    return {
      setUser: (u) => ctx.setUser?.(u),
      setIsAuthenticated: (v) => ctx.setIsAuthenticated?.(v),
    };
  } catch {
    return { setUser: null, setIsAuthenticated: null };
  }
}
