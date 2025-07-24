import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

// This is a mock function. In a real app, you'd make an API call.
const mockAuth = async (username, password) => {
  // In a real app, you'd validate credentials against a backend.
  if (username === 'manager' && password === 'password') {
    return { id: 1, name: 'Program Manager', email: 'manager@ntsa.go.ke', role: 'manager' };
  }
  if (username === 'supervisor' && password === 'password') {
    return { id: 2, name: 'Regional Supervisor', email: 'supervisor@ntsa.go.ke', role: 'supervisor' };
  }
  if (username === 'lead' && password === 'password') {
    return { id: 3, name: 'Team Lead A', email: 'lead@ntsa.go.ke', role: 'team-lead' };
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const userData = await mockAuth(username, password);
    if (userData) {
      setUser(userData);
      // In a real app, you might store a token in localStorage
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Clear any stored tokens
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
