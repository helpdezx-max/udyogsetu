import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Settings,
  CheckCircle2,
  Users,
  UserPlus,
  Mail,
  ShieldCheck,
  Copy,
  Clock,
  XCircle,
  AlertCircle,
  Building,
} from 'lucide-react';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { authService, TeamInvitationData } from '../../services/authService';
import { TeamInvitationRole } from '../../types/database.types';

export default function EmployerSettingsPage() {
  const { user, activeWorkspace } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'team'>('general');

  // General settings state
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [autoRejectOld, setAutoRejectOld] = useState(false);
  const [saved, setSaved] = useState(false);

  // Team invitation state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamInvitationRole>('recruiter');
  const [inviteDepartment, setInviteDepartment] = useState('');
  const [invitationsList, setInvitationsList] = useState<TeamInvitationData[]>([]);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load stored invitations for this company
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('udyogsetu_active_invitations_v1');
        if (raw) {
          const all: TeamInvitationData[] = JSON.parse(raw);
          const filtered = all.filter((i) => i.companyId === (activeWorkspace?.id || 'comp-1'));
          setInvitationsList(filtered);
        }
      } catch {}
    }
  }, [activeWorkspace?.id]);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setGeneratedInviteUrl('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      setInviteError('Please enter a valid work email address.');
      return;
    }

    setIsInviting(true);

    try {
      const companyId = activeWorkspace?.id || 'comp-1';
      const inviterId = user?.id || 'admin-system';

      const { invitation, inviteUrl, error } = await authService.createTeamInvitation({
        companyId,
        inviterId,
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        department: inviteDepartment.trim() || undefined,
      });

      setIsInviting(false);

      if (error || !invitation) {
        setInviteError(error?.message || 'Failed to generate invitation.');
        return;
      }

      setGeneratedInviteUrl(inviteUrl);
      setInvitationsList((prev) => [invitation, ...prev]);
      setInviteEmail('');
      setInviteDepartment('');
    } catch (err: any) {
      setInviteError(err.message || 'An unexpected error occurred.');
      setIsInviting(false);
    }
  };

  const handleRevokeInvitation = (tokenHash: string) => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('udyogsetu_active_invitations_v1');
        if (raw) {
          const all: TeamInvitationData[] = JSON.parse(raw);
          const updated = all.map((i) =>
            i.tokenHash === tokenHash ? { ...i, status: 'revoked' as const } : i
          );
          localStorage.setItem('udyogsetu_active_invitations_v1', JSON.stringify(updated));
          setInvitationsList(
            updated.filter((i) => i.companyId === (activeWorkspace?.id || 'comp-1'))
          );
        }
      } catch {}
    }
  };

  const copyToClipboard = () => {
    if (!generatedInviteUrl) return;
    navigator.clipboard.writeText(generatedInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <EmployerLayout>
      <Head>
        <title>HR Portal Settings & Team • UdyogSetu</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Plant HR Workspace Settings</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Configure automated recruiting rules, notifications, and manage HR / recruitment team member invitations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-industrial-100 p-1 rounded-2xl w-fit text-xs font-bold text-industrial-700">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'general' ? 'bg-white shadow text-industrial-950 font-extrabold' : 'hover:text-industrial-950'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>General Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'team' ? 'bg-white shadow text-industrial-950 font-extrabold' : 'hover:text-industrial-950'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Invitations</span>
            {invitationsList.filter((i) => i.status === 'pending').length > 0 && (
              <span className="bg-amber-600 text-white text-3xs px-1.5 py-0.2 rounded-full font-bold ml-1">
                {invitationsList.filter((i) => i.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: General Preferences */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <form onSubmit={handleSaveGeneral} className="space-y-5 text-xs">
              <div className="space-y-3 pb-4 border-b border-industrial-100">
                <h3 className="font-bold text-sm text-industrial-900">Application Dispatch & Automation</h3>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                  <div>
                    <div className="font-bold text-industrial-900">Instant WhatsApp Ping on Candidate Application</div>
                    <div className="text-2xs text-industrial-500">Alert plant recruitment manager whenever an ITI technician applies</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                  <div>
                    <div className="font-bold text-industrial-900">Auto-Close Expired Vacancies</div>
                    <div className="text-2xs text-industrial-500">Automatically delist openings once deadline date passes</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRejectOld}
                    onChange={(e) => setAutoRejectOld(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                </label>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {saved && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Preferences Updated!
                  </span>
                )}
                <Button type="submit" variant="primary" className="ml-auto">
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 2: Team & Invitations */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            {/* Invite Form Card */}
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-industrial-900 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>Invite New Team Member</span>
                </h3>
                <p className="text-xs text-industrial-500 mt-0.5">
                  Authorize internal HR staff, recruiters, hiring managers, or interviewers to collaborate in your plant's recruitment workspace.
                </p>
              </div>

              {inviteError && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{inviteError}</span>
                </div>
              )}

              {generatedInviteUrl && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Invitation Link Generated (Valid for 7 Days)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedInviteUrl}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-3xs font-mono text-emerald-950"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-3xs hover:bg-emerald-800 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <p className="text-3xs text-emerald-700">
                    Share this link directly with the invitee or have them open it to join your organization.
                  </p>
                </div>
              )}

              <form onSubmit={handleCreateInvitation} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-5">
                  <label className="block font-bold text-industrial-800 mb-1">
                    Invitee Official Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="recruiter@plant.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-industrial-200 focus:outline-none focus:ring-2 focus:ring-amber-600 font-medium"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-bold text-industrial-800 mb-1">
                    Assigned Workspace Role *
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-industrial-200 focus:outline-none focus:ring-2 focus:ring-amber-600 font-medium bg-white"
                  >
                    <option value="hr_admin">HR Administrator (Full Access)</option>
                    <option value="recruiter">Technical Recruiter (Jobs & ATS)</option>
                    <option value="hiring_manager">Hiring Manager (Review Applicants)</option>
                    <option value="interviewer">Interviewer (Scheduled Interviews Only)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isInviting ? 'Inviting...' : 'Send Invitation'}</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* Invitations Table Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-sm text-industrial-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-industrial-500" />
                <span>Active & Pending Team Invitations</span>
              </h3>

              {invitationsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-industrial-400">
                  No invitations dispatched yet. Use the form above to add your hiring team.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-industrial-200 text-3xs font-extrabold uppercase text-industrial-400">
                        <th className="pb-2">Invitee Email</th>
                        <th className="pb-2">Assigned Role</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Expires At</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-industrial-100">
                      {invitationsList.map((inv) => (
                        <tr key={inv.tokenHash} className="hover:bg-industrial-50/50">
                          <td className="py-2.5 font-bold text-industrial-900">{inv.email}</td>
                          <td className="py-2.5">
                            <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded bg-industrial-100 text-industrial-700">
                              {inv.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded ${
                                inv.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-3xs text-industrial-500">
                            {new Date(inv.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 text-right">
                            {inv.status === 'pending' && (
                              <button
                                onClick={() => handleRevokeInvitation(inv.tokenHash)}
                                className="text-3xs font-bold text-red-600 hover:text-red-800 hover:underline"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
