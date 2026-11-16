import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Lock, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { error } = await signIn(adminUser, adminPass);
      if (error) {
        setErrorMessage(error.message || 'Authentication failed.');
        setIsSubmitting(false);
        return;
      }

      // Verify admin role strictly
      const sessionRes = await authService.getSession();
      if (sessionRes.session?.user) {
        const roles = await authService.getUserRoles(sessionRes.session.user.id);
        if (!roles.includes('admin')) {
          setErrorMessage(
            'Access Denied: This account lacks Platform Administrator authorization. Administrators cannot self-register and must be provisioned via /api/admin/provision or database migration.'
          );
          setIsSubmitting(false);
          return;
        }
      }
    }

    setActiveRole('admin');
    setIsSubmitting(false);
    router.push('/admin/dashboard');
  };

  return (
    <>
      <Head>
        <title>Admin Moderation Desk Login • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-950/20">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 text-purple-200" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Admin Moderation Login</h1>
            <p className="text-xs text-industrial-500">
              Restricted console for platform trust & safety auditors.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <Input
              label="Admin Identity Email"
              type="email"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              required
            />

            <Input
              label="Security Key"
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold bg-purple-700 hover:bg-purple-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating Auditor...' : 'Sign In to Moderation Console'}
            </Button>
          </form>

          <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 text-2xs text-purple-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>
              Administrator access is restricted. Public registration is strictly disabled. Provisioning requires administrative secret via API route.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
