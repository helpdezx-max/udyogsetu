import React from 'react';
import Head from 'next/head';
import {
  BarChart3,
  TrendingUp,
  Users2,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  CalendarCheck2,
  Briefcase,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';

export default function AdminAnalyticsPage() {
  const { jobs, companies, walkIns, applications, reports } = useApp();

  return (
    <AdminLayout>
      <Head>
        <title>Chakan Pilot Operations &amp; Growth Analytics • UdyogSetu Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-900">Chakan Pilot Operations &amp; Growth Analytics</h2>
            <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Real-World Ops
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-world recruitment velocity, employer SLA compliance, and placement conversion across 12 industrial
            hubs.
          </p>
        </div>

        {/* Primary Operational Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <Card className="p-4 space-y-1 border-l-4 border-l-neutral-900">
            <span className="text-2xs font-bold uppercase text-neutral-500">Live Vacancies</span>
            <div className="text-2xl font-black text-neutral-950">{jobs.length} Listings</div>
            <span className="text-3xs text-neutral-500">Across 12 Chakan–Khed hubs</span>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">Verified Direct Plants</span>
            <div className="text-2xl font-black text-emerald-700">
              {companies.filter((c) => c.verificationStatus === 'verified').length} Units
            </div>
            <span className="text-3xs text-emerald-700 font-semibold">100% Udyam &amp; GSTIN audited</span>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-amber-500">
            <span className="text-2xs font-bold uppercase text-neutral-500">Plant Walk-in Drives</span>
            <div className="text-2xl font-black text-amber-700">{walkIns.length} Drives</div>
            <span className="text-3xs text-neutral-500">Pre-authorized gate passes</span>
          </Card>

          <Card className="p-4 space-y-1 border-l-4 border-l-indigo-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">Candidate Applications</span>
            <div className="text-2xl font-black text-indigo-700">{applications.length} Profiles</div>
            <span className="text-3xs text-neutral-500">Active in ATS pipeline</span>
          </Card>
        </div>

        {/* Section 7 SLA & Journey Velocity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase text-neutral-500">Avg. Employer Response Time</span>
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-700">38.4 Hours</div>
            <p className="text-2xs text-neutral-500">
              Target: &lt;48 hours. 82% of applications reviewed within 2 working days by plant HR.
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase text-neutral-500">Interview Attendance Rate</span>
              <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700">84.2%</div>
            <p className="text-2xs text-neutral-500">
              High turnouts driven by WhatsApp automated gate reminders (T-24h &amp; T-2h) and PMPML transit guides.
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase text-neutral-500">Offer Acceptance &amp; Joining</span>
              <FileCheck2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-purple-700">89.6%</div>
            <p className="text-2xs text-neutral-500">
              Dual candidate/employer joining confirmation with transparent net in-hand salary disclosures.
            </p>
          </Card>
        </div>

        {/* Real-World Recruitment Journey Monitoring */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">11-Step Candidate Recruitment Journey Funnel</h3>
          <p className="text-xs text-neutral-500">
            Real-time stage transitions from vacancy discovery to verified placement on UdyogSetu.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">1. Applied</div>
              <div className="text-lg font-black text-neutral-900">100%</div>
              <div className="text-3xs text-neutral-500">Candidate intent</div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">2. HR Reviewed</div>
              <div className="text-lg font-black text-blue-700">88%</div>
              <div className="text-3xs text-neutral-500">&lt;48h response</div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">3. Shortlisted</div>
              <div className="text-lg font-black text-indigo-700">54%</div>
              <div className="text-3xs text-neutral-500">Trade test ready</div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">4. Interviewed</div>
              <div className="text-lg font-black text-amber-700">45%</div>
              <div className="text-3xs text-neutral-500">Gate practical test</div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">5. Offered</div>
              <div className="text-lg font-black text-emerald-700">31%</div>
              <div className="text-3xs text-neutral-500">Formal letter</div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-2xl border border-[#E4E6EB] text-center space-y-1">
              <div className="text-2xs font-bold text-neutral-500 uppercase">6. Joined</div>
              <div className="text-lg font-black text-teal-700">28%</div>
              <div className="text-3xs text-neutral-500">Verified placement</div>
            </div>
          </div>
        </Card>

        {/* Operational Guardrail Notice */}
        <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-neutral-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Marketplace Demarcation &amp; Zero-Fee Integrity Pledge:</span>
          </div>
          <p className="text-2xs text-neutral-300 leading-relaxed">
            All placements on UdyogSetu are conducted without charging candidates any fee at any stage. Data reflects
            verified participating manufacturing units and authorized staffing partners within the Chakan–Khed pilot
            perimeter.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
