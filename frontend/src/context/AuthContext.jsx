/**
 * AuthContext – Mock authentication using localStorage.
 * Provides auth state and login/logout functions to the entire app.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Demo credentials for mock login
const DEMO_EMAIL    = 'demo@leximind.ai';
const DEMO_PASSWORD = 'demo123';
const AUTH_KEY      = 'leximind_auth';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem(AUTH_KEY); }
    }
    setLoading(false);
  }, []);

  /**
   * Mock login – accepts any email/password or the demo credentials.
   * Returns { success, error }
   */
  const login = useCallback((email, password, remember = false) => {
    const trimEmail = email.trim().toLowerCase();
    const trimPass  = password.trim();

    // Accept any non-empty credentials OR the demo pair
    if (!trimEmail || !trimPass) {
      return { success: false, error: 'Email and password are required.' };
    }

    const userData = {
      email: trimEmail,
      name: trimEmail === DEMO_EMAIL ? 'Demo User' : trimEmail.split('@')[0],
      initials: (trimEmail === DEMO_EMAIL ? 'DU' : trimEmail.split('@')[0].slice(0, 2)).toUpperCase(),
      loginTime: new Date().toISOString(),
    };

    setUser(userData);
    if (remember) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    } else {
      // Use sessionStorage so it clears on tab close
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      // Still persist to localStorage for ProtectedRoute checks
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    }
    return { success: true };
  }, []);

  /** Demo login shortcut */
  const loginAsDemo = useCallback(() => {
    return login(DEMO_EMAIL, DEMO_PASSWORD, true);
  }, [login]);

  /** Logout – clears all storage */
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
