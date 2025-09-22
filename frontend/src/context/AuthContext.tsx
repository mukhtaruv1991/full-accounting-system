import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Define the structure of a membership
interface Membership {
  companyId: string;
  role: string;
  company: {
    id: string;
    name: string;
  };
}

// Define the structure of the user object stored in context
interface AuthUser extends JwtPayload {
  email: string;
  id: string;
}

// Define the structure for the entire authentication context
interface AuthContextType {
  user: AuthUser | null; // The decoded user from the token
  token: string | null; // The raw JWT
  memberships: Membership[]; // List of companies the user belongs to
  selectedCompany: Membership | null; // The currently active company
  login: (email: string, password: string) => Promise<void>;
  selectCompany: (companyId: string) => void; // Function to select a company
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
        // If there's a token, we assume memberships and company are already in local storage
        const savedMemberships = localStorage.getItem('memberships');
        if (savedMemberships) {
          setMemberships(JSON.parse(savedMemberships));
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout(); // Clear everything if token is invalid
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

      // If user has only one company, select it automatically. Otherwise, wait for selection.
      if (userMemberships.length === 1) {
        selectCompany(userMemberships[0].companyId);
      }
      
      setLoading(false);
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
