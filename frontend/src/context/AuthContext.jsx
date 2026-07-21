import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchUser = useCallback(async () => {
    const token = sessionStorage.getItem('blognest_token');
    if (!token) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      sessionStorage.removeItem('blognest_token');
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      setUser(res.data || res.user || null);
    } catch {
      sessionStorage.removeItem('blognest_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem('blognest_token');
      if (token && isTokenExpired(token)) {
        sessionStorage.removeItem('blognest_token');
        setUser(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (data) => {
    const res = await authService.login(data);
    if (res.accessToken) sessionStorage.setItem('blognest_token', res.accessToken);
    setUser(res.data || null);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.accessToken) sessionStorage.setItem('blognest_token', res.accessToken);
    setUser(res.data || null);
    return res;
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem('blognest_token');
      setUser(null);
      setLoggingOut(false);
    }
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, loggingOut, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
