import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('blognest_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.data || res.user || null);
    } catch {
      localStorage.removeItem('blognest_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (data) => {
    const res = await authService.login(data);
    if (res.accessToken) localStorage.setItem('blognest_token', res.accessToken);
    setUser(res.data || null);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.accessToken) localStorage.setItem('blognest_token', res.accessToken);
    setUser(res.data || null);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('blognest_token');
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
