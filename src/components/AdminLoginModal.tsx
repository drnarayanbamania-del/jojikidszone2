import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, X, AlertCircle, Sparkles } from 'lucide-react';
import { AdminSession } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: AdminSession) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail('futuretechnology@gmil.com');
    setPassword('Future@2020');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const rawPassword = password.trim();

    if (!cleanEmail || !rawPassword) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const savedCustomPassword = localStorage.getItem('joji_admin_custom_password');

      // Authorized admin accounts definition
      const isFutureTechAdmin =
        cleanEmail === 'futuretechnology@gmil.com' ||
        cleanEmail === 'futuretechnology@gmail.com' ||
        cleanEmail === 'futuretechnology';

      const isDefaultAdmin =
        cleanEmail === 'admin@jojikidszone.com' ||
        cleanEmail === 'admin' ||
        cleanEmail === 'drnarayanbamania@gmail.com';

      let isValid = false;
      let authenticatedEmail = cleanEmail;

      if (isFutureTechAdmin && (rawPassword === 'Future@2020' || rawPassword === savedCustomPassword)) {
        isValid = true;
        authenticatedEmail = 'futuretechnology@gmil.com';
      } else if (isDefaultAdmin && (rawPassword === 'admin123' || rawPassword === savedCustomPassword)) {
        isValid = true;
        authenticatedEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@jojikidszone.com`;
      }

      if (isValid) {
        const session: AdminSession = {
          email: authenticatedEmail,
          role: 'super_admin',
          token: 'token_' + Math.random().toString(36).substring(2) + Date.now(),
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem('joji_admin_session', JSON.stringify(session));
        onLoginSuccess(session);
        onClose();
      } else {
        setErrorMessage('Invalid admin credentials. Authorized: futuretechnology@gmil.com (Future@2020) or admin@jojikidszone.com (admin123)');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl tracking-tight text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                JOJI KIDS ZONE Management Portal
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Sign in with authorized administrator credentials to add, edit, or delete store items and categories.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Credentials Pill */}
          <div className="p-3.5 bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Admin Credentials:
              </span>
              <span className="text-amber-800/90 dark:text-amber-400 font-mono text-[11px] block mt-0.5">
                futuretechnology@gmil.com • Future@2020
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 transition-colors cursor-pointer"
            >
              Fill In
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="futuretechnology@gmil.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            Authorized admin access grants full catalog privileges including live database insertions and deletions.
          </p>
        </div>
      </div>
    </div>
  );
};
