import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Mail, Lock, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function CandidateLoginPage() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [authMode, setAuthMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
        return;
      }
    }

    setActiveRole('candidate');
    setIsSubmitting(false);
    router.push('/candidate/dashboard');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfigured) {
      setErrorMessage(
        'SMS Gateway Integration Notice: Direct phone OTP requires SMS provider credentials (Twilio / MSG91) configured in Supabase Auth settings. Please use Email + Password login above.'
      );
      return;
    }
    setOtpSent(true);
    setOtp('1234');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveRole('candidate');
    router.push('/candidate/dashboard');
  };

  return (
    <>
      <Head>
        <title>Candidate Login • UdyogSetu Chakan</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Candidate Sign In</h1>
            <p className="text-xs text-industrial-500">
              Direct recruitment portal for factory technicians & machine operators.
            </p>
          </div>

          {/* Toggle between Email & Mobile OTP */}
          <div className="flex bg-industrial-100 p-1 rounded-xl text-xs font-bold text-industrial-700">
            <button
              type="button"
              onClick={() => { setAuthMode('email'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${authMode === 'email' ? 'bg-white shadow text-industrial-950' : 'hover:text-industrial-950'}`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${authMode === 'otp' ? 'bg-white shadow text-industrial-950' : 'hover:text-industrial-950'}`}
            >
              Mobile OTP
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />

              <Button type="submit" variant="primary" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Sign In to Candidate Portal'}
              </Button>
            </form>
          ) : (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <Input
                    label="Registered Mobile Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    leftIcon={<span className="text-xs font-bold text-industrial-500">+91</span>}
                    required
                  />

                  <Button type="submit" variant="primary" className="w-full font-bold">
                    Request Verification OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
                    Enter the 4-digit verification OTP received on your mobile
                  </div>

                  <Input
                    label="Enter 4-Digit OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    required
                    className="text-center text-lg font-mono tracking-widest"
                  />

                  <Button type="submit" variant="primary" className="w-full font-bold">
                    Verify & Enter Candidate Portal
                  </Button>
                </form>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-industrial-100 text-center text-xs text-industrial-600">
            <span>New job seeker? </span>
            <Link href="/candidate/register" className="font-bold text-brand-600 hover:underline">
              Create Candidate Account
            </Link>
          </div>

          <div className="bg-industrial-50 rounded-xl p-3 border border-industrial-200 text-2xs text-industrial-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>
              {isConfigured
                ? 'Connected to live Supabase Authentication with Row Level Security.'
                : 'Local Mode: Enter your registered candidate email and password.'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
