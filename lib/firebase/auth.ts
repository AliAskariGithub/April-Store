// lib/firebase/auth.ts
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';
import { UserProfile } from '@/types/user';
import { getUserProfile, saveUserProfile } from './firestore';

const LOCAL_STORAGE_USER_KEY = 'april_store_active_user';

function notifyAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('april_auth_changed'));
  }
}

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (auth && auth.app.options.apiKey && auth.app.options.apiKey !== 'demo-api-key') {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      let profile = await getUserProfile(userCredential.user.uid);
      if (!profile) {
        const namePart = userCredential.user.displayName || cleanEmail.split('@')[0];
        const derivedName = namePart
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        profile = {
          uid: userCredential.user.uid,
          email: cleanEmail,
          displayName: derivedName || 'April Store Shopper',
          addresses: [],
          defaultAddressIndex: 0,
          wishlist: [],
          role: cleanEmail.includes('admin') ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(profile);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      notifyAuthChanged();
      return profile;
    } catch (error: any) {
      console.error('Firebase sign in error:', error);
      let message = 'Sign in failed. Please check your credentials.';
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please try again.';
      } else if (error?.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please register.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      } else if (error?.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  }

  // Derive friendly display name from the custom email if in offline/demo mode
  const namePart = cleanEmail.split('@')[0];
  const derivedName = namePart
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Custom authenticated user
  const customUser: UserProfile = {
    uid: `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    displayName: derivedName || 'April Store Shopper',
    addresses: [],
    defaultAddressIndex: 0,
    wishlist: [],
    role: cleanEmail.includes('admin') ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(customUser));
  }
  notifyAuthChanged();
  return customUser;
}

export async function registerWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (auth && auth.app.options.apiKey && auth.app.options.apiKey !== 'demo-api-key') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(userCredential.user, { displayName: cleanName });
      
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: cleanEmail,
        displayName: cleanName,
        addresses: [],
        defaultAddressIndex: 0,
        wishlist: [],
        role: cleanEmail.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      await saveUserProfile(newProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
      }
      notifyAuthChanged();
      return newProfile;
    } catch (error: any) {
      console.error('Firebase register error:', error);
      let message = 'Registration failed. Please try again.';
      if (error?.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (error?.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error?.message) {
        message = error.message;
      }
      throw new Error(message);
    }
  }

  const customUser: UserProfile = {
    uid: `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    displayName: cleanName,
    addresses: [],
    defaultAddressIndex: 0,
    wishlist: [],
    role: cleanEmail.includes('admin') ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(customUser));
  }
  notifyAuthChanged();
  return customUser;
}

export async function signInWithGoogle(): Promise<UserProfile> {
  if (auth && auth.app.options.apiKey && auth.app.options.apiKey !== 'demo-api-key') {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'April Customer',
          photoURL: user.photoURL || undefined,
          addresses: [],
          defaultAddressIndex: 0,
          wishlist: [],
          role: user.email?.toLowerCase().includes('admin') ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await saveUserProfile(profile);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      }
      notifyAuthChanged();
      return profile;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in window was closed.');
      } else if (error?.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in window is already open.');
      } else if (error?.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked by your browser. Please allow popups.');
      } else if (error?.message) {
        throw new Error(error.message);
      }
      throw new Error('Google sign-in failed. Please try again.');
    }
  }

  throw new Error('Google sign-in is not configured or offline.');
}

export async function logout(): Promise<void> {
  try {
    if (auth) {
      await firebaseSignOut(auth);
    }
  } catch (e) {
    console.warn('Sign out error:', e);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
    notifyAuthChanged();
  }
}

export function getCurrentLocalUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as UserProfile;
    // Discard any pre-login demo customer so user can log in with their custom email
    if (
      parsed.uid === 'cust-demo-123' ||
      parsed.email === 'customer@aprilstore.com' ||
      parsed.displayName === 'Zara Khan'
    ) {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function switchDemoRole(role: 'customer' | 'admin'): Promise<UserProfile> {
  const current = getCurrentLocalUser();
  if (current) {
    const updated: UserProfile = {
      ...current,
      role,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
    }
    try {
      await saveUserProfile(updated);
    } catch (e) {
      console.warn('Could not sync role change to Firestore:', e);
    }
    notifyAuthChanged();
    return updated;
  }

  const profile: UserProfile = {
    uid: role === 'admin' ? 'admin-april-001' : 'shopper-april-001',
    email: role === 'admin' ? 'admin@aprilstore.com' : 'shopper@aprilstore.com',
    displayName: role === 'admin' ? 'April Admin' : 'Shopper',
    addresses: [],
    defaultAddressIndex: 0,
    wishlist: [],
    role,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  }
  notifyAuthChanged();
  return profile;
}

export async function updateCurrentUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const current = getCurrentLocalUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...updates,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
  }

  try {
    await saveUserProfile(updated);
  } catch (e) {
    console.warn('Could not sync user update to Firestore:', e);
  }

  notifyAuthChanged();
  return updated;
}

