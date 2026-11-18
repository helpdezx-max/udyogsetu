import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Users,
  Building2,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService, TeamInvitationData } from '../../services/authService';

export default function TeamInvitationPage() {
  const router = useRouter();
  const { token: tokenParam } = router.query;
  const { user, signIn, signUpEmployer } = useAuth();

  const [tokenInput, setTokenInput] = useState('');
  const [activeToken, setActiveToken] = useState<string>('');
  const [invitation, setInvitation] = useState<TeamInvitationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Inline signin/signup state for unauthenticated invitees
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('register');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  useEffect(() => {
    if (tokenParam && typeof tokenParam === 'string') {
      setActiveToken(tokenParam);
      validateToken(tokenParam);
    }
  }, [tokenParam]);

  const validateToken = async (tok: string) => {
    setIsLoading(true);
    setErrorMessage('');
    const { valid, invitation: inv, error } = await authService.getInvitationByToken(tok);
    setIsLoading(false);

    if (!valid || !inv) {
      setErrorMessage(error || 'Invalid or expired invitation token.');
      setInvitation(null);
      return;
    }

    setInvitation(inv);
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setActiveToken(tokenInput.trim());
    validateToken(tokenInput.trim());
  };

  const handleAcceptLoggedUser = async () => {
    if (!user || !invitation || !activeToken) return;
    setIsSubmittingAuth(true);
    setErrorMessage('');

    const { success, companyId, role, error } = await authService.acceptTeamInvitation({
      token: activeToken,
      userId: user.id,
      userEmail: user.email || '',
    });

    setIsSubmittingAuth(false);
    if (!success || error) {
      setErrorMessage(error?.message || 'Failed to accept invitation.');
      return;
    }

    setSuccessMessage(`Invitation accepted! You have joined ${invitation.companyName} as ${getRoleDisplayName(invitation.role)}.`);

    setTimeout(() => {
      if (role === 'recruiter') router.push('/employer/manage-jobs');
      else if (role === 'hiring_manager') router.push('/employer/applicants');
      else if (role === 'interviewer') router.push('/employer/interviews');
      else router.push('/employer/dashboard');
    }, 1500);
  };

  const handleAuthAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation || !activeToken) return;
    setErrorMessage('');
    setIsSubmittingAuth(true);

    try {
      if (authMode === 'register') {
        // Register new user with the invited email
        const { data, error } = await authService.signUpCandidate({
          email: invitation.email,
          password,
          fullName: fullName.trim() || 'Team Member',
          phone: phone.replace(/[^0-9]/g, '') || '9800000000',
        });

        if (error || !data.user) {
          setErrorMessage(error?.message || 'Registration failed.');
          setIsSubmittingAuth(false);
          return;
        }

        // Accept invitation immediately
        const { success, role, error: acceptErr } = await authService.acceptTeamInvitation({
          token: activeToken,
          userId: data.user.id,
          userEmail: invitation.email,
        });

        if (!success || acceptErr) {
          setErrorMessage(acceptErr?.message || 'Account created but failed to link invitation.');
          setIsSubmittingAuth(false);
          return;
        }

        setSuccessMessage(`Account created and invitation accepted! Redirecting to ${invitation.companyName} workspace...`);
        setTimeout(() => {
          if (role === 'recruiter') router.push('/employer/manage-jobs');
          else if (role === 'hiring_manager') router.push('/employer/applicants');
          else if (role === 'interviewer') router.push('/employer/interviews');
          else router.push('/employer/dashboard');
        }, 1500);

      } else {
        // Sign in with existing credentials
        const { error } = await signIn(invitation.email, password);
        if (error) {
          setErrorMessage(error.message || 'Authentication failed. Please verify your password.');
          setIsSubmittingAuth(false);
          return;
        }

        // User is now logged in; trigger accept
        const session = await authService.getSession();
        if (session.session?.user) {
          const { success, role, error: acceptErr } = await authService.acceptTeamInvitation({
            token: activeToken,
            userId: session.session.user.id,
            userEmail: invitation.email,
          });

          if (!success || acceptErr) {
            setErrorMessage(acceptErr?.message || 'Failed to accept invitation.');
            setIsSubmittingAuth(false);
            return;
          }

          setSuccessMessage(`Invitation accepted! Redirecting to workspace...`);
          setTimeout(() => {
            if (role === 'recruiter') router.push('/employer/manage-jobs');
            else if (role === 'hiring_manager') router.push('/employer/applicants');
            else if (role === 'interviewer') router.push('/employer/interviews');
            else router.push('/employer/dashboard');
          }, 1500);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
      setIsSubmittingAuth(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'hr_admin': return 'HR Administrator';
      case 'recruiter': return 'Technical Recruiter';
      case 'hiring_manager': return 'Hiring Manager';
      case 'interviewer': return 'Technical Interviewer';
      default: return role;
    }
  };

  return (
    <>
      <Head>
        <title>Accept Team Invitation • Rozzy</title>
        <meta
          name="description"
          content="Accept official team invitation to join an authorized employer manufacturing recruitment workspace in Chakan & Pune."
        />
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Company Team Invitation
            </h1>
            <p className="text-xs sm:text-sm text-industrial-600">
              Join an authorized manufacturing employer workspace on Rozzy.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Success!</span>
              </div>
              <p className="text-xs text-emerald-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* If no invitation loaded yet, show token entry input */}
          {!invitation && !isLoading && (
            <form onSubmit={handleManualTokenSubmit} className="space-y-4">
              <div className="p-3.5 bg-industrial-50 rounded-2xl border border-industrial-200 text-xs text-industrial-700">
                If you received an invitation link via email, enter the invitation token below to verify and accept:
              </div>
              <div>
                <label className="block text-xs font-bold text-industrial-800 mb-1.5">
                  Invitation Token or Code *
                </label>
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="e.g. inv_xxxxxxxxxxxx_123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-industrial-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 text-industrial-900 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Verify Invitation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {isLoading && (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-industrial-600">Verifying invitation credentials...</p>
            </div>
          )}

          {/* Invitation Details Card */}
          {invitation && !successMessage && (
            <div className="space-y-5">
              <div className="p-4 bg-industrial-50 rounded-2xl border border-industrial-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-industrial-950">
                      {invitation.companyName}
                    </h3>
                    <p className="text-xs text-industrial-500">Authorized Industrial Employer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-industrial-200 text-xs">
                  <div>
                    <span className="text-3xs text-industrial-400 uppercase font-bold block">Assigned Role</span>
                    <span className="font-extrabold text-amber-700">{getRoleDisplayName(invitation.role)}</span>
                  </div>
                  <div>
                    <span className="text-3xs text-industrial-400 uppercase font-bold block">Invited Email</span>
                    <span className="font-bold text-industrial-900">{invitation.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-3xs text-industrial-500">
                  <Clock className="w-3.5 h-3.5 text-industrial-400" />
                  <span>Valid until: {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Case A: User is already signed in */}
              {user ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Signed in as: <strong>{user.email}</strong></span>
                  </div>

                  {user.email?.toLowerCase() !== invitation.email.toLowerCase() ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                      <strong>Email Mismatch:</strong> This invitation was specifically issued to <strong>{invitation.email}</strong>. Please sign out and sign in with the invited email address to claim this membership.
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmittingAuth}
                      onClick={handleAcceptLoggedUser}
                      className="w-full py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingAuth ? 'Activating Membership...' : 'Accept Invitation & Join Company'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                /* Case B: User is NOT signed in. Prompt registration or sign-in for invited email */
                <div className="space-y-4">
                  <div className="flex bg-industrial-100 p-1 rounded-xl text-xs font-bold text-industrial-700">
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className={`flex-1 py-1.5 rounded-lg transition-colors ${authMode === 'register' ? 'bg-white shadow text-industrial-950' : 'hover:text-industrial-950'}`}
                    >
                      Set Up New Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-1.5 rounded-lg transition-colors ${authMode === 'signin' ? 'bg-white shadow text-industrial-950' : 'hover:text-industrial-950'}`}
                    >
                      Sign In to Accept
                    </button>
                  </div>

                  <form onSubmit={handleAuthAndAccept} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-industrial-800 mb-1">
                        Invited Email (Locked)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={invitation.email}
                        className="w-full px-4 py-2 rounded-xl border border-industrial-200 bg-industrial-100 text-industrial-700 font-medium text-xs cursor-not-allowed"
                      />
                    </div>

                    {authMode === 'register' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-industrial-800 mb-1">
                            Your Full Legal Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Vikas Kulkarni"
                            className="w-full px-4 py-2 rounded-xl border border-industrial-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-industrial-800 mb-1">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="9822000000"
                            maxLength={10}
                            className="w-full px-4 py-2 rounded-xl border border-industrial-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-industrial-800 mb-1">
                        {authMode === 'register' ? 'Create Password (Min. 8 chars) *' : 'Enter Your Password *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 rounded-xl border border-industrial-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingAuth}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                    >
                      {isSubmittingAuth ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <span>{authMode === 'register' ? 'Register & Accept Invitation' : 'Sign In & Accept Invitation'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          <div className="text-center pt-3 border-t border-industrial-100">
            <Link href="/signin" className="text-xs text-industrial-500 hover:text-industrial-900 underline">
              Back to Standard Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
