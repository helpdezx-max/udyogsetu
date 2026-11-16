import React from 'react';
import Head from 'next/head';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms and Conditions • UdyogSetu Industrial Platform</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">Terms of Service</h1>
          <p className="text-xs text-neutral-500 mt-1">Applicable to Industrial Job Seekers and Factory Employers</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-5 text-xs sm:text-sm leading-relaxed text-neutral-700">
          <div>
            <h2 className="text-sm font-bold text-neutral-950 mb-1">1. Acceptance of Terms</h2>
            <p>
              By accessing UdyogSetu, users agree to abide by our industrial integrity guidelines. Employers represent that all
              vacancies, salaries, and plant addresses posted are genuine and physically active.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold text-neutral-950 mb-1">2. Prohibition on Candidate Charges</h2>
            <p>
              Any employer or third-party manpower supplier found demanding recruitment fees, uniform charges, or registration
              deposits will face immediate permanent de-listing and reporting to MIDC and Labour Commissioner authorities.
            </p>
          </div>

          <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-2xl text-neutral-700 font-medium text-xs">
            UdyogSetu connects candidates directly with verified manufacturing employers and authorized contractors. Employment agreements and statutory compliance remain the direct responsibility of the respective hiring entities.
          </div>
        </div>
      </div>
    </>
  );
}
