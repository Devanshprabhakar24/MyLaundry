import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from '../apiConfig'; // Add this line
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedUser = localStorage.getItem('mylaundry_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://mylaundry-backend-hi3w.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('mylaundry_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('https://mylaundry-backend-hi3w.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('mylaundry_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Signup failed.' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('mylaundry_user');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}