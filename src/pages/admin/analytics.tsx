import React from 'react';
import Head from 'next/head';
import { BarChart3, TrendingUp, Users2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';

export default function AdminAnalyticsPage() {
  const { jobs, companies, walkIns, applications, reports } = useApp();

  return (
    <AdminLayout>
      <Head>
        <title>Platform Demo Analytics • Admin Console</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Platform Analytics (Demo Simulation State)</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Transparent counts reflecting current local demo state. No fabricated or inflated platform claims.
          </p>
        </div>

        {/* Live Demo Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Sample Vacancies</span>
            <div className="text-2xl font-black text-brand-700">{jobs.length} Listings</div>
            <span className="text-3xs text-industrial-500">Across 8 Chakan clusters</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Sample Companies</span>
            <div className="text-2xl font-black text-industrial-900">{companies.length} Plants</div>
            <span className="text-3xs text-emerald-700 font-semibold">
              {companies.filter((c) => c.verificationStatus === 'verified').length} Verified
            </span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Walk-in Drives</span>
            <div className="text-2xl font-black text-amber-700">{walkIns.length} Drives</div>
            <span className="text-3xs text-industrial-500">Active this week</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Demo Applications</span>
            <div className="text-2xl font-black text-purple-700">{applications.length} Submitted</div>
            <span className="text-3xs text-industrial-500">In interactive pipeline</span>
          </Card>
        </div>

        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-sm text-industrial-900">Demarcation & Trust Statement</h3>
          <p className="text-xs text-industrial-600 leading-relaxed">
            In accordance with Phase 1 design standards, this prototype operates strictly on simulated demonstration
            records to test UX responsiveness and information hierarchy. When Phase 2 introduces backend connectivity,
            real-time telemetry and PostgreSQL aggregated counts will replace this dataset.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
