// components/auth/AuthModal.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      setError('Please fill in all required fields.');
      return;
    }

    if (!isSignIn && !name.trim()) {
      setError('Please provide your full name.');
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
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      maxWidth="md"
      className="p-0 overflow-hidden"
    >
      <div className="text-left">
        {/* Brand Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF5722]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">April</span>
                <span className="text-xl font-extrabold tracking-tight text-[#FF5722]">Store</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {isSignIn ? 'Sign In with Your Email' : 'Create Customer Account'}
              </h2>
              <p className="text-xs text-gray-300 mt-0.5">
                {isSignIn
                  ? 'Access your orders, saved wishlist, and personal profile.'
                  : 'Join April Store to track packages and enjoy personalized styling.'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF5722] shrink-0 border border-white/10">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-5 border border-white/10">
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
        <div className="p-6 sm:p-7 space-y-4 bg-white">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-bold tracking-wider">
              Or with Email
            </span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

          {!isSignIn && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isSignIn}
                  className="pl-10"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="e.g. kanwalirfan90@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">Password</label>
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#FF5722]/20 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : isSignIn ? 'Sign In with Email' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              {isSignIn ? "Don't have an account yet?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  openAuthModal(isSignIn ? 'register' : 'signin');
                }}
                className="text-[#FF5722] font-bold hover:underline cursor-pointer"
              >
                {isSignIn ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </Modal>
  );
}
