import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface User extends JwtPayload {
  email: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

interface Membership {
  company: Company;
  role: string;
}

interface AuthContextType {
  user: User | null;
  userMemberships: Membership[] | null;
  selectedCompany: Company | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectCompany: (companyId: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userMemberships, setUserMemberships] = useState<Membership[] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('selectedCompanyId');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        // We will fetch memberships on login, but we can try to restore from cache if needed
        const cachedMemberships = localStorage.getItem('userMemberships');
        if (cachedMemberships) {
          const memberships = JSON.parse(cachedMemberships);
          setUserMemberships(memberships);
          if (companyId) {
            const company = memberships.find((m: Membership) => m.company.id === companyId)?.company;
            if (company) setSelectedCompany(company);
          }
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
      const { access_token, memberships } = response;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userMemberships', JSON.stringify(memberships));

      const decodedUser = jwtDecode<User>(access_token);
      setUser(decodedUser);
      setUserMemberships(memberships);

      if (memberships.length === 1) {
        selectCompany(memberships[0].company.id);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const selectCompany = (companyId: string) => {
    if (userMemberships) {
      const company = userMemberships.find(m => m.company.id === companyId)?.company;
      if (company) {
        localStorage.setItem('selectedCompanyId', companyId);
        setSelectedCompany(company);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('userMemberships');
    setUser(null);
    setUserMemberships(null);
    setSelectedCompany(null);
  };

  const value = { user, userMemberships, selectedCompany, login, logout, selectCompany, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
