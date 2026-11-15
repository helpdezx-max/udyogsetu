import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Briefcase,
  Bookmark,
  CalendarCheck2,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { JobCard } from '../../components/common/JobCard';

export default function CandidateDashboard() {
  const { candidateProfile, applications, savedJobIds, jobs } = useApp();

  const activeApps = applications.slice(0, 3);
  const recommendedJobs = jobs
    .filter((j) => j.category === 'Machining & CNC' || j.category === 'Assembly & Line')
    .slice(0, 2);

  return (
    <CandidateLayout>
      <Head>
        <title>Candidate Dashboard • UdyogSetu</title>
      </Head>

      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-brand-600">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase text-industrial-500">Submitted Applications</span>
                <div className="text-2xl font-black text-industrial-900 mt-0.5">{applications.length}</div>
              </div>
              <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase text-industrial-500">Upcoming Interviews</span>
                <div className="text-2xl font-black text-industrial-900 mt-0.5">
                  {applications.filter((a) => a.currentStatus === 'Interview Scheduled').length}
                </div>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xs font-bold uppercase text-industrial-500">Saved Vacancies</span>
                <div className="text-2xl font-black text-industrial-900 mt-0.5">{savedJobIds.length}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Bookmark className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Live Application Status Pipeline */}
        <div className="bg-white rounded-2xl border border-industrial-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-industrial-900">Recent Applications & Interview Pipeline</h3>
              <p className="text-xs text-industrial-500 mt-0.5">Real-time status updates from Chakan plant HR desks.</p>
            </div>
            <Link href="/candidate/applications" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-industrial-900">{app.jobTitle}</h4>
                    <span
                      className={`text-2xs font-bold px-2.5 py-0.5 rounded-full border ${
                        app.currentStatus === 'Interview Scheduled'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : app.currentStatus === 'Shortlisted'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : app.currentStatus === 'Selected'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {app.currentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-industrial-500 mt-1">
                    <span className="flex items-center gap-1 font-medium text-industrial-700">
                      <Building2 className="w-3.5 h-3.5 text-industrial-400" />
                      {app.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-industrial-400" />
                      {app.clusterName}
                    </span>
                    <span>•</span>
                    <span>Applied on {app.appliedDate}</span>
                  </div>

                  {app.interviewScheduledDate && (
                    <div className="mt-2 text-2xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Interview Time: {app.interviewScheduledDate}</span>
                    </div>
                  )}
                </div>

                <Link href={`/candidate/applications`}>
                  <Button size="sm" variant="outline" className="text-xs whitespace-nowrap">
                    Track Timeline
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs based on candidate's trade */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-industrial-900">Recommended for Your Trade (Machinist / VMC)</h3>
              <p className="text-xs text-industrial-500 mt-0.5">Matched with your ITI specialization and Chakan location preference.</p>
            </div>
            <Link href="/jobs" className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1">
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
