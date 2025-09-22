import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface Membership {
  companyId: string;
  role: string;
  company: {
    id: string;
    name: string;
  };
}

interface AuthUser extends JwtPayload {
  email: string;
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  memberships: Membership[];
  selectedCompany: Membership | null;
  login: (email: string, password: string) => Promise<any>; // Changed to return response
  selectCompany: (companyId: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Membership | null>(() => {
    const savedCompany = localStorage.getItem('selectedCompany');
    return savedCompany ? JSON.parse(savedCompany) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode<AuthUser>(token);
        setUser(decodedUser);
        const savedMemberships = localStorage.getItem('memberships');
        if (savedMemberships) {
          setMemberships(JSON.parse(savedMemberships));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, memberships: userMemberships } = response;

      localStorage.setItem('token', access_token);
      localStorage.setItem('memberships', JSON.stringify(userMemberships));

      const decodedUser = jwtDecode<AuthUser>(access_token);
      setUser(decodedUser);
      setToken(access_token);
      setMemberships(userMemberships);

      if (userMemberships.length === 1) {
        selectCompany(userMemberships[0].companyId);
      }
      
      setLoading(false);
      return response; // Return the full response
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const selectCompany = (companyId: string) => {
    const companyToSelect = memberships.find(m => m.companyId === companyId);
    if (companyToSelect) {
      localStorage.setItem('selectedCompany', JSON.stringify(companyToSelect));
      setSelectedCompany(companyToSelect);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('memberships');
    localStorage.removeItem('selectedCompany');
    setUser(null);
    setToken(null);
    setMemberships([]);
    setSelectedCompany(null);
  };

  const value = {
    user,
    token,
    memberships,
    selectedCompany,
    login,
    selectCompany,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
