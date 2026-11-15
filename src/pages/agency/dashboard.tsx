import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Users2, Building2, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyDashboardPage() {
  const { jobs, applications } = useApp();

  return (
    <AgencyLayout>
      <Head>
        <title>Recruitment Agency & Contractor Portal • Pragati Manpower</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Manpower Contractor Overview</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Distinct tier for licensed labor contractors deploying workforce to Chakan automotive manufacturing plants.
          </p>
        </div>

        {/* Agency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-indigo-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Client Plants Served</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">4 Plants</div>
            <div className="text-3xs text-industrial-500 mt-1">Chakan Phase 1 & 2</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-brand-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Active Supply Mandates</span>
            <div className="text-2xl font-black text-brand-700 mt-1">45 Openings</div>
            <div className="text-3xs text-industrial-500 mt-1">Line Feeders & Fitters</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Deployed Workforce</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">210 Workers</div>
            <div className="text-3xs text-emerald-600 font-semibold">100% PF/ESIC compliant</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <span className="text-2xs font-bold uppercase text-industrial-500">Daily Spot Walk-ins</span>
            <div className="text-2xl font-black text-amber-700 mt-1">15 Today</div>
            <div className="text-3xs text-amber-700 font-semibold">Interviewing at Talegaon Chowk</div>
          </Card>
        </div>

        {/* Client Plants List */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-industrial-900">Current Client Factory Mandates</h3>
            <Link href="/agency/employers" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Manage Client Accounts
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-industrial-900">Sahyadri Precision Auto-Tech Ltd.</h4>
                <p className="text-2xs text-industrial-500">Chakan Phase 1 • 20 Press Line Feeders & Assembly Workers</p>
              </div>
              <span className="text-2xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Contract
              </span>
            </div>

            <div className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-industrial-900">Indo-German Tool & Pressings Corp.</h4>
                <p className="text-2xs text-industrial-500">Chakan Phase 2 • 15 MIG Welders & Helpers</p>
              </div>
              <span className="text-2xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Contract
              </span>
            </div>
          </div>
        </Card>
      </div>
    </AgencyLayout>
  );
}
