import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Users2, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function AgencyLoginPage() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [email, setEmail] = useState('contact@pragatimanpower.demo');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'Invalid agency credentials.');
        setIsSubmitting(false);
        return;
      }
    }

    setActiveRole('agency');
    setIsSubmitting(false);
    router.push('/agency/dashboard');
  };

  return (
    <>
      <Head>
        <title>Recruitment Contractor Portal Login • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center mx-auto shadow-sm">
              <Users2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Contractor Portal Login</h1>
            <p className="text-xs text-industrial-500">
              Authorized manpower suppliers and technical staffing agencies for Chakan MIDC.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <Input
              label="Agency Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold bg-indigo-700 hover:bg-indigo-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Agency Portal'}
            </Button>
          </form>

          <div className="pt-4 border-t border-industrial-100 text-center text-xs text-industrial-600">
            <span>New manpower supplier? </span>
            <Link href="/agency/register" className="font-bold text-indigo-700 hover:underline">
              Register Agency Account
            </Link>
          </div>

          <div className="bg-industrial-50 rounded-xl p-3 border border-industrial-200 text-2xs text-industrial-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <span>
              Recruitment agencies are strictly bound to verified factory authorization mandates.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
