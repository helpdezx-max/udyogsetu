import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Building2,
  Phone,
  Search,
  Calendar,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function WalkInInterviewsPage() {
  const { walkIns, openApplyModal, jobs, applications } = useApp();

  const [clusterFilter, setClusterFilter] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'weekend'>('all');

  const filteredWalkIns = walkIns.filter((w) => {
    if (clusterFilter && w.clusterName !== clusterFilter) return false;
    if (
      search &&
      !w.jobTitle.toLowerCase().includes(search.toLowerCase()) &&
      !w.companyName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (activeTab === 'today' && !w.eventDates.toLowerCase().includes('today')) return false;
    if (activeTab === 'weekend' && !w.eventDates.toLowerCase().includes('saturday')) return false;
    return true;
  });

  return (
    <>
      <Head>
        <title>Walk-in Interviews & Spot Hiring Drives • UdyogSetu Chakan MIDC</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-7">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-3xs font-bold uppercase tracking-wider">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Direct Plant Gate Walk-in Calendar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Chakan Industrial Walk-in Interviews
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Report directly to verified factory gates in Chakan Phase 1-4, Khed City, and Kuruli.
            Direct trade skill tests and immediate spot offer letters.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 bg-[#FAFAFA] rounded-2xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
          {/* Quick Timing Pills */}
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
            >
              All Drives ({walkIns.length})
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'today'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Today & Tomorrow</span>
            </button>
            <button
              onClick={() => setActiveTab('weekend')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'weekend'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
              }`}
            >
              Saturday Mega Drives
            </button>
          </div>

          {/* Search + Location Select */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title or plant..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 shadow-2xs text-neutral-900"
              />
            </div>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="w-full sm:w-48 text-xs p-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 focus:outline-none focus:border-neutral-400 shadow-2xs cursor-pointer"
            >
              <option value="">All Industrial Clusters</option>
              {INDUSTRIAL_CLUSTERS.map((cl) => (
                <option key={cl.id} value={cl.name}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Walk-in Grid (Pastel Cards) */}
        {filteredWalkIns.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#FAFAFA] rounded-3xl border border-dashed border-neutral-200">
            <CalendarCheck2 className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No Walk-in Drives Match Your Filter</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try switching tabs or resetting your industrial location filter to view all available plant interview dates.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearch('');
                setClusterFilter('');
              }}
              className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredWalkIns.map((walkin, idx) => {
              const correspondingJob = jobs.find((j) => j.id === walkin.jobId);
              const alreadyApplied = correspondingJob && applications.some((a) => a.jobId === correspondingJob.id);

              const palettes = [
                { bg: 'bg-[#FFF9EE]', border: 'border-[#FAECBF]', badgeBg: 'bg-[#FAEDC8]', badgeText: 'text-[#7C5104]' },
                { bg: 'bg-[#F1F8F4]', border: 'border-[#D5ECE0]', badgeBg: 'bg-[#DCF2E6]', badgeText: 'text-[#1D603F]' },
                { bg: 'bg-[#F2F6FD]', border: 'border-[#D8E6FA]', badgeBg: 'bg-[#DFEDFC]', badgeText: 'text-[#1B4D8D]' },
                { bg: 'bg-[#FAF4F0]', border: 'border-[#F4E3DA]', badgeBg: 'bg-[#F8E7DF]', badgeText: 'text-[#873A21]' },
              ];
              const p = palettes[idx % palettes.length];

              return (
                <div
                  key={walkin.id}
                  className={`${p.bg} ${p.border} border rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-card transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider ${p.badgeBg} ${p.badgeText} flex items-center gap-1.5`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {walkin.eventDates}
                      </span>

                      <span className="text-xs font-bold text-neutral-900 bg-white/90 px-2.5 py-0.5 rounded-full border border-neutral-200/60 shadow-2xs">
                        {walkin.openingsCount} Vacancies
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-neutral-950">{walkin.jobTitle}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          {walkin.companyName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          {walkin.clusterName}
                        </span>
                      </div>
                    </div>

                    {/* Venue & Timing Box */}
                    <div className="p-3.5 bg-white/80 rounded-2xl border border-neutral-200/60 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-neutral-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="font-semibold text-3xs uppercase tracking-wider text-neutral-500">Reporting Time:</span>
                        <span className="font-bold text-neutral-950">{walkin.reportingTime}</span>
                      </div>

                      <div className="flex items-start gap-2 text-neutral-700">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-3xs uppercase tracking-wider text-neutral-500">Gate Address:</span>
                          <p className="text-xs text-neutral-800 mt-0.5">{walkin.venueAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-700 pt-1.5 border-t border-neutral-100 text-3xs">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <span className="font-semibold">Gate Helpdesk:</span>
                        <span>{walkin.contactPerson} ({walkin.contactPhone})</span>
                      </div>
                    </div>

                    {/* Eligibility & Salary */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-3xs font-bold uppercase text-neutral-400 tracking-wider block">Eligibility</span>
                        <span className="text-xs font-medium text-neutral-800">{walkin.eligibility}</span>
                      </div>
                      <div>
                        <span className="text-3xs font-bold uppercase text-neutral-400 tracking-wider block">Salary Range</span>
                        <span className="text-xs font-black text-neutral-950">{walkin.salaryDisplay}</span>
                      </div>
                    </div>

                    {/* Documents required */}
                    <div>
                      <span className="text-3xs font-bold uppercase text-neutral-400 tracking-wider block mb-1.5">
                        Documents to bring:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {walkin.documents.map((doc) => (
                          <span
                            key={doc}
                            className="text-3xs font-medium px-2 py-0.5 rounded-lg bg-white/90 text-neutral-700 border border-neutral-200/60"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-black/5 flex items-center justify-between gap-3">
                    <Link href={`/jobs/${walkin.jobId}`}>
                      <button className="text-xs font-semibold text-neutral-700 hover:text-black">
                        Job Details →
                      </button>
                    </Link>

                    {alreadyApplied ? (
                      <button
                        disabled
                        className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-default"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pre-Registered</span>
                      </button>
                    ) : (
                      correspondingJob && (
                        <button
                          type="button"
                          onClick={() => openApplyModal(correspondingJob)}
                          className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
                        >
                          Pre-Register for Drive
                        </button>
                      )
                    )}
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
