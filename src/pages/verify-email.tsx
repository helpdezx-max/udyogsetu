import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { email: emailQuery } = router.query;
  const { user, resendVerificationEmail } = useAuth();

  const [email, setEmail] = useState<string>((emailQuery as string) || user?.email || '');
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      const { error } = await resendVerificationEmail(email);
      setIsResending(false);
      if (error) {
        setErrorMessage(error.message || 'Failed to resend verification email.');
        return;
      }

      setResendSuccess(true);
      setCooldown(60);

      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while resending email.');
      setIsResending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify Your Email • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-industrial-950 tracking-tight">
              Check Your Inbox
            </h1>
            <p className="text-xs sm:text-sm text-industrial-600 leading-relaxed">
              We have dispatched a verification email to{' '}
              <strong className="text-industrial-900">{email || 'your registered address'}</strong>. Click the confirmation link inside to activate full platform capabilities.
            </p>
          </div>

          {resendSuccess && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>A new verification email has been dispatched. Please check your inbox.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <div className="p-4 bg-industrial-50 rounded-2xl border border-industrial-200 text-xs text-industrial-600 text-left space-y-2">
            <div className="font-bold text-industrial-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security & Spam Verification</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-3xs text-industrial-600">
              <li>The verification link is valid for 24 hours.</li>
              <li>Check your <em>Spam</em> or <em>Promotions</em> folder if you don't see it within 2 minutes.</li>
              <li>You can already sign in with your email and password.</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isResending || cooldown > 0}
              onClick={handleResend}
              className="w-full py-2.5 px-4 rounded-xl border border-industrial-300 text-industrial-800 font-bold text-xs hover:bg-industrial-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend Verification Email'}
              </span>
            </button>

            <Link
              href="/signin"
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
