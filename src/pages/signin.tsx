import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export default function UnifiedSignInPage() {
  const router = useRouter();
  const { redirect, logged_out, verified, error: urlError } = router.query;
  const { signIn, signInWithGoogle, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (urlError && typeof urlError === 'string') {
      setErrorMessage(decodeURIComponent(urlError));
    }
  }, [urlError]);

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { error } = await signInWithGoogle(redirectUrl);
      if (error) {
        setErrorMessage(error.message || 'Failed to initiate Google sign in.');
        setIsGoogleLoading(false);
      }
      // Note: Supabase will automatically redirect to Google OAuth URL on success
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred connecting to Google.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { error, targetRoute } = await signIn(email.trim().toLowerCase(), password);

      if (error) {
        setErrorMessage(
          error.message?.includes('Invalid login credentials')
            ? 'Invalid email or password. Please verify your credentials and try again.'
            : error.message || 'Authentication failed.'
        );
        setIsSubmitting(false);
        return;
      }

      setLoginSuccess(true);
      setIsSubmitting(false);

      // Determine redirect destination
      let destination = targetRoute || '/candidate/dashboard';

      // Check if safe internal redirect requested
      if (
        redirect &&
        typeof redirect === 'string' &&
        redirect.startsWith('/') &&
        !redirect.startsWith('//') &&
        !redirect.includes('\\')
      ) {
        destination = redirect;
      }

      // Sync activeRole in AppContext for legacy layouts
      if (destination.includes('/admin')) setActiveRole('admin');
      else if (destination.includes('/agency')) setActiveRole('agency');
      else if (destination.includes('/employer')) setActiveRole('employer');
      else setActiveRole('candidate');

      setTimeout(() => {
        router.push(destination);
      }, 700);

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In • Rozzy Industrial Network</title>
        <meta
          name="description"
          content="Sign in to your candidate, employer, or agency workspace on Rozzy industrial recruitment platform."
        />
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6">
          {/* Brand & Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Sign In to Rozzy
            </h1>
            <p className="text-xs text-industrial-500">
              Access your verified candidate profile, employer ATS, or agency workspace.
            </p>
          </div>

          {/* Logged out notice */}
          {logged_out && !errorMessage && !loginSuccess && (
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You have been securely signed out.</span>
            </div>
          )}

          {/* Email verified notice */}
          {verified && !errorMessage && !loginSuccess && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your email address has been successfully verified! Please sign in.</span>
            </div>
          )}

          {/* Success Banner */}
          {loginSuccess && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Authenticated! Redirecting to your workspace...</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {!loginSuccess && (
            <div className="space-y-4">
              {/* Google Sign In Button */}
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
                disabled={isSubmitting}
                text="Sign in with Google"
              />

              {/* Or separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-industrial-200" />
                </div>
                <div className="relative px-3 bg-white text-[11px] font-semibold text-industrial-400 uppercase tracking-wider">
                  Or continue with email
                </div>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-industrial-800">
                      Password *
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-industrial-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-industrial-400 hover:text-industrial-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-industrial-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-industrial-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Quick links to registration */}
          <div className="pt-4 border-t border-industrial-100 text-center space-y-2">
            <p className="text-xs text-industrial-600">
              Don't have an account yet?
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-bold">
              <Link href="/signup/candidate" className="text-blue-600 hover:underline">
                Candidate Signup
              </Link>
              <span className="text-industrial-300">•</span>
              <Link href="/signup/employer" className="text-amber-700 hover:underline">
                Employer Signup
              </Link>
              <span className="text-industrial-300">•</span>
              <Link href="/signup/agency" className="text-purple-600 hover:underline">
                Agency Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
