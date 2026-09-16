import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api";
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "./access_token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getAccessToken("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authApi.me();
      setUser(res.data?.data);
    } catch {
      removeAccessToken("access_token");
      removeAccessToken("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;

    setAccessToken("access_token", accessToken);
    setAccessToken("refresh_token", refreshToken);
    setUser(userData);

    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await authApi.register({ username, email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;

    setAccessToken("access_token", accessToken);
    setAccessToken("refresh_token", refreshToken);
    if (userData) setUser(userData);

    await fetchUser();
    return res.data;
  };

  const logout = () => {
    removeAccessToken("access_token");
    removeAccessToken("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
