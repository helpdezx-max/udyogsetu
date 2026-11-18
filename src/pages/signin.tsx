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

      <div className="min-h-[calc(100vh-65px)] w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left Column: Split-screen Image (50% on desktop) */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-950 p-10 xl:p-14 text-white">
          {/* Background Hero Image */}
          <img
            src="/images/auth-hero.jpg"
            alt="Rozzy Industrial Workplace"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05]"
          />
          {/* Ambient Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/50 pointer-events-none" />

          {/* Top Branding Pill / Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct Factory Recruitment • Pune Belt</span>
            </div>
            <span className="text-3xs uppercase tracking-widest font-extrabold text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-md backdrop-blur-md">
              CHAKAN MIDC
            </span>
          </div>

          {/* Bottom Value Proposition & Trust Highlights */}
          <div className="relative z-10 space-y-6 max-w-lg">
            <div className="space-y-2.5">
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Authentic Factory Jobs. <br />
                <span className="text-amber-400">Zero Middlemen. Zero Fees.</span>
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Connect directly with verified automotive OEMs, CNC engineering plants, and tier-1 suppliers across Chakan, Khed City, Kuruli, and Mahalunge.
              </p>
            </div>

            {/* Statutory Trust Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-2xs text-zinc-300">
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">₹0</span>
                <span className="text-zinc-400 font-medium">Candidate Fee</span>
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">100%</span>
                <span className="text-zinc-400 font-medium">Verified Plants</span>
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">48h</span>
                <span className="text-zinc-400 font-medium">Response SLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form (50% on desktop) */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-white min-h-[calc(100vh-65px)]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200/90 p-7 sm:p-9 shadow-subtle hover:shadow-mobbin transition-all space-y-6">
            {/* Brand Logo & Heading */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <img
                  src="/images/logo.png"
                  alt="Rozzy"
                  className="h-9 sm:h-10 w-auto object-contain block"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Sign In to Rozzy
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Access your verified candidate profile, employer ATS, or agency workspace.
                </p>
              </div>
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
    </div>
  </>
);
}
