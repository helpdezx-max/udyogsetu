import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy • UdyogSetu Industrial Platform</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">Privacy Policy</h1>
          <p className="text-xs text-neutral-500 mt-1">Last Updated: November 2026</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-5 text-xs sm:text-sm leading-relaxed text-neutral-700">
          <div>
            <h2 className="text-sm font-bold text-neutral-950 mb-1">1. Information Collection</h2>
            <p>
              UdyogSetu collects candidate phone numbers, educational qualifications, trade certifications (ITI, Diploma),
              and employment history strictly for industrial placement and factory recruitment in Maharashtra.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-neutral-950 mb-1">2. Usage and Sharing</h2>
            <p>
              Candidate data is shared solely with verified factory employers and authorized manpower contractors to
              facilitate job interviews, shift allocations, and statutory verification. We never sell candidate personal
              information to third-party commercial marketing networks.
            </p>
          </div>

          <div className="p-4 bg-[#FFF9EE] border border-[#FAECBF] rounded-2xl text-[#7C5104] font-medium text-xs">
            Notice: This application is operating in Phase 1 frontend prototype mode. All records in this session are
            simulated demo profiles for testing and design validation.
          </div>
        </div>
      </div>
    </>
  );
}
