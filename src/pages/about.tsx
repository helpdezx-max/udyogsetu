import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Factory, ShieldCheck, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About UdyogSetu • Hyperlocal Industrial Employment Network</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-3xs font-bold uppercase tracking-wider border border-neutral-200">
            <Factory className="w-3.5 h-3.5 text-neutral-600" />
            <span>Our Purpose & Vision</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 tracking-tight">
            Building Maharashtra's Most Trusted Industrial Employment Network
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Eliminating fake jobs, wage exploitation, and opaque middleman commissions across Chakan MIDC and the Pune automotive manufacturing belt.
          </p>
        </div>

        {/* Narrative */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-4">
          <h2 className="text-lg font-bold text-neutral-950">Why UdyogSetu Exists</h2>
          <p className="text-xs sm:text-sm leading-relaxed text-neutral-700">
            Every month, thousands of skilled machine operators, welders, fitters, and line operators travel to Chakan MIDC
            seeking factory employment. Too often, they face fraudulent job flyers at bus stands, unverified consultants demanding
            upfront "registration fees", and misleading in-hand salary promises.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-neutral-700">
            At the same time, factory HR heads struggle to recruit reliable, locally residing technical workforce for their
            rotational shift schedules. UdyogSetu bridges this gap by creating a verified digital network directly anchored in
            statutory company identity and transparent pay structures.
          </p>
        </div>

        {/* Pillars in Pastel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-[#F1F8F4] border border-[#D5ECE0] space-y-3">
            <div className="p-2.5 rounded-2xl bg-white text-emerald-700 w-fit shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-950">Zero Candidate Charges</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Applying for jobs and attending walk-in interviews is 100% free forever for all job seekers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F2F6FD] border border-[#D8E6FA] space-y-3">
            <div className="p-2.5 rounded-2xl bg-white text-blue-700 w-fit shadow-2xs">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-950">Udyam & Plant Verified</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every employer must verify their physical factory plot, GSTIN, and DISH factory license before posting.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FFF9EE] border border-[#FAECBF] space-y-3">
            <div className="p-2.5 rounded-2xl bg-white text-amber-700 w-fit shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-950">Salary Transparency</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No hidden deductions. Exact in-hand pay, PF, ESIC, overtime rates, and bus availability are published upfront.
            </p>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white">Are you hiring for an industrial plant?</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Post verified vacancies and reach candidates living within 15km.</p>
          </div>
          <Link href="/employer/post-job">
            <button className="bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-bold px-5 py-2.5 rounded-xl whitespace-nowrap shadow-xs transition-colors">
              Post Factory Job
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
