import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await resetPassword(email.trim().toLowerCase());
      setSuccessSubmitted(true);
      setIsSubmitting(false);

      // Start 60-second cooldown to prevent spamming
      setCooldownSeconds(60);
      const timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit password recovery request.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Your Password • UdyogSetu</title>
        <meta
          name="description"
          content="Recover access to your candidate or corporate employer account on UdyogSetu industrial network."
        />
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-industrial-950 tracking-tight">
              Forgot Password
            </h1>
            <p className="text-xs text-industrial-500">
              Enter your registered email address and we'll send you a single-use secure recovery link.
            </p>
          </div>

          {successSubmitted && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Recovery Email Dispatched</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a secure password reset link has been dispatched. Please check your inbox and spam folder.
              </p>
              {cooldownSeconds > 0 && (
                <p className="text-3xs text-emerald-600 font-semibold pt-1">
                  Resend available in {cooldownSeconds}s
                </p>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-industrial-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-industrial-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cooldownSeconds > 0}
              className="w-full py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending Recovery Link...</span>
                </>
              ) : (
                <>
                  <span>{cooldownSeconds > 0 ? `Please wait (${cooldownSeconds}s)` : 'Send Password Reset Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-industrial-100 text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-industrial-600 hover:text-industrial-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
