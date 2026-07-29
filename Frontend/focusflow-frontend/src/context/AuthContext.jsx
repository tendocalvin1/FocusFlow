import * as React from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
  getCurrentUser as apiGetCurrentUser,
} from "@/services/authService";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "@/services/api";

const AuthContext = React.createContext(null);

function hasTokens() {
  return Boolean(getAccessToken() && getRefreshToken());
}

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [registerLoading, setRegisterLoading] = React.useState(false);

  const handleLogout = React.useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearTokens();
    localStorage.removeItem("focusflow_user");
  }, []);

  const restoreSession = React.useCallback(async () => {
    if (!hasTokens()) {
      return;
    }
    try {
      const current = await apiGetCurrentUser();
      if (current) {
        setUser(current);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch {
      try {
        await apiRefreshToken();
        const current = await apiGetCurrentUser();
        if (current) {
          setUser(current);
          setIsAuthenticated(true);
        } else {
          handleLogout();
        }
      } catch {
        handleLogout();
      }
    }
  }, [handleLogout]);

  React.useEffect(() => {
    let mounted = true;
    const done = () => {
      if (mounted) setIsLoading(false);
    };
    queueMicrotask(() => {
      restoreSession().then(done, done);
    });

    const onAuthLogout = () => {
      handleLogout();
      if (window.location.pathname !== "/login") {
        const current = new URL(window.location.href);
        const redirect =
          current.pathname === "/"
            ? ""
            : `?next=${encodeURIComponent(current.pathname + current.search)}`;
        window.location.replace(`/login${redirect}`);
      }
    };
    window.addEventListener("focusflow:auth:logout", onAuthLogout);
    return () => {
      mounted = false;
      window.removeEventListener("focusflow:auth:logout", onAuthLogout);
    };
  }, [handleLogout, restoreSession]);

  const login = React.useCallback(async (email, password) => {
    setLoginLoading(true);
    try {
      const result = await apiLogin(email, password);
      if (result?.user) setUser(result.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const msg =
        err?.message ||
        "Invalid credentials. Please check your login details.";
      const wrapped = new Error(msg);
      wrapped.code = err?.code || "login_failed";
      wrapped.fields = err?.fields || null;
      throw wrapped;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const register = React.useCallback(async (name, email, password) => {
    setRegisterLoading(true);
    try {
      const result = await apiRegister(name, email, password);
      if (result?.user) setUser(result.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const msg =
        err?.message || "Registration failed. Please try again.";
      const wrapped = new Error(msg);
      wrapped.code = err?.code || "register_failed";
      wrapped.fields = err?.fields || null;
      throw wrapped;
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    handleLogout();
  }, [handleLogout]);

  const refreshToken = React.useCallback(async () => {
    return apiRefreshToken();
  }, []);

  const getCurrentUser = React.useCallback(async () => {
    return apiGetCurrentUser();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      loginLoading,
      registerLoading,
      login,
      register,
      logout,
      refreshToken,
      getCurrentUser,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      loginLoading,
      registerLoading,
      login,
      register,
      logout,
      refreshToken,
      getCurrentUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
