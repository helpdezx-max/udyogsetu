import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Briefcase, PlusCircle, CheckCircle2, XCircle, Eye, Clock, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { trustService } from '../../services/trustService';

export default function ManageJobsPage() {
  const { jobs, updateJobStatus, companies } = useApp();
  const currentCompany = companies[0] || null;
  const plantJobs = currentCompany ? jobs.filter((j) => j.companyId === currentCompany.id) : jobs;
  const [reconfirmNotice, setReconfirmNotice] = useState<string | null>(null);

  const handleReconfirm = async (jobId: string) => {
    const res = await trustService.reconfirmJob(jobId);
    setReconfirmNotice(res.message);
    setTimeout(() => setReconfirmNotice(null), 4000);
  };

  return (
    <EmployerLayout>
      <Head>
        <title>Manage Factory Vacancies • Plant HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-industrial-900">Manage Factory Vacancies</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Automated Freshness Engine: Vacancies must be reconfirmed every 14 days to preserve verified badges.
            </p>
          </div>
          <Link href="/employer/post-job">
            <Button variant="primary" size="sm" className="font-bold">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Vacancy
            </Button>
          </Link>
        </div>

        {reconfirmNotice && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reconfirmNotice}</span>
          </div>
        )}

        {/* Freshness Policy Alert Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Rozzy Freshness & Authenticity Policy</span>
            <p className="text-2xs text-amber-800 leading-relaxed">
              Industrial candidates depend on live, authentic vacancies. Listings unconfirmed for over 14 days enter the &quot;Reconfirmation Required&quot; queue. After 30 days without reconfirmation, listings become &quot;Temporarily Unavailable&quot; to prevent ghost recruiting.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-industrial-50 border-b border-industrial-200 text-industrial-500 uppercase tracking-wider text-2xs">
                <tr>
                  <th className="py-3 px-4">Title / Role</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">In-Hand Salary</th>
                  <th className="py-3 px-4">Freshness State</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {plantJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-industrial-500">
                      <Briefcase className="w-8 h-8 text-industrial-400 mx-auto mb-2" />
                      <p className="font-bold text-sm text-industrial-900">No Factory Vacancies Posted Yet</p>
                      <p className="text-2xs text-industrial-500 mt-1 max-w-sm mx-auto">
                        Your posted vacancies will appear here with automated 14-day freshness monitoring and candidate application tracking.
                      </p>
                      <div className="mt-3">
                        <Link href="/employer/post-job">
                          <Button size="sm" variant="primary" className="text-xs font-semibold">
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Post Your First Vacancy
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plantJobs.map((job) => {
                  const freshness = trustService.calculateFreshness(job);

                  return (
                    <tr key={job.id} className="hover:bg-industrial-50/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-industrial-900">{job.title}</div>
                        <div className="text-3xs text-industrial-500">ID: {job.id} • {job.openingsCount} Openings</div>
                      </td>
                      <td className="py-3.5 px-4 text-industrial-600">{job.category}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}/mo
                      </td>
                      <td className="py-3.5 px-4">
                        {freshness.freshnessStatus === 'newly_published' && (
                          <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                            Newly Published
                          </span>
                        )}
                        {freshness.freshnessStatus === 'active' && (
                          <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            Active ({freshness.daysUntilDue}d left)
                          </span>
                        )}
                        {freshness.freshnessStatus === 'reconfirmation_required' && (
                          <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 animate-pulse">
                            Reconfirm Due
                          </span>
                        )}
                        {freshness.freshnessStatus === 'temporarily_unavailable' && (
                          <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-300">
                            Paused (Unconfirmed)
                          </span>
                        )}
                        {freshness.freshnessStatus === 'expired' && (
                          <span className="text-3xs font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                            Closed / Expired
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-2xs font-bold px-2.5 py-0.5 rounded-full border ${
                            job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleReconfirm(job.id)}
                          className="text-2xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 inline-flex items-center gap-1 shadow-2xs"
                          title="Reconfirm vacancy is active and accepting candidates"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-600" />
                          <span>Reconfirm</span>
                        </button>
                        <Link href={`/jobs/${job.id}`}>
                          <Button size="sm" variant="outline" className="text-2xs px-2 py-1">
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            updateJobStatus(job.id, job.status === 'active' ? 'closed' : 'active')
                          }
                          className="text-2xs font-bold px-2 py-1 rounded border border-industrial-300 hover:bg-industrial-100 text-industrial-700"
                        >
                          {job.status === 'active' ? 'Pause' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </EmployerLayout>
  );
}
