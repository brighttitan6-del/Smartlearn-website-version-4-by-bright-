import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, SubscriptionPlan } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => boolean;
  loginWithGoogle: () => Promise<boolean>;
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
  // Local Database Simulation to remember new users (including Google users)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('sl_db_users');
    if (stored) return JSON.parse(stored);
    // Seed with mock users if DB is empty
    localStorage.setItem('sl_db_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sl_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Helper to update user in both DB (registeredUsers) and Session (user)
  const updateUserRecord = (updatedUser: User) => {
    // Update DB
    const newDb = registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setRegisteredUsers(newDb);
    localStorage.setItem('sl_db_users', JSON.stringify(newDb));
    
    // Update Session if it's the current user
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('sl_user', JSON.stringify(updatedUser));
    }
  };

  // Check expiry on load and periodically
  useEffect(() => {
    const checkExpiry = () => {
      if (user && user.role === UserRole.STUDENT && user.subscriptionExpiry) {
        const now = new Date();
        const expiry = new Date(user.subscriptionExpiry);
        if (now > expiry && user.subscriptionStatus === 'ACTIVE') {
          const updatedUser = { ...user, subscriptionStatus: 'EXPIRED' as const };
          updateUserRecord(updatedUser);
        }
      }
    };
    
    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user, registeredUsers]);

  const login = (email: string, role: UserRole) => {
    // Check against local DB instead of just MOCK_USERS
    const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    
    // For new users via Email login (simulation), create a transient or persistent user
    let sessionUser: User;

    if (foundUser) {
        sessionUser = foundUser;
    } else {
        // Create new user and add to DB
        sessionUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role,
            avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
            subscriptionStatus: role === UserRole.TEACHER ? 'ACTIVE' : 'NONE',
            unlockedLiveSessions: [],
            purchasedBooks: []
        };
        const newDb = [...registeredUsers, sessionUser];
        setRegisteredUsers(newDb);
        localStorage.setItem('sl_db_users', JSON.stringify(newDb));
    }

    setUser(sessionUser);
    localStorage.setItem('sl_user', JSON.stringify(sessionUser));
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Simulate Google OAuth popup and network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock payload returned from Google
    const googleProfile = {
        email: "google.student@gmail.com",
        name: "Google Student",
        picture: "https://ui-avatars.com/api/?name=Google+Student&background=DB4437&color=fff"
    };

    // Check if user exists
    let existingUser = registeredUsers.find(u => u.email === googleProfile.email);

    if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('sl_user', JSON.stringify(existingUser));
    } else {
        // Register new Google user
        const newUser: User = {
            id: "google_" + Math.random().toString(36).substr(2, 9),
            name: googleProfile.name,
            email: googleProfile.email,
            role: UserRole.STUDENT, // Default to Student for social login
            avatar: googleProfile.picture,
            subscriptionStatus: 'NONE',
            unlockedLiveSessions: [],
            purchasedBooks: []
        };
        
        const newDb = [...registeredUsers, newUser];
        setRegisteredUsers(newDb);
        localStorage.setItem('sl_db_users', JSON.stringify(newDb));
        
        setUser(newUser);
        localStorage.setItem('sl_user', JSON.stringify(newUser));
    }
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

    updateUserRecord(updatedUser);
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
      updateUserRecord(updatedUser);
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
      updateUserRecord(updatedUser);
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
      updateUserRecord(updatedUser);
    }
    return true;
  };

  const refreshUser = () => {
     const saved = localStorage.getItem('sl_user');
     if (saved) setUser(JSON.parse(saved));
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, isAuthenticated: !!user, subscribe, unlockLiveSession, buyBook, buyBooks, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};