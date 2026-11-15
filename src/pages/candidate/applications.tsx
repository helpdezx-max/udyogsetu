import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { JobApplication } from '../../data/demo-data';

export default function CandidateApplicationsPage() {
  const { applications, updateApplicationStatus } = useApp();

  const stages: JobApplication['currentStatus'][] = [
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Selected',
    'Joined',
  ];

  const getStageIndex = (status: JobApplication['currentStatus']) => {
    return stages.indexOf(status);
  };

  return (
    <CandidateLayout>
      <Head>
        <title>My Factory Applications & Interviews • UdyogSetu</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Application Status & Interview Tracking</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Track your candidacies from application submission to gate interview and spot joining.
          </p>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-8 h-8" />}
            title="No Applications Submitted Yet"
            description="Explore verified industrial vacancies across Chakan and apply directly to factory HR."
            action={
              <Link href="/jobs">
                <Button variant="primary">Browse Factory Jobs</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-5">
            {applications.map((app) => {
              const currentIndex = getStageIndex(app.currentStatus);

              return (
                <Card key={app.id} className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-industrial-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-industrial-900">{app.jobTitle}</h3>
                        <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                          ID: {app.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-industrial-600">
                        <span className="font-semibold text-industrial-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-industrial-400" />
                          {app.companyName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-industrial-400" />
                          {app.clusterName}
                        </span>
                        <span>•</span>
                        <span className="text-industrial-400">Applied on {app.appliedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/jobs/${app.jobId}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Vacancy
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* 6-Stage Timeline Stepper */}
                  <div className="py-2">
                    <div className="text-2xs font-bold uppercase tracking-wider text-industrial-400 mb-3">
                      Recruitment Progress Timeline
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {stages.map((stageName, idx) => {
                        const isCompleted = currentIndex >= idx;
                        const isCurrent = currentIndex === idx;

                        return (
                          <div
                            key={stageName}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-brand-600 text-white border-brand-600 font-bold shadow-xs'
                                : isCompleted
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                                : 'bg-industrial-50 text-industrial-400 border-industrial-200 opacity-60'
                            }`}
                          >
                            <div className="text-3xs uppercase tracking-widest font-black">
                              Step {idx + 1}
                            </div>
                            <div className="text-xs mt-0.5 truncate">{stageName}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interview Callout Box */}
                  {app.interviewScheduledDate && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Scheduled Interview & Practical Assessment</span>
                      </div>
                      <div className="text-industrial-800">
                        <span className="font-semibold">Timing:</span> {app.interviewScheduledDate}
                      </div>
                      {app.interviewVenue && (
                        <div className="text-industrial-800">
                          <span className="font-semibold">Venue:</span> {app.interviewVenue}
                        </div>
                      )}
                      {app.interviewerNotes && (
                        <div className="text-industrial-600 italic pt-1 border-t border-amber-200/80">
                          HR Note: "{app.interviewerNotes}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Status Changer (Demonstrating Frontend State) */}
                  <div className="p-3 bg-industrial-50 rounded-xl border border-dashed border-industrial-300 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-2xs font-bold text-industrial-500 uppercase">
                      Test-Drive Application Flow (Demo Control):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stages.map((stg) => (
                        <button
                          key={stg}
                          onClick={() => updateApplicationStatus(app.id, stg)}
                          className={`px-2 py-1 rounded text-3xs font-bold uppercase transition-colors ${
                            app.currentStatus === stg
                              ? 'bg-industrial-900 text-white'
                              : 'bg-white border border-industrial-300 text-industrial-700 hover:bg-industrial-100'
                          }`}
                        >
                          Mark {stg}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
