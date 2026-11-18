import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSupabaseClient } from '../../lib/supabase/client';
import { authService } from '../../services/authService';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Verifying authentication credentials...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const client = getSupabaseClient();
      if (!client) {
        router.push('/signin');
        return;
      }

      // 1. Check URL parameters and hash
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const search = window.location.search;
        const urlParams = new URLSearchParams(search);

        // Check for OAuth error in query or hash
        const errorDesc = urlParams.get('error_description') || urlParams.get('error');
        if (errorDesc) {
          setErrorMessage(decodeURIComponent(errorDesc));
          setTimeout(() => router.push(`/signin?error=${encodeURIComponent(errorDesc)}`), 2500);
          return;
        }

        // Recovery session
        if (hash.includes('type=recovery')) {
          setStatusText('Recovery session established. Redirecting to set new password...');
          router.push('/reset-password');
          return;
        }

        // Email confirmation
        if (hash.includes('type=signup') || hash.includes('type=email_change')) {
          setStatusText('Email address confirmed! Redirecting to sign in...');
          router.push('/signin?verified=1');
          return;
        }

        // PKCE Code exchange for Google OAuth
        const code = urlParams.get('code');
        if (code) {
          setStatusText('Exchanging authorization code with Google...');
          try {
            const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.warn('PKCE Code exchange note:', exchangeError.message);
            }
          } catch (e) {
            console.warn('Error during exchangeCodeForSession:', e);
          }
        }
      }

      try {
        // 2. Retrieve established session
        const { data: { session }, error: sessionError } = await client.auth.getSession();

        if (sessionError) {
          console.warn('Session retrieval error:', sessionError);
          router.push('/signin');
          return;
        }

        if (session?.user) {
          const user = session.user;
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || 'Candidate';
          const avatarUrl = meta.avatar_url || meta.picture || null;

          // 3. Ensure profile exists with Google identity details
          try {
            await client.from('profiles').upsert(
              {
                id: user.id,
                email: user.email || '',
                full_name: fullName,
                avatar_url: avatarUrl,
                preferred_language: 'mr',
                is_active: true,
              },
              { onConflict: 'id' }
            );

            // 4. Ensure user role exists (default to candidate for OAuth)
            const { data: existingRoles } = await client
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id);

            if (!existingRoles || existingRoles.length === 0) {
              await client.from('user_roles').insert({
                user_id: user.id,
                role: 'candidate',
                is_primary: true,
              });
            }

            // 5. Ensure candidate profile stub exists if candidate
            const { data: candProfile } = await client
              .from('candidate_profiles')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (!candProfile) {
              await client.from('candidate_profiles').insert({
                user_id: user.id,
                highest_qualification: '10th / 12th',
                profile_completion_percentage: 25,
              });
            }
          } catch (syncErr) {
            console.warn('Google profile sync note:', syncErr);
          }

          // 6. Resolve role-based destination
          const roles = await authService.getUserRoles(user.id);
          const target = authService.getDashboardRouteForUser(roles);
          setStatusText('Authentication successful. Redirecting to your workspace...');
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
          {errorMessage ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-red-900">Authentication Failed</h2>
              <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
              <p className="text-xs text-industrial-400">Returning to sign-in page...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h2 className="text-base font-bold text-industrial-900">UdyogSetu Authentication</h2>
              <p className="text-xs text-industrial-500 font-medium">{statusText}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
