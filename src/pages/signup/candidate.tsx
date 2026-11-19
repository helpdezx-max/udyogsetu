import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Languages,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { fireConfettiBlast } from '../../utils/confetti';

export default function CandidateSignupPage() {
  const router = useRouter();
  const { signUpCandidate, signInWithGoogle, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [qualification, setQualification] = useState('ITI (Fitter/Machinist/Turner/Welder/Electrician)');
  const [language, setLanguage] = useState<'mr' | 'en' | 'hi'>('mr');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { error } = await signInWithGoogle(redirectUrl);
      if (error) {
        setErrorMessage(error.message || 'Failed to initiate Google sign up.');
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred connecting to Google.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field-level validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters with letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms of Service & Privacy Policy to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await signUpCandidate({
        email: email.trim().toLowerCase(),
        password,
        fullName: fullName.trim(),
        phone: phoneClean,
        highestQualification: qualification,
        preferredLanguage: language,
      });

      if (error) {
        setErrorMessage(error.message || 'Registration failed. Please check your credentials.');
        setIsSubmitting(false);
        return;
      }

      setRegisteredSuccess(true);
      setIsSubmitting(false);

      // Fire celebratory confetti blast
      fireConfettiBlast();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_signed_in', 'true');
      }

      // Auto redirect to candidate dashboard after 1.5s
      setTimeout(() => {
        router.push('/candidate/dashboard?new_account=1');
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during signup.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Candidate Registration • Rozzy Chakan</title>
        <meta
          name="description"
          content="Register as a technician, machinist, operator or industrial job seeker in Chakan MIDC. 100% free candidate registration."
        />
      </Head>

      <div className="min-h-[calc(100vh-65px)] w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
        {/* Left Column: Visual Image Panel (50% on desktop) */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-950 p-10 xl:p-14 text-white">
          {/* Background Hero Image */}
          <img
            src="/images/auth-hero.jpg"
            alt="Rozzy Candidate Recruitment"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05]"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-zinc-950/50 pointer-events-none" />

          {/* Top Branding Pill / Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Candidate Portal • 100% Free Forever</span>
            </div>
            <span className="text-3xs uppercase tracking-widest font-extrabold text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-md backdrop-blur-md">
              CHAKAN MIDC
            </span>
          </div>

          {/* Bottom Value Proposition & Trust Highlights */}
          <div className="relative z-10 space-y-6 max-w-lg">
            <div className="space-y-2.5">
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Start Your Next Factory Shift. <br />
                <span className="text-emerald-400">Zero Middlemen. ₹0 Fees.</span>
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Join over 15,000+ skilled ITI trades, CNC machinists, welders, and production operators getting hired directly by top manufacturing plants across Pune.
              </p>
            </div>

            {/* Candidate Benefits */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 text-2xs text-zinc-300">
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">₹0 Fee</span>
                <span className="text-zinc-400 font-medium">Guaranteed Free</span>
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">Direct</span>
                <span className="text-zinc-400 font-medium">Plant Gate Walk-ins</span>
              </div>
              <div className="space-y-1">
                <span className="block text-lg font-black text-white">WhatsApp</span>
                <span className="text-zinc-400 font-medium">Instant Job Alerts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Registration Form (50% on desktop) */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-14 bg-white min-h-[calc(100vh-65px)]">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-zinc-200/90 p-7 sm:p-9 shadow-subtle hover:shadow-mobbin transition-all space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <img
                  src="/images/logo.png"
                  alt="Rozzy"
                  className="h-6 sm:h-7 w-auto object-contain block"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Candidate Registration
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Direct employment network for Chakan MIDC, Khed City & Pune manufacturing plants.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-3xs font-extrabold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% FREE FOREVER FOR JOB SEEKERS • ₹0 FEES</span>
              </div>
            </div>

          {/* Success Banner */}
          {registeredSuccess && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Account Created Successfully!</span>
              </div>
              <p className="text-xs text-emerald-700">
                Welcome to Rozzy. Initializing your candidate profile and redirecting to your dashboard...
              </p>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {!registeredSuccess && (
            <div className="space-y-4">
              {/* Google One-Tap Registration */}
              <GoogleSignInButton
                onClick={handleGoogleSignUp}
                isLoading={isGoogleLoading}
                disabled={isSubmitting}
                text="Sign up with Google"
              />

              {/* Or separator */}
              <div className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-industrial-200" />
                </div>
                <div className="relative px-3 bg-white text-[11px] font-semibold text-industrial-400 uppercase tracking-wider">
                  Or register with form details
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Full Legal Name (as per Aadhaar / ITI Certificate) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mahesh Dnyaneshwar Shinde"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium"
                  />
                </div>
              </div>

              {/* Email & Mobile 2-column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Trade Qualification & Preferred Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Highest Qualification *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium bg-white appearance-none"
                    >
                      <option value="10th / 12th">10th / 12th Pass</option>
                      <option value="ITI (Fitter/Machinist/Turner/Welder/Electrician)">
                        ITI (Fitter, Turner, Machinist, Welder)
                      </option>
                      <option value="Diploma (Mechanical/Auto/Electrical)">
                        Diploma (Mechanical / Auto / Electrical)
                      </option>
                      <option value="B.E. / B.Tech (Mechanical/Prod)">
                        B.E. / B.Tech (Mechanical / Production)
                      </option>
                      <option value="Any Graduate">Any Graduate / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Preferred Language *
                  </label>
                  <div className="relative">
                    <Languages className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium bg-white appearance-none"
                    >
                      <option value="mr">मराठी (Marathi - Primary)</option>
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium"
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

                <div>
                  <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-industrial-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1.5 h-1.5 w-full">
                    <div className={`flex-1 rounded-full ${passwordStrength >= 1 ? 'bg-red-500' : 'bg-industrial-200'}`} />
                    <div className={`flex-1 rounded-full ${passwordStrength >= 2 ? 'bg-amber-500' : 'bg-industrial-200'}`} />
                    <div className={`flex-1 rounded-full ${passwordStrength >= 3 ? 'bg-blue-500' : 'bg-industrial-200'}`} />
                    <div className={`flex-1 rounded-full ${passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-industrial-200'}`} />
                  </div>
                  <p className="text-3xs text-industrial-500">
                    {passwordStrength < 2 && 'Weak: Add numbers and uppercase letters.'}
                    {passwordStrength === 2 && 'Fair: Add special characters.'}
                    {passwordStrength === 3 && 'Good: Strong password.'}
                    {passwordStrength === 4 && 'Excellent: Highly secure password.'}
                  </p>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-industrial-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-xs text-industrial-600 leading-relaxed">
                  I accept the{' '}
                  <Link href="/terms" target="_blank" className="font-bold text-industrial-900 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" className="font-bold text-industrial-900 underline">
                    Privacy Policy
                  </Link>
                  . I understand that Rozzy strictly charges ₹0 to candidates and never demands fees.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Candidate Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            </div>
          )}

          {/* Switch to Signin */}
          <div className="text-center pt-4 border-t border-industrial-100">
            <p className="text-xs text-industrial-600">
              Already registered?{' '}
              <Link href="/signin" className="font-bold text-blue-600 hover:underline">
                Sign in to your Candidate Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
}
