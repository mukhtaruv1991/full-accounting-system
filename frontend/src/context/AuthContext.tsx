import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User extends JwtPayload {
  id: string;
  email: string;
  memberships: { companyId: string; companyName: string; role: string }[];
}

interface AuthContextType {
  user: User | null;
  selectedCompany: { id: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectCompany: (company: { id: string; name: string }) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        // Restore selected company if available
        const storedCompany = localStorage.getItem('selectedCompany');
        if (storedCompany) {
          setSelectedCompany(JSON.parse(storedCompany));
        } else if (decodedUser.memberships?.length === 1) {
          // Auto-select if only one company
          const company = { id: decodedUser.memberships[0].companyId, name: decodedUser.memberships[0].companyName };
          setSelectedCompany(company);
          localStorage.setItem('selectedCompany', JSON.stringify(company));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response;
      localStorage.setItem('token', access_token);
      const decodedUser = jwtDecode<User>(access_token);
      setUser(decodedUser);

      if (decodedUser.memberships?.length === 1) {
        const company = { id: decodedUser.memberships[0].companyId, name: decodedUser.memberships[0].companyName };
        selectCompany(company);
      } else {
        setSelectedCompany(null);
        localStorage.removeItem('selectedCompany');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const selectCompany = (company: { id: string; name: string }) => {
    setSelectedCompany(company);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    // Set companyId for localApi
    localApi.setCompanyId(company.id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompany');
    setUser(null);
    setSelectedCompany(null);
    localApi.setCompanyId(null);
  };

  const value = { user, selectedCompany, login, logout, selectCompany, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
