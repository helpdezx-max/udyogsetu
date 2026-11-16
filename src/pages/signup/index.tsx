import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { User, Building2, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SignupLandingPage() {
  return (
    <>
      <Head>
        <title>Create Your Account • UdyogSetu Industrial Network</title>
        <meta
          name="description"
          content="Join UdyogSetu industrial recruitment network in Chakan MIDC & Pune. Register as candidate, employer, or recruitment agency."
        />
      </Head>

      <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-industrial-100 border border-industrial-200 text-xs font-bold text-industrial-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Candidate Fees • Statutory Compliance Verified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-industrial-950 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm sm:text-base text-industrial-600">
            Select how you want to participate in the Chakan–Khed manufacturing employment ecosystem:
          </p>
        </div>

        {/* 3 Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Candidate Card */}
          <Link
            href="/signup/candidate"
            className="group relative bg-white rounded-2xl border-2 border-industrial-200 hover:border-blue-600 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User className="w-7 h-7" />
              </div>
              <div>
                <span className="text-3xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Job Seeker / ITI / Worker
                </span>
                <h2 className="text-xl font-black text-industrial-900 mt-2 group-hover:text-blue-600 transition-colors">
                  I am looking for a job
                </h2>
                <p className="text-xs text-industrial-600 mt-2 leading-relaxed">
                  "I want to discover verified factory jobs, apply directly to plants, track walk-in interviews, and receive WhatsApp alerts."
                </p>
              </div>

              <div className="pt-3 border-t border-industrial-100 space-y-1.5 text-xs text-industrial-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Free Forever (₹0 Fee Guarantee)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>In-hand Salary & Shift Transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Chakan MIDC & PMPML Route Access</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Register as Candidate</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Employer Card */}
          <Link
            href="/signup/employer"
            className="group relative bg-white rounded-2xl border-2 border-industrial-200 hover:border-amber-600 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Direct Employer / Plant HR
                </span>
                <h2 className="text-xl font-black text-industrial-900 mt-2 group-hover:text-amber-700 transition-colors">
                  I represent a company
                </h2>
                <p className="text-xs text-industrial-600 mt-2 leading-relaxed">
                  "I want to hire technical trades, machinists, and assembly operators for our plant in Chakan, Khed, or Pune."
                </p>
              </div>

              <div className="pt-3 border-t border-industrial-100 space-y-1.5 text-xs text-industrial-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GSTIN & Udyam Verified Employer Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct ATS & Team Collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Walk-in Drive Announcement System</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Register as Employer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Recruitment Agency Card */}
          <Link
            href="/signup/agency"
            className="group relative bg-white rounded-2xl border-2 border-industrial-200 hover:border-purple-600 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-3xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Manpower Contractor / Agency
                </span>
                <h2 className="text-xl font-black text-industrial-900 mt-2 group-hover:text-purple-600 transition-colors">
                  I represent an agency
                </h2>
                <p className="text-xs text-industrial-600 mt-2 leading-relaxed">
                  "I recruit candidates for industrial employers under authorized client mandates and contract labor compliance."
                </p>
              </div>

              <div className="pt-3 border-t border-industrial-100 space-y-1.5 text-xs text-industrial-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contract Labor License Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Authorized Employer Client Linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bulk Sourcing & Candidate Allocation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Register as Agency</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Existing account footer */}
        <div className="text-center pt-4 border-t border-industrial-200/80">
          <p className="text-sm text-industrial-600">
            Already have an account?{' '}
            <Link href="/signin" className="font-bold text-neutral-900 hover:underline">
              Sign In to Your Workspace
            </Link>
          </p>
          <p className="text-xs text-industrial-400 mt-1">
            Invited by an employer as HR Admin or Recruiter?{' '}
            <Link href="/signup/invitation" className="underline hover:text-industrial-600">
              Accept Team Invitation
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
