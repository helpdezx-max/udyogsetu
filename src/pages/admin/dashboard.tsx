import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FileCheck2,
  AlertTriangle,
  Building2,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Lock,
  Copy,
  Clock,
  ShieldAlert,
  Flame,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminDashboardPage() {
  const { verifications, reports, jobs, companies } = useApp();

  const pendingVerifs = verifications.filter((v) => v.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const verifiedCompanies = companies.filter((c) => c.verificationStatus === 'verified');

  return (
    <AdminLayout>
      <Head>
        <title>Trust, Safety & Moderation Console • UdyogSetu Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Trust, Safety &amp; Moderation Console</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit employer credentials, review pre-moderation risk flags, arbitrate duplicate vacancies, and investigate candidate fraud complaints across Chakan MIDC &amp; Pune industrial clusters.
          </p>
        </div>

        {/* Priority Queues Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-amber-500">
            <span className="text-2xs font-bold uppercase text-neutral-500">Plant Verification Queue</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{pendingVerifs.length} Plants</div>
            <div className="text-3xs text-neutral-500 mt-1">Udyam, GSTIN &amp; Plot audit</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-red-500">
            <span className="text-2xs font-bold uppercase text-neutral-500">Candidate Complaints</span>
            <div className="text-2xl font-black text-red-700 mt-1">{pendingReports.length} Active Cases</div>
            <div className="text-3xs text-red-600 font-semibold mt-1">Fee extortion &amp; fake salary claims</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-indigo-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">Vacancy Moderation</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">{jobs.length} Listings</div>
            <div className="text-3xs text-emerald-700 font-semibold mt-1">Pre-moderation risk scanning active</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">Verified Direct Plants</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{verifiedCompanies.length} Units</div>
            <div className="text-3xs text-neutral-500 mt-1">Chakan, Khed, Kuruli, Mahalunge</div>
          </Card>
        </div>

        {/* 1. Pre-Moderation Risk & Trust Alert Banner */}
        <div className="bg-red-50 border border-red-200/90 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-red-950 text-sm">Automated Pre-Moderation &amp; Fraud Risk Engine</h4>
                <span className="text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-200 text-red-900">
                  REAL-TIME ACTIVE
                </span>
              </div>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                Platform rules immediately flag fee keywords (<code className="font-mono bg-red-100 px-1 py-0.5 rounded">registration fee</code>, <code className="font-mono bg-red-100 px-1 py-0.5 rounded">interview charge</code>, <code className="font-mono bg-red-100 px-1 py-0.5 rounded">pay Rs</code>), anomalous helper wages (&gt; ₹45,000/mo), and cross-recruiter duplicate listings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <Link href="/admin/moderation">
              <Button size="sm" variant="danger" className="text-xs font-bold">
                Review Moderation Queue
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Pending Verification Highlight Queue */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-neutral-900">
                Pending Employer Verification Queue ({pendingVerifs.length})
              </h3>
            </div>
            <Link href="/admin/verifications" className="text-xs font-bold text-neutral-900 hover:text-amber-800">
              Open Full Verification Desk →
            </Link>
          </div>

          {pendingVerifs.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium text-center">
              All submitted employer documents have been reviewed and audited!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingVerifs.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-neutral-900 text-sm">{v.companyName}</h4>
                      <span className="text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Pending Desk Audit
                      </span>
                    </div>
                    <p className="text-2xs text-neutral-500 mt-0.5">
                      Cluster: <span className="font-semibold text-neutral-800">{v.clusterName}</span> • Submitted on {v.submittedDate}
                    </p>
                    <p className="text-2xs text-neutral-600 mt-1">
                      Docs attached: GSTIN certificate, Udyam MSME, MIDC plot allotment, DISH License
                    </p>
                  </div>

                  <Link href="/admin/verifications">
                    <Button size="sm" variant="outline" className="text-xs font-semibold whitespace-nowrap">
                      Inspect &amp; Decide
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 3. Candidate Complaints Quick Desk */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm text-neutral-900">
                Active Fraud Complaints &amp; Whistleblower Investigations ({pendingReports.length})
              </h3>
            </div>
            <Link href="/admin/reports" className="text-xs font-bold text-red-700 hover:text-red-900">
              Open Investigation Desk →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReports.slice(0, 2).map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-200">
                      {r.reason}
                    </span>
                    <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">{r.jobTitle}</h4>
                  </div>
                  <p className="text-2xs text-neutral-600 mt-1">
                    Employer: <strong>{r.companyName}</strong> • Candidate: {r.reportedBy} ({r.reportedDate})
                  </p>
                  <p className="text-2xs text-neutral-500 italic mt-0.5 truncate max-w-md">
                    &quot;{r.details}&quot;
                  </p>
                </div>

                <Link href="/admin/reports">
                  <Button size="sm" variant="outline" className="text-xs font-semibold whitespace-nowrap">
                    Investigate Case
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
