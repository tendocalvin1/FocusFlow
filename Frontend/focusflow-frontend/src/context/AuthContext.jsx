import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("focusflow_user");
    return saved
      ? JSON.parse(saved)
      : {
          id: 1,
          name: "Alex Morgan",
          email: "alex.morgan@focusflow.io",
          role: "Senior Product Designer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
          streak: 14,
        };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("focusflow_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("focusflow_user");
    }
  }, [user]);

  const login = async (email, password) => {
    // Mock DRF authentication response
    const mockUser = {
      id: 1,
      name: email.split("@")[0].replace(".", " "),
      email,
      role: "Productivity Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      streak: 14,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("focusflow_token", "mock-jwt-access-token-12345");
    return { success: true };
  };

  const register = async (name, email, password) => {
    const mockUser = {
      id: Date.now(),
      name,
      email,
      role: "Member",
      avatar: "",
      streak: 1,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem("focusflow_token", "mock-jwt-access-token-12345");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("focusflow_user");
    localStorage.removeItem("focusflow_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
