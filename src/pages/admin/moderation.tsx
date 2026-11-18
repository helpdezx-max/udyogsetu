import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  CheckCircle,
  AlertTriangle,
  Eye,
  ShieldCheck,
  XCircle,
  Flame,
  Copy,
  Clock,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { trustService } from '../../services/trustService';
import { TrustBadge } from '../../components/ui/TrustBadge';

export default function AdminModerationPage() {
  const { jobs, updateJobStatus } = useApp();
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Analyze each job for risk
  const evaluatedJobs = jobs.map((job) => {
    const riskEval = trustService.evaluateJobRisk({
      title: job.title,
      description: job.description,
      category: job.category,
      salaryInHandMonthly: job.salary.inHandMonthly,
    });

    const dupEval = trustService.detectDuplicateVacancies(
      {
        title: job.title,
        companyName: job.companyName,
        cluster: job.clusterName,
      },
      jobs.filter((other) => other.id !== job.id)
    );

    return {
      ...job,
      riskEval,
      dupEval,
    };
  });

  const filteredJobs = evaluatedJobs.filter((j) => {
    if (filterRisk === 'flagged') return j.riskEval.riskScore > 0 || j.dupEval.isDuplicate;
    if (filterRisk === 'high') return j.riskEval.riskLevel === 'high' || j.riskEval.riskLevel === 'critical';
    if (filterRisk === 'duplicate') return j.dupEval.isDuplicate;
    return true;
  });

  const handleApprove = (jobId: string) => {
    updateJobStatus(jobId, 'active');
    setActionNotice(`Vacancy ${jobId} approved and marked published.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleSuspend = (jobId: string) => {
    updateJobStatus(jobId, 'closed');
    setActionNotice(`Vacancy ${jobId} suspended / quarantined pending employer compliance.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Vacancy Moderation &amp; Pre-Moderation Desk • Rozzy Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Job Moderation &amp; Risk Scoring Desk</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Automated pre-moderation evaluates listings for fee extortion keywords, anomalous wages, duplicate reposts, and plant authenticity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold text-neutral-500 uppercase">Filter:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="text-xs p-2 rounded-xl border border-neutral-300 bg-white"
            >
              <option value="all">All Vacancies ({evaluatedJobs.length})</option>
              <option value="flagged">All Flagged / Alerts</option>
              <option value="high">High &amp; Critical Risk</option>
              <option value="duplicate">Potential Duplicates</option>
            </select>
          </div>
        </div>

        {actionNotice && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const hasRisk = job.riskEval.riskScore > 0;
            const isDup = job.dupEval.isDuplicate;

            return (
              <Card
                key={job.id}
                className={`p-5 space-y-4 border ${
                  job.riskEval.riskLevel === 'critical' || job.riskEval.riskLevel === 'high'
                    ? 'border-red-300 bg-red-50/20'
                    : hasRisk || isDup
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-neutral-900">{job.title}</h3>
                      <span
                        className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        {job.status}
                      </span>

                      {/* Freshness Badge */}
                      <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Reconfirmed 14d Active
                      </span>

                      {/* Duplicate Alert */}
                      {isDup && (
                        <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                          <Copy className="w-3 h-3" /> Duplicate ({Math.round(job.dupEval.similarity * 100)}%)
                        </span>
                      )}

                      {/* Risk Level Badge */}
                      <span
                        className={`text-3xs font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                          job.riskEval.riskLevel === 'critical'
                            ? 'bg-red-600 text-white'
                            : job.riskEval.riskLevel === 'high'
                            ? 'bg-red-100 text-red-900 border border-red-300'
                            : job.riskEval.riskLevel === 'medium'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3" /> Risk: {job.riskEval.riskLevel.toUpperCase()} ({job.riskEval.riskScore}/100)
                      </span>
                    </div>

                    <div className="text-neutral-500 text-2xs mt-1">
                      Plant: <strong className="text-neutral-800">{job.companyName}</strong> • {job.clusterName} • Trade: {job.category}
                    </div>
                    <div className="text-emerald-700 font-bold text-xs mt-1">
                      In-hand: ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}/mo • Gross: ₹{job.salary.grossMonthly.toLocaleString('en-IN')}/mo • PF: ₹{job.salary.pfDeductionMonthly} • ESIC: {job.salary.esicCovered ? 'Yes' : 'No'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Listing
                      </Button>
                    </Link>

                    {job.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleSuspend(job.id)}
                        className="text-xs font-bold"
                      >
                        Suspend / Flag
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(job.id)}
                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Approve Vacancy
                      </Button>
                    )}
                  </div>
                </div>

                {/* Risk Flags & Recommendation Bar */}
                {job.riskEval.flags.length > 0 && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Pre-moderation Triggered Red Flags:
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {job.riskEval.flags.map((flag, i) => (
                        <span key={i} className="text-3xs font-mono font-bold bg-white text-red-700 border border-red-300 px-2 py-0.5 rounded">
                          {flag}
                        </span>
                      ))}
                    </div>
                    <p className="text-2xs text-red-700 pt-0.5">
                      <strong>Auditor Recommendation:</strong> {job.riskEval.recommendation}
                    </p>
                  </div>
                )}

                {/* Duplicate details */}
                {isDup && job.dupEval.matchedJob && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold">Duplicate Candidate Match:</span>
                      <p className="text-2xs">
                        Matches existing job &quot;{job.dupEval.matchedJob.title}&quot; posted by {job.dupEval.matchedJob.companyName}. Reason: {job.dupEval.reason}.
                      </p>
                    </div>
                    <Link href={`/jobs/${job.dupEval.matchedJob.id}`}>
                      <Button size="sm" variant="outline" className="text-3xs font-bold border-purple-300">
                        Compare Target
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
