import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Briefcase,
  Users2,
  CalendarCheck2,
  ShieldCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function EmployerDashboardPage() {
  const { jobs, applications, companies } = useApp();

  const currentCompany = companies[0] || null;
  const plantJobs = currentCompany ? jobs.filter((j) => j.companyId === currentCompany.id) : jobs;

  return (
    <EmployerLayout>
      <Head>
        <title>Plant HR Recruitment Dashboard • Rozzy</title>
      </Head>

      <div className="space-y-6">
        {/* Trust & Freshness Status Alert */}
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm">
                  Plant Verification Active • Rolling 14-Day Freshness Cycle
                </h4>
                <span className="text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Verified Plant
                </span>
              </div>
              <p className="text-2xs text-neutral-600 mt-0.5">
                Your vacancies maintain candidate trust by reconfirming monthly hiring requirements every 14 days.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link href="/employer/verification">
              <Button size="sm" variant="outline" className="text-2xs font-bold">
                View Badges
              </Button>
            </Link>
            <Link href="/employer/manage-jobs">
              <Button size="sm" className="text-2xs font-bold bg-neutral-900 text-white hover:bg-neutral-800">
                Manage Vacancy Freshness
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-brand-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Active Plant Openings</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">{plantJobs.length} Vacancies</div>
            <div className="text-3xs text-emerald-700 font-semibold mt-1">Direct Factory Roles</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Total Applicants</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">{applications.length} Candidates</div>
            <div className="text-3xs text-industrial-500 mt-1">ITI & Diploma verified</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <span className="text-2xs font-bold uppercase text-industrial-500">Scheduled Interviews</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">
              {applications.filter((a) => a.currentStatus === 'Interview Scheduled').length}
            </div>
            <div className="text-3xs text-amber-700 font-semibold mt-1">Gate reporting this week</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-indigo-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Shortlisted for Offer</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">
              {applications.filter((a) => a.currentStatus === 'Shortlisted').length}
            </div>
            <div className="text-3xs text-industrial-500 mt-1">Pending HR signoff</div>
          </Card>
        </div>

        {/* Quick Post Vacancy Action Bar */}
        <div className="bg-gradient-to-r from-industrial-900 to-industrial-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base">Urgent Requirement for CNC or Assembly Line?</h3>
            <p className="text-xs text-industrial-300">
              Publish transparent vacancy requirements to local job seekers living in Chakan, Bhosari, and Talegaon.
            </p>
          </div>
          <Link href="/employer/post-job">
            <Button variant="safety" size="md" className="font-bold whitespace-nowrap">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post New Vacancy
            </Button>
          </Link>
        </div>

        {/* Active Vacancies Table */}
        <div className="bg-white rounded-2xl border border-industrial-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-industrial-900">Current Factory Vacancies</h3>
            <Link href="/employer/manage-jobs" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Manage All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-industrial-50 border-y border-industrial-200 text-industrial-500 uppercase tracking-wider text-2xs">
                <tr>
                  <th className="py-2.5 px-3">Role / Title</th>
                  <th className="py-2.5 px-3">Trade Category</th>
                  <th className="py-2.5 px-3">Openings</th>
                  <th className="py-2.5 px-3">In-Hand Salary</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {plantJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-industrial-500">
                      <Briefcase className="w-6 h-6 text-industrial-400 mx-auto mb-2" />
                      <p className="font-semibold text-neutral-800">No Active Vacancies Posted</p>
                      <p className="text-2xs text-neutral-500 mt-1">
                        Post your first manufacturing vacancy to start receiving verified local applications.
                      </p>
                      <div className="mt-3">
                        <Link href="/employer/post-job">
                          <Button size="sm" variant="outline" className="text-2xs font-semibold">
                            Post Vacancy
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plantJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-industrial-50/50">
                      <td className="py-3 px-3 font-bold text-industrial-900">{j.title}</td>
                      <td className="py-3 px-3 text-industrial-600">{j.category}</td>
                      <td className="py-3 px-3 font-semibold text-industrial-800">{j.openingsCount}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        ₹{j.salary.inHandMonthly.toLocaleString('en-IN')}/mo
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href={`/jobs/${j.id}`}>
                          <Button size="sm" variant="outline" className="text-2xs px-2.5 py-0.5">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-2xl border border-industrial-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-industrial-900">Recent Candidate Applications</h3>
            <Link href="/employer/applicants" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Review Pipeline
            </Link>
          </div>

          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="py-8 text-center space-y-2 border border-dashed border-industrial-200 rounded-xl bg-industrial-50/50 p-6">
                <Users2 className="w-8 h-8 text-industrial-400 mx-auto" />
                <h4 className="text-sm font-bold text-industrial-900">No Candidate Applications Yet</h4>
                <p className="text-xs text-industrial-500 max-w-sm mx-auto">
                  When candidates apply for your industrial vacancies or walk-in drives, their profiles will appear here for review and interview scheduling.
                </p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-industrial-200 bg-industrial-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-industrial-900">
                      Candidate ID #{app.id.slice(0, 8)}
                    </div>
                    <div className="text-2xs text-industrial-500">
                      Applied for: <span className="font-semibold text-industrial-700">{app.jobTitle}</span> • Applied {app.appliedDate}
                    </div>
                    {app.candidateNotes && (
                      <div className="text-2xs text-industrial-600 mt-1 italic">&quot;{app.candidateNotes}&quot;</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                      {app.currentStatus}
                    </span>
                    <Link href="/employer/applicants">
                      <Button size="sm" variant="outline" className="text-2xs px-2.5 py-1">
                        Action
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}
