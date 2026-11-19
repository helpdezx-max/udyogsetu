import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Briefcase,
  Users2,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function CompanyDirectoryPage() {
  const { companies, jobs } = useApp();

  const [search, setSearch] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');

  const industries = [
    'Automotive OEM',
    'Auto Components Tier-1',
    'Heavy Engineering',
    'Precision Machining',
    'Press & Stamping',
    'Logistics & Warehousing',
    'Packaging & Polymer',
    'Electronics & Electricals',
  ];

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (clusterFilter && c.clusterName !== clusterFilter) return false;
      if (industryFilter && c.industry !== industryFilter) return false;
      if (verificationFilter === 'verified' && c.verificationStatus !== 'verified') return false;
      if (verificationFilter === 'direct' && !c.directEmployer) return false;
      if (verificationFilter === 'agency' && c.directEmployer) return false;
      return true;
    });
  }, [companies, search, clusterFilter, industryFilter, verificationFilter]);

  const PASTEL_PALETTES = [
    { bg: 'bg-[#F7F8FA]', border: 'border-[#E4E6EB]' },
    { bg: 'bg-[#F1F8F4]', border: 'border-[#D5ECE0]' },
    { bg: 'bg-[#F2F6FD]', border: 'border-[#D8E6FA]' },
    { bg: 'bg-[#FAF4F0]', border: 'border-[#F4E3DA]' },
    { bg: 'bg-[#FFF9EE]', border: 'border-[#FAECBF]' },
    { bg: 'bg-[#F7F4FC]', border: 'border-[#E8E0F5]' },
  ];

  return (
    <>
      <Head>
        <title>Industrial Companies Directory • Rozzy Chakan & Pune MIDC</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-7">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-3xs font-bold uppercase tracking-wider border border-neutral-200">
            <Building2 className="w-3.5 h-3.5 text-neutral-600" />
            <span>Verified Plant Directory</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Chakan & Pune Industrial Plants
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Explore authentic manufacturing companies, Tier-1 automotive vendors, and licensed manpower contractors with physical plant footprints.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 bg-[#FAFAFA] rounded-2xl border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plant or company name..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-400 text-neutral-900 shadow-2xs"
            />
          </div>

          <div>
            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:outline-none focus:border-neutral-400 shadow-2xs cursor-pointer"
            >
              <option value="">All Industrial Areas</option>
              {INDUSTRIAL_CLUSTERS.map((cl) => (
                <option key={cl.id} value={cl.name}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:outline-none focus:border-neutral-400 shadow-2xs cursor-pointer"
            >
              <option value="">All Industry Sectors</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:outline-none focus:border-neutral-400 shadow-2xs cursor-pointer"
            >
              <option value="">All Verification Types</option>
              <option value="verified">Verified Plants Only</option>
              <option value="direct">Direct Factory HR Only</option>
              <option value="agency">Licensed Contractors Only</option>
            </select>
          </div>
        </div>

        {/* Directory Results */}
        {filteredCompanies.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#FAFAFA] rounded-3xl border border-dashed border-neutral-200">
            <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No Companies Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No industrial companies match your search filters. Try clearing your filters to see all listed plants.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setClusterFilter('');
                setIndustryFilter('');
                setVerificationFilter('');
              }}
              className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-black transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((c, idx) => {
              const plantJobs = jobs.filter((j) => j.companyId === c.id);
              const palette = PASTEL_PALETTES[idx % PASTEL_PALETTES.length];

              return (
                <div
                  key={c.id}
                  className={`${palette.bg} ${palette.border} border rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-card hover:-translate-y-0.5 transition-all`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${c.logoPlaceholderBg} text-white font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                        >
                          {c.logoLetter}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-neutral-950 text-sm truncate">{c.name}</h3>
                          <p className="text-3xs text-neutral-500">{c.industry}</p>
                        </div>
                      </div>

                      {c.verificationStatus === 'verified' ? (
                        <span
                          className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/90 text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1 shrink-0"
                          title="Verified Plant"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/90 text-amber-900 border border-amber-200 shrink-0">
                          Audit Pending
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="p-3 bg-white/80 rounded-2xl border border-neutral-200/60 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{c.clusterName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-600">
                        {c.directEmployer ? (
                          <>
                            <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>Direct Plant HR Recruitment</span>
                          </>
                        ) : (
                          <>
                            <Users2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>Licensed Manpower Contractor</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-900 text-3xs bg-white px-2.5 py-1 rounded-lg border border-neutral-200/60 shadow-2xs">
                      {c.openVacanciesCount} Active Vacancies
                    </span>
                    <Link href={`/companies/${c.slug || c.id}`}>
                      <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors">
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
