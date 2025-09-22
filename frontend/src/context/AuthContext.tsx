import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '../api/api';
import { localApi, AccountingDB } from '../api/localApi';
import { socket } from '../api/socket'; // Import the socket instance
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface Membership {
  company: { id: string; name: string; };
  role: string;
}

interface User extends JwtPayload {
  email: string;
  memberships: Membership[];
}

interface AuthContextType {
  user: User | null;
  selectedCompany: Membership['company'] | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectCompany: (companyId: string) => Promise<void>;
  loading: boolean;
  authLoading: boolean;
  syncLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Membership['company'] | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);

  const syncData = useCallback(async (companyId: string) => {
    setSyncLoading(true);
    console.log(`Starting sync for company: ${companyId}`);
    try {
      const stores: (keyof AccountingDB)[] = ['accounts', 'customers', 'suppliers', 'items', 'sales', 'purchases', 'journal_entries'];
      localApi.setCompanyId(companyId);
      const db = await localApi.getDb(companyId);
      
      for (const storeName of stores) {
        console.log(`Syncing ${storeName}...`);
        const serverData = await api.get(`/${storeName}`);
        const tx = db.transaction(storeName, 'readwrite');
        await tx.store.clear();
        for (const item of serverData) {
          await tx.store.put(item);
        }
        await tx.done;
        console.log(`Sync complete for ${storeName}.`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncLoading(false);
      console.log('Sync process finished.');
    }
  }, []);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        
        const storedCompanyId = localStorage.getItem('selectedCompanyId');
        if (storedCompanyId) {
          const membership = decodedUser.memberships.find(m => m.company.id === storedCompanyId);
          if (membership) {
            setSelectedCompany(membership.company);
            localApi.setCompanyId(membership.company.id);
            socket.auth = { token };
            socket.connect(); // Connect socket after user is authenticated
          }
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.clear();
      }
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
    return () => {
      socket.disconnect(); // Disconnect on cleanup
    };
  }, [loadSession]);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response;
    localStorage.setItem('token', access_token);
    const decodedUser = jwtDecode<User>(access_token);
    setUser(decodedUser);
    // Connect socket after successful login
    socket.auth = { token: access_token };
    socket.connect();
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('selectedCompanyId');
    setUser(null);
    setSelectedCompany(null);
    localApi.setCompanyId(null);
  };

  const selectCompany = useCallback(async (companyId: string) => {
    const membership = user?.memberships.find(m => m.company.id === companyId);
    if (membership) {
      localStorage.setItem('selectedCompanyId', companyId);
      setSelectedCompany(membership.company);
      await syncData(companyId);
    }
  }, [user, syncData]);

  const value = {
    user,
    selectedCompany,
    login,
    logout,
    selectCompany,
    loading: authLoading || syncLoading,
    authLoading,
    syncLoading,
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
