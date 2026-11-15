import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Building2,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobCard } from '../../components/common/JobCard';

export default function CompanyProfilePage() {
  const router = useRouter();
  const { slug } = router.query;
  const { companies, jobs } = useApp();

  const company = companies.find((c) => c.slug === slug || c.id === slug);

  if (!company) {
    return (
      <div className="flex-1 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Plant Profile Not Found</h2>
        <p className="text-xs text-neutral-500">The requested industrial plant profile does not exist.</p>
        <Link href="/companies">
          <button className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Return to Directory
          </button>
        </Link>
      </div>
    );
  }

  const plantJobs = jobs.filter((j) => j.companyId === company.id);

  return (
    <>
      <Head>
        <title>{`${company.name} • Industrial Plant Profile & Jobs`}</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-7">
        {/* Back Link */}
        <div>
          <Link
            href="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Companies Directory</span>
          </Link>
        </div>

        {/* Plant Header Card */}
        <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${company.logoPlaceholderBg} text-white font-black text-2xl flex items-center justify-center shadow-xs shrink-0`}
              >
                {company.logoLetter}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-950">{company.name}</h1>
                  {company.verificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-3xs font-bold uppercase tracking-wider bg-white text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>MIDC & Udyam Verified</span>
                    </span>
                  ) : (
                    <span className="text-3xs font-bold uppercase tracking-wider bg-white text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Audit Pending
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-neutral-700">{company.industry}</p>
                <p className="text-xs text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{company.specificAddress}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-3xs">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold shadow-2xs">
                Est. {company.establishedYear}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-semibold shadow-2xs">
                Workforce: {company.employeeBand}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-200/60 pt-4">
            <h3 className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Plant Profile & Capability
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-4xl">{company.description}</p>
          </div>

          {/* Plant Statutory Verification Metadata */}
          <div className="bg-[#F1F8F4] rounded-2xl p-4 border border-[#D5ECE0] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-3xs font-bold uppercase text-[#1D603F] tracking-wider block">Udyam Registration</span>
              <span className="font-mono font-bold text-neutral-900">{company.udyamRegistrationNo || 'Pending'}</span>
            </div>
            <div>
              <span className="text-3xs font-bold uppercase text-[#1D603F] tracking-wider block">Factory License (DISH)</span>
              <span className="font-mono font-bold text-neutral-900">{company.factoryLicenseNo || 'Under Audit'}</span>
            </div>
            <div>
              <span className="text-3xs font-bold uppercase text-[#1D603F] tracking-wider block">Last Field Verification</span>
              <span className="font-semibold text-emerald-800">{company.verificationAuditDate || 'In Review'}</span>
            </div>
          </div>

          {/* Facilities Provided */}
          <div>
            <h3 className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Confirmed Worker Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.facilities.map((fac) => (
                <span
                  key={fac}
                  className="text-xs font-medium px-3 py-1 rounded-xl bg-white text-neutral-800 border border-neutral-200 flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{fac}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vacancies Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                Active Vacancies at {company.name}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Current openings confirmed directly with this plant’s HR department.
              </p>
            </div>
            <span className="text-xs font-bold text-neutral-900 bg-[#F7F8FA] px-3 py-1 rounded-full border border-neutral-200">
              {plantJobs.length} Vacancies
            </span>
          </div>

          {plantJobs.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 rounded-3xl bg-[#FAFAFA]">
              No open vacancies currently listed for this company. Check back soon or browse other Chakan plants.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plantJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} index={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
