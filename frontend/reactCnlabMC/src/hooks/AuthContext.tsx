import React, { createContext, ReactNode, useContext, useState } from "react";

type UserRole = "mcadmin" | "user" | null;

interface AuthContextType {
  role: UserRole;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const url = "http://192.168.1.200:8000";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<UserRole>(null);

  const login = async (name: string, password: string) => {
    try {
      console.log('body', JSON.stringify({ name, password }))
      const res = await fetch(url + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      console.log("login data", data);
      if (res.ok && data.user) {
        console.log("Login successful:", data);
        setRole(data.user === "mcadmin" ? "mcadmin" : "user");
        return true;
      }
      
      console.log("login res", res);
    } catch (e) {
      console.error(e);
    }
    return false;
  };
  const logout = () => {
    console.log("Logging out");
    setRole(null);
  }
  const register = async (username: string, password: string) => {
    try {
      const res = await fetch(url + "/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });
      console.log("register res", res);
      if (res.ok) {
        console.log("User created successfully");
        return true;
      } 
      
    } catch (e) {
      console.error("Failed to create user:", e);
    }
    return false;
  };
  return (
    <AuthContext.Provider value={{ role, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
