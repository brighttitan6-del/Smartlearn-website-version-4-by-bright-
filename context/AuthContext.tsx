import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  subscribe: (plan: SubscriptionPlan, method: 'AIRTEL' | 'TNM', phone: string) => Promise<boolean>;
  unlockLiveSession: (sessionId: string) => Promise<boolean>;
  buyBook: (bookId: string) => Promise<boolean>;
  buyBooks: (bookIds: string[]) => Promise<boolean>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sl_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Check expiry on load and periodically
  useEffect(() => {
    const checkExpiry = () => {
      if (user && user.role === UserRole.STUDENT && user.subscriptionExpiry) {
        const now = new Date();
        const expiry = new Date(user.subscriptionExpiry);
        if (now > expiry && user.subscriptionStatus === 'ACTIVE') {
          const updatedUser = { ...user, subscriptionStatus: 'EXPIRED' as const };
          setUser(updatedUser);
          localStorage.setItem('sl_user', JSON.stringify(updatedUser));
        }
      }
    };
    
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const login = (email: string, role: UserRole) => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    
    // For new users (simulation), default to NO subscription
    const sessionUser: User = foundUser || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
      subscriptionStatus: role === UserRole.TEACHER ? 'ACTIVE' : 'NONE',
      unlockedLiveSessions: [],
      purchasedBooks: []
    };

    setUser(sessionUser);
    localStorage.setItem('sl_user', JSON.stringify(sessionUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sl_user');
  };

  const subscribe = async (plan: SubscriptionPlan, method: 'AIRTEL' | 'TNM', phone: string): Promise<boolean> => {
    if (!user) return false;

    // Simulate API call payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    let durationMs = 0;
    if (plan === 'DAILY') durationMs = 24 * 60 * 60 * 1000;
    if (plan === 'WEEKLY') durationMs = 7 * 24 * 60 * 60 * 1000;
    if (plan === 'MONTHLY') durationMs = 30 * 24 * 60 * 60 * 1000;

    const updatedUser: User = {
      ...user,
      subscriptionStatus: 'ACTIVE',
      currentPlan: plan,
      subscriptionExpiry: new Date(Date.now() + durationMs).toISOString()
    };

    setUser(updatedUser);
    localStorage.setItem('sl_user', JSON.stringify(updatedUser));
    return true;
  };

  const unlockLiveSession = async (sessionId: string): Promise<boolean> => {
    if (!user) return false;
    
    // Simulate API Payment
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentUnlocked = user.unlockedLiveSessions || [];
    if (!currentUnlocked.includes(sessionId)) {
      const updatedUser = {
        ...user,
        unlockedLiveSessions: [...currentUnlocked, sessionId]
      };
      setUser(updatedUser);
      localStorage.setItem('sl_user', JSON.stringify(updatedUser));
    }
    return true;
  };

  const buyBook = async (bookId: string): Promise<boolean> => {
    if (!user) return false;
    // Simulate API Payment
    await new Promise(resolve => setTimeout(resolve, 1500));

    const currentBooks = user.purchasedBooks || [];
    if (!currentBooks.includes(bookId)) {
      const updatedUser = {
        ...user,
        purchasedBooks: [...currentBooks, bookId]
      };
      setUser(updatedUser);
      localStorage.setItem('sl_user', JSON.stringify(updatedUser));
    }
    return true;
  };

  const buyBooks = async (bookIds: string[]): Promise<boolean> => {
    if (!user) return false;
    // Simulate API Payment
    await new Promise(resolve => setTimeout(resolve, 2000));

    const currentBooks = user.purchasedBooks || [];
    // Filter out ones already owned to be safe
    const newBookIds = bookIds.filter(id => !currentBooks.includes(id));
    
    if (newBookIds.length > 0) {
      const updatedUser = {
        ...user,
        purchasedBooks: [...currentBooks, ...newBookIds]
      };
      setUser(updatedUser);
      localStorage.setItem('sl_user', JSON.stringify(updatedUser));
    }
    return true;
  };

  const refreshUser = () => {
     const saved = localStorage.getItem('sl_user');
     if (saved) setUser(JSON.parse(saved));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, subscribe, unlockLiveSession, buyBook, buyBooks, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};