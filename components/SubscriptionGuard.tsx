import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const SubscriptionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Teachers always bypass subscription check
  if (user.role === UserRole.TEACHER) {
    return <>{children}</>;
  }

  // Check if subscription is valid
  const isSubscribed = user.subscriptionStatus === 'ACTIVE' && 
                       user.subscriptionExpiry && 
                       new Date(user.subscriptionExpiry) > new Date();

  if (!isSubscribed) {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};
