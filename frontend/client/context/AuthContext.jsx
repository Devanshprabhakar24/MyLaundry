import React, { createContext, useContext, useState, useEffect } from "react";

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
    // Simulate API call - replace with real authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
    const mockUsers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'user@example.com',
        role: 'user',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      },
      {
        id: '2',
        name: 'Admin User',
        email: 'admin@mylaundry.com',
        role: 'admin',
        phone: '+1 (555) 987-6543'
      },
      {
        id: '3',
        name: 'Dev User',
        email: 'dev24prabhakar@gmail.com',
        role: 'user',
        phone: '+1 (555) 456-7890',
        address: '456 Oak Ave, City, State 67890'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === '123456789') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('mylaundry_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
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
