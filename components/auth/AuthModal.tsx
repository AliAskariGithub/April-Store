// components/auth/AuthModal.tsx
'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { showToast } from '@/components/ui/Toast';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal } = useUIStore();
  const { login, register, loginGoogle, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isSignIn = authModalTab === 'signin';

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const loggedUser = await loginGoogle();
      showToast.success(
        'Welcome to April Store!',
        `Signed in as ${loggedUser.displayName || loggedUser.email}`
      );
      closeAuthModal();
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    if (!isSignIn && !name.trim()) {
      setError('Please provide your full name to complete registration.');
      return;
    }

    if (!isSignIn && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      if (isSignIn) {
        const loggedUser = await login(email.trim(), password);
        showToast.success(
          'Welcome to April Store!',
          `Signed in as ${loggedUser.email}`
        );
      } else {
        const newUser = await register(name.trim(), email.trim(), password);
        showToast.success(
          'Account Created!',
          `Welcome, ${newUser.displayName}! Your profile is ready.`
        );
      }
      closeAuthModal();
      setEmail('');
      setPassword('');
      setName('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setError(msg);
    }
  };

  const handleForgotPassword = () => {
    showToast.info(
      'Password Reset',
      'If you have a registered account, contact support or use Google Sign-In for instant access.'
    );
  };

  const fillDemoShopper = () => {
    setEmail('shopper@aprilstore.com');
    setPassword('Shopper123!');
    setError('');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="md"
      className="p-0 overflow-hidden border-0 shadow-2xl rounded-3xl"
      hideHeader
    >
      <div className="text-left bg-white">
        {/* Brand Header */}
        <div className="bg-gradient-to-br from-gray-950 via-[#18181B] to-gray-900 text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Orange Glow Ambient Effect */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FF5722]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FF5722]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar: Logo & Close Button */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FF5722] border border-white/15">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center tracking-tight font-extrabold text-xl">
                <span className="text-white">April</span>
                <span className="text-[#FF5722]">Store</span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Header Copy */}
          <div className="relative z-10 space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {isSignIn ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
              {isSignIn
                ? 'Sign in to access your orders, saved addresses, and style profile.'
                : 'Join April Store to unlock instant checkout, wishlist syncing, and order tracking.'}
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="relative z-10 flex bg-black/40 backdrop-blur-md p-1 rounded-xl mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setError('');
                openAuthModal('signin');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isSignIn
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                openAuthModal('register');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isSignIn
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-4 bg-white">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm transition-all shadow-2xs hover:shadow-xs cursor-pointer group disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-gray-200 flex-1" />
            <span className="bg-white px-3 text-[11px] text-gray-500 uppercase font-bold tracking-wider shrink-0 whitespace-nowrap">
              OR WITH EMAIL
            </span>
            <div className="border-t border-gray-200 flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isSignIn && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-[#FF5722]">*</span>
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. Syed Ali Askari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isSignIn}
                    className="pl-10"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Address <span className="text-[#FF5722]">*</span>
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Password <span className="text-[#FF5722]">*</span>
                </label>
                {isSignIn && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-semibold text-[#FF5722] hover:text-[#F4511E] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isSignIn && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Must be at least 6 characters long.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#FF5722]/20 cursor-pointer text-xs sm:text-sm transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignIn ? 'Sign In to April Store' : 'Create Free Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Quick Demo Helper (for rapid review/testing) */}
            {isSignIn && (
              <div className="pt-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={fillDemoShopper}
                  className="text-[11px] text-gray-400 hover:text-gray-700 underline decoration-dotted transition-colors cursor-pointer"
                >
                  Quick Fill Demo Shopper Account
                </button>
              </div>
            )}

            {/* Switch Tab Footer */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {isSignIn ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    openAuthModal(isSignIn ? 'register' : 'signin');
                  }}
                  className="text-[#FF5722] font-bold hover:underline cursor-pointer ml-1"
                >
                  {isSignIn ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Trust & Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              <span>Encrypted Authentication powered by Firebase</span>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
