// hooks/useAuth.ts
'use client';

import { useState, useSyncExternalStore } from 'react';
import { UserProfile } from '@/types/user';
import { 
  getCurrentLocalUser, 
  loginWithEmail, 
  registerWithEmail, 
  signInWithGoogle, 
  logout as authLogout,
  switchDemoRole,
  updateCurrentUserProfile
} from '@/lib/firebase/auth';

let cachedUserSnapshot: UserProfile | null = null;
let cachedUserRawString: string | null = '__init__';

function getAuthSnapshot(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('april_store_active_user');
  if (raw !== cachedUserRawString) {
    cachedUserRawString = raw;
    cachedUserSnapshot = getCurrentLocalUser();
  }
  return cachedUserSnapshot;
}

function getServerAuthSnapshot(): UserProfile | null {
  return null;
}

function subscribeAuth(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('april_auth_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('april_auth_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

export function useAuth() {
  const user = useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const loggedUser = await loginWithEmail(email, pass);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const registered = await registerWithEmail(name, email, pass);
      return registered;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      return googleUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authLogout();
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (role: 'customer' | 'admin') => {
    return await switchDemoRole(role);
  };

  const updateProfile = async (partial: Partial<UserProfile>) => {
    return await updateCurrentUserProfile(partial);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    loginGoogle,
    logout,
    switchRole,
    updateProfile,
  };
}

