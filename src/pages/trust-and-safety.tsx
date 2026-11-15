import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export default function TrustAndSafetyPage() {
  return (
    <>
      <Head>
        <title>Trust, Verification & Safety Policy • UdyogSetu Industrial Platform</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-3xs font-bold uppercase tracking-wider border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Integrity & Anti-Fraud Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            Our Commitment to 100% Genuine Recruitment
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            The foundation of UdyogSetu is uncompromising trust. We strictly audit company identities and enforce zero-tolerance policies for job scams.
          </p>
        </div>

        {/* Anti-Fraud Banner */}
        <div className="bg-[#FAF4F0] border border-[#F4E3DA] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#873A21] font-black text-base sm:text-lg">
            <ShieldAlert className="w-6 h-6 text-[#C2410C]" />
            <span>Golden Rule: Never Pay for a Job Interview or Appointment Letter</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
            No registered factory or authorized contractor on UdyogSetu is allowed to demand money from candidates under any pretext, including:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-800 font-medium">
            <div className="bg-white/90 p-3 rounded-2xl border border-[#F4E3DA]">✗ Registration or Form Processing Fees</div>
            <div className="bg-white/90 p-3 rounded-2xl border border-[#F4E3DA]">✗ Uniform / Safety Shoe Deposit</div>
            <div className="bg-white/90 p-3 rounded-2xl border border-[#F4E3DA]">✗ Medical Examination Fees before joining</div>
            <div className="bg-white/90 p-3 rounded-2xl border border-[#F4E3DA]">✗ Security Deposit or Bank Transfer</div>
          </div>
          <p className="text-xs text-[#873A21] italic pt-1">
            If anyone asks you for money claiming to represent a Chakan plant, refuse immediately and submit a report via our moderation desk.
          </p>
        </div>

        {/* Verification Tiers Explained */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-950">Understanding Our Verification Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl border border-[#D5ECE0] bg-[#F1F8F4] space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white text-emerald-800 border border-emerald-200">
                Direct Plant Verified
              </span>
              <h3 className="text-sm font-bold text-neutral-950 pt-1">Tier 1 Highest Trust</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The hiring company has verified its physical industrial plot in MIDC, provided a valid Udyam certificate,
                and posted the job directly through their permanent HR plant department.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-[#D8E6FA] bg-[#F2F6FD] space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white text-blue-800 border border-blue-200">
                Licensed Agency
              </span>
              <h3 className="text-sm font-bold text-neutral-950 pt-1">Tier 2 Licensed Vendor</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The posting is from a licensed manpower supply agency with valid Labour Contractor License under the
                Contract Labour (Regulation & Abolition) Act, ensuring PF & ESIC deposits.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-[#E4E6EB] bg-[#F7F8FA] space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white text-neutral-700 border border-neutral-200">
                Audit In Progress
              </span>
              <h3 className="text-sm font-bold text-neutral-950 pt-1">Pending Desk Verification</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The company has registered recently and uploaded business documentation. It is undergoing phone and
                desk checks before receiving the verified badge.
              </p>
            </div>
          </div>
        </div>

        {/* Candidate Safety Advisory for Walk-ins */}
        <div className="p-6 rounded-3xl border border-neutral-200 bg-white space-y-4">
          <h2 className="text-lg font-bold text-neutral-950">Safety Advisory for Gate Walk-in Interviews</h2>
          <ul className="space-y-3 text-xs sm:text-sm text-neutral-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Verify the plant address:</strong> Only visit recognized factory gates inside formal MIDC or SEZ zones.
                Never meet individuals at hotels, tea stalls, or isolated spots.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Carry Xerox copies:</strong> Never surrender original educational certificates or Aadhar cards. Factories only need originals for visual verification during joining.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>
                <strong>Wear mandatory PPE:</strong> Carry and wear closed industrial safety shoes when appearing for machine shop or welding practical tests.
              </span>
            </li>
          </ul>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <Link href="/jobs">
              <button className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
                Browse Verified Vacancies
              </button>
            </Link>
            <Link href="/contact" className="text-xs font-semibold text-neutral-600 hover:text-black">
              Contact Compliance Desk →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
