import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AlertOctagon, Mail, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccountSuspendedPage() {
  const { user, signOut } = useAuth();
  const [appealReason, setAppealReason] = useState('');
  const [appealSent, setAppealSent] = useState(false);

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    setAppealSent(true);
  };

  return (
    <>
      <Head>
        <title>Account Suspended • UdyogSetu</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-red-200 p-7 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Account Suspended
            </h1>
            <p className="text-xs sm:text-sm text-red-700 font-medium">
              Access to this workspace has been restricted pending compliance review.
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Compliance & Safety Policy Trigger</span>
            </div>
            <p className="text-3xs text-red-800 leading-relaxed">
              UdyogSetu enforces zero tolerance for candidate recruitment fees, counterfeit factory credentials, impersonation of industrial employers, and expired contract labor licenses.
            </p>
          </div>

          {appealSent ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Appeal Submitted</span>
              </div>
              <p className="text-3xs text-emerald-800">
                Your compliance appeal ticket has been registered. The Trust & Moderation team in Chakan will review your statutory documents within 2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAppealSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-industrial-800">
                Submit an Appeal or Explanation
              </label>
              <textarea
                rows={3}
                required
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="Provide statutory registration details, GSTIN/Udyam proof, or explain why this restriction was applied in error..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-industrial-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600 text-industrial-900"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow transition-all"
              >
                Submit Compliance Review Request
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-industrial-100 flex items-center justify-between text-xs">
            <button
              onClick={() => signOut()}
              className="font-bold text-red-600 hover:text-red-700 underline"
            >
              Sign Out of Account
            </button>
            <a
              href="mailto:trust@udyogsetu.internal"
              className="text-industrial-500 hover:text-industrial-900 flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>trust@udyogsetu.internal</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
