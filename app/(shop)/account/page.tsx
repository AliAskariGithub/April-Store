// app/(shop)/account/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  ShieldCheck, 
  Plus, 
  PackageCheck,
  Sparkles,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Trash2,
  Check,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';
import { Address } from '@/types/order';

export default function AccountPage() {
  const { user, isAdmin, switchRole, logout, login, register, loginGoogle, updateProfile, loading } = useAuth();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('New York');
  const [newState, setNewState] = useState('NY');
  const [newZip, setNewZip] = useState('10001');
  const [newPhone, setNewPhone] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [savingAddress, setSavingAddress] = useState(false);

  // Inline auth state when not logged in
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    try {
      if (authMode === 'signin') {
        const loggedUser = await login(authEmail.trim(), authPassword);
        showToast.success('Signed In', `Welcome back, ${loggedUser.displayName || loggedUser.email}!`);
      } else {
        const newUser = await register(
          authName.trim() || authEmail.split('@')[0],
          authEmail.trim(),
          authPassword
        );
        showToast.success('Account Created', `Welcome to April Store, ${newUser.displayName}!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setAuthError(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      const logged = await loginGoogle();
      showToast.success('Welcome!', `Signed in as ${logged.displayName || logged.email}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setAuthError(msg);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      showToast.info('Signed Out', 'You have been successfully signed out.');
    } catch {
      showToast.error('Error', 'Unable to sign out. Please try again.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) {
      showToast.error('Incomplete Address', 'Please provide a street address and city.');
      return;
    }

    setSavingAddress(true);
    try {
      const address: Address = {
        fullName: newFullName.trim() || user?.displayName || user?.email?.split('@')[0] || 'Customer',
        phone: newPhone.trim() || user?.phone || '',
        street: newStreet.trim(),
        city: newCity.trim(),
        state: newState.trim() || 'NY',
        postalCode: newZip.trim() || '10001',
        country: newCountry.trim() || 'United States',
      };

      const updatedAddresses = [...(user?.addresses || []), address];
      await updateProfile({
        addresses: updatedAddresses,
        defaultAddressIndex: (user?.addresses?.length || 0) === 0 ? 0 : (user?.defaultAddressIndex ?? 0),
      });

      showToast.success('Address Saved', 'New shipping address added to your profile.');
      setAddressModalOpen(false);
      setNewFullName('');
      setNewStreet('');
      setNewCity('New York');
      setNewState('NY');
      setNewZip('10001');
      setNewPhone('');
    } catch (err) {
      console.error('Failed to save address:', err);
      showToast.error('Save Failed', 'Unable to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!user) return;
    try {
      const updated = user.addresses.filter((_, idx) => idx !== index);
      let newDefault = user.defaultAddressIndex || 0;
      if (newDefault >= updated.length) {
        newDefault = Math.max(0, updated.length - 1);
      }
      await updateProfile({
        addresses: updated,
        defaultAddressIndex: newDefault,
      });
      showToast.info('Address Removed', 'Address deleted from your profile.');
    } catch {
      showToast.error('Error', 'Failed to remove address.');
    }
  };

  const handleSetDefaultAddress = async (index: number) => {
    if (!user) return;
    try {
      await updateProfile({
        defaultAddressIndex: index,
      });
      showToast.success('Default Updated', 'This address is now your default.');
    } catch {
      showToast.error('Error', 'Failed to update default address.');
    }
  };

  // If user is NOT logged in: Show the Sign In / Registration Screen
  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-left">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF5722]/25 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xl font-extrabold text-white">April</span>
                  <span className="text-xl font-extrabold text-[#FF5722]">Store</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {authMode === 'signin' ? 'Sign In to Your Account' : 'Create Customer Account'}
                </h1>
                <p className="text-xs text-gray-300 mt-1">
                  Access orders, saved wishlist, and addresses.
                </p>
              </div>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF5722] shrink-0 border border-white/10">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-white/10 p-1 rounded-xl mt-6 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthMode('signin');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthMode('register');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-4">
            {authError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{authError}</span>
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

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                Or with Email
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            <form onSubmit={handleInlineAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required={authMode === 'register'}
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
                    placeholder="e.g. yourname@gmail.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
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
                  className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#FF5722]/20 cursor-pointer text-sm"
                >
                  <span>{loading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In with Email' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="text-left">
          <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider">
            User Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Personal Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-gray-800">{user.email}</span>
          </p>
        </div>

        {/* Action Controls & Sign Out */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 border border-gray-200 p-1.5 rounded-xl">
            <span className="text-xs font-bold text-gray-700 px-1 sm:px-2">Role:</span>
            <button
              type="button"
              onClick={async () => {
                await switchRole('customer');
                showToast.info('Switched to Customer role');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                !isAdmin ? 'bg-[#FF5722] text-white shadow-xs' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={async () => {
                await switchRole('admin');
                showToast.info('Switched to Admin role');
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                isAdmin ? 'bg-gray-900 text-white shadow-xs' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Dedicated Sign Out Button in Header */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Quick Nav */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center space-y-4 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF3E0] text-[#FF5722] font-extrabold text-2xl flex items-center justify-center mx-auto border-2 border-[#FF5722]/20">
              {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {user.displayName || 'April Store Member'}
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#FF5722] font-bold bg-[#FFF3E0] px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Store Administrator' : 'April Store Member'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-1.5 text-left text-xs font-semibold">
              <Link
                href="/orders"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#FF5722]" />
                  My Orders & Tracking
                </span>
                <PackageCheck className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-[#FF5722]" />
                  Saved Wishlist
                </span>
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
                    Admin Dashboard
                  </span>
                </Link>
              )}

              {/* Sidebar Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer border border-transparent hover:border-red-100"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Addresses & Personal Information */}
        <div className="lg:col-span-8 space-y-8 text-left">
          {/* Address Book */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#FF5722]" />
                <span>Shipping Address Book ({user.addresses?.length || 0})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddressModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr, idx) => {
                  const isDefault = idx === (user.defaultAddressIndex ?? 0);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2 relative transition-all ${
                        isDefault
                          ? 'border-[#FF5722] bg-[#FFF3E0]/20 ring-1 ring-[#FF5722]/30'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-gray-900">{addr.fullName}</span>
                        {isDefault ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FF5722] text-white px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(idx)}
                            className="text-[10px] font-bold text-gray-500 hover:text-[#FF5722] hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed">{addr.street}</p>
                      <p className="text-xs text-gray-600">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{addr.country || 'United States'}</p>
                      {addr.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{addr.phone}</span>
                        </p>
                      )}

                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Remove address"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-gray-200 text-center col-span-full space-y-2">
                  <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-700">No saved shipping addresses yet</p>
                  <p className="text-xs text-gray-500">
                    Add a delivery address to speed up your checkout process.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(true)}
                    className="mt-2 text-xs font-bold text-[#FF5722] hover:underline cursor-pointer"
                  >
                    + Add your first address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add Shipping Address"
        maxWidth="md"
      >
        <form onSubmit={handleAddAddress} className="space-y-4 text-left">
          <Input
            label="Recipient Full Name"
            placeholder="e.g. Alex Morgan"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
          />

          <Input
            label="Street Address"
            placeholder="e.g. 123 Fashion Blvd, Apt 4B"
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="New York"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
            <Input
              label="State / Province"
              placeholder="NY"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Postal Code"
              placeholder="10001"
              value={newZip}
              onChange={(e) => setNewZip(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>

          <Input
            label="Country"
            placeholder="United States"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setAddressModalOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              size="md" 
              disabled={savingAddress}
              className="bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl cursor-pointer"
            >
              {savingAddress ? 'Saving...' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
