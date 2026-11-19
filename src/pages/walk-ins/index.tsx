import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
import { useAuth } from '../../context/AuthContext';
import { WalkInCard } from '../../components/common/WalkInCard';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function WalkInInterviewsPage() {
  const router = useRouter();
  const { walkIns, openApplyModal, jobs, applications } = useApp();
  const { user } = useAuth();

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
        <title>Walk-in Interviews & Spot Hiring Drives • Rozzy Chakan MIDC</title>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWalkIns.map((walkin) => (
              <WalkInCard
                key={walkin.id}
                walkin={walkin}
                correspondingJob={jobs.find((j) => j.id === walkin.jobId)}
                showPreRegister={true}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
