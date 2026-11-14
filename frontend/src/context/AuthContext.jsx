import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [officer, setOfficer] = useState(() => {
    const saved = localStorage.getItem('police_officer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default active officer for demo readiness
    return {
      badge: 'TP-8492',
      name: 'Inspector R. Sharma',
      rank: 'Traffic Enforcement Officer',
      zone: 'North Corridor Highway Unit',
      division: 'Automated Safety Division'
    };
  });

  const login = (badge, name, rank = 'Traffic Inspector') => {
    const newOfficer = {
      badge: badge || 'TP-8492',
      name: name || 'Officer On Duty',
      rank: rank,
      zone: 'Metropolitan Highway Patrol',
      division: 'Automated Safety Division',
      loginTime: new Date().toLocaleTimeString()
    };
    setOfficer(newOfficer);
    localStorage.setItem('police_officer', JSON.stringify(newOfficer));
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('police_officer');
  };

  return (
    <AuthContext.Provider value={{ user: officer, officer, login, logout, isAuthenticated: !!officer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

