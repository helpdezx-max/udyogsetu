import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Clock, ShieldCheck, FileCheck, ArrowRight, UploadCloud, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PendingVerificationPage() {
  const router = useRouter();
  const { user, activeRole } = useAuth();

  const isEmployer = activeRole === 'employer';
  const verificationLink = isEmployer ? '/employer/verification' : '/agency/verification';
  const dashboardLink = isEmployer ? '/employer/dashboard' : '/agency/dashboard';

  return (
    <>
      <Head>
        <title>Verification Pending • Rozzy</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-amber-200 p-7 sm:p-9 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-industrial-950 tracking-tight">
              Business Verification Pending
            </h1>
            <p className="text-xs sm:text-sm text-amber-800 font-medium">
              Your {isEmployer ? 'employer company' : 'recruitment agency'} account is active in onboarding mode.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Chakan Industrial Corridor Anti-Fraud Safeguard</span>
            </div>
            <p className="text-3xs text-amber-800 leading-relaxed">
              To protect manufacturing job seekers and prevent bogus job advertisements, all corporate accounts must complete statutory document verification before public vacancy publishing or direct candidate outreach.
            </p>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-industrial-800 uppercase tracking-wider">
              Required Statutory Checklist
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-industrial-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-industrial-800">
                    {isEmployer ? 'GSTIN Certificate or Udyam MSME Registration' : 'Contract Labor License (Form V / CLRA)'}
                  </span>
                </div>
                <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Required
                </span>
              </div>

              <div className="p-3 rounded-xl border border-industrial-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-industrial-800">
                    {isEmployer ? 'MIDC Industrial Plot Allotment / Factory License' : 'Incorporation Certificate / Partnership Deed'}
                  </span>
                </div>
                <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Required
                </span>
              </div>

              <div className="p-3 rounded-xl border border-industrial-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-industrial-800">
                    Authorized Representative Identity & Official Email
                  </span>
                </div>
                <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Completed
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={verificationLink}
              className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Verification Documents</span>
            </Link>

            <Link
              href={dashboardLink}
              className="py-3 px-5 rounded-xl border border-industrial-300 text-industrial-800 font-bold text-xs hover:bg-industrial-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-4 border-t border-industrial-100 text-center">
            <p className="text-3xs text-industrial-500">
              Typical verification turnaround time is <strong>24–48 hours</strong> by the Chakan Industrial Safety Desk.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
