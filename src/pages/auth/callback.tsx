import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseClient } from '../../lib/supabase/client';
import { authService } from '../../services/authService';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Verifying authentication credentials...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const client = getSupabaseClient();
      if (!client) {
        router.push('/signin');
        return;
      }

      // Check URL hash for recovery or email confirmation
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash.includes('type=recovery')) {
          setStatusText('Recovery session established. Redirecting to set new password...');
          router.push('/reset-password');
          return;
        }

        if (hash.includes('type=signup') || hash.includes('type=email_change')) {
          setStatusText('Email address confirmed! Redirecting to sign in...');
          router.push('/signin?verified=1');
          return;
        }
      }

      try {
        const { data: { session }, error } = await client.auth.getSession();
        if (session?.user) {
          const roles = await authService.getUserRoles(session.user.id);
          const target = authService.getDashboardRouteForUser(roles);
          setStatusText('Authentication verified. Redirecting to your workspace...');
          router.push(target);
        } else {
          router.push('/signin');
        }
      } catch (e) {
        console.warn('Callback error:', e);
        router.push('/signin');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <>
      <Head>
        <title>Verifying Authentication • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-sm w-full bg-white rounded-3xl border border-industrial-200 p-8 shadow-xl text-center space-y-4">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-bold text-industrial-900">UdyogSetu Authentication</h2>
          <p className="text-xs text-industrial-500">{statusText}</p>
        </div>
      </div>
    </>
  );
}
