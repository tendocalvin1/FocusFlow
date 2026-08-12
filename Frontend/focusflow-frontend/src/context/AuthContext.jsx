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
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const restoreSession = React.useCallback(async () => {
    if (!hasTokens()) {
      return;
    }

    try {
      const currentUser = await apiGetCurrentUser();

      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      try {
        await apiRefreshToken();

        const currentUser = await apiGetCurrentUser();

        setUser(currentUser);
        setIsAuthenticated(true);
      } catch {
        handleLogout();
      }
    }
  }, [handleLogout]);

  React.useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      restoreSession().finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });
    });

    return () => {
      mounted = false;
    };
  }, [restoreSession]);

  const login = React.useCallback(async (email, password) => {
    setLoginLoading(true);

    try {
      const result = await apiLogin(email, password);

      if (result?.user) {
        setUser(result.user);
      }

      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const wrapped = new Error(
        err?.message || "Invalid credentials. Please try again."
      );

      wrapped.code = err?.code;
      wrapped.fields = err?.fields;

      throw wrapped;
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const register = React.useCallback(async (name, email, password) => {
    setRegisterLoading(true);

    try {
      const result = await apiRegister(name, email, password);

      if (result?.user) {
        setUser(result.user);
      }

      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      const wrapped = new Error(
        err?.message || "Registration failed."
      );

      wrapped.code = err?.code;
      wrapped.fields = err?.fields;

      throw wrapped;
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore API errors during logout.
    }

    handleLogout();
  }, [handleLogout]);

  const refreshToken = React.useCallback(() => {
    return apiRefreshToken();
  }, []);

  const getCurrentUser = React.useCallback(() => {
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
      setUser,
      setIsAuthenticated,
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
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}