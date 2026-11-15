import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft, Building2, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CandidateLayout } from '../../../components/layout/CandidateLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function ApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { applications } = useApp();

  const app = applications.find((a) => a.id === id) || applications[0];

  if (!app) {
    return (
      <CandidateLayout>
        <div className="p-8 text-center text-xs text-industrial-500">
          Application not found.{' '}
          <Link href="/candidate/applications" className="text-brand-600 underline">
            Return to applications
          </Link>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <Head>
        <title>{`Application Details: ${app.jobTitle} • Candidate Portal`}</title>
      </Head>

      <div className="space-y-6">
        <Link
          href="/candidate/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-industrial-600 hover:text-brand-600"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Applications</span>
        </Link>

        <Card className="p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-industrial-100">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-industrial-900">{app.jobTitle}</h1>
                <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  {app.currentStatus}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-industrial-600">
                <span className="font-semibold text-industrial-900">{app.companyName}</span>
                <span>•</span>
                <span>{app.clusterName}</span>
              </div>
            </div>

            <Link href={`/jobs/${app.jobId}`}>
              <Button size="sm" variant="outline" className="text-xs">
                View Original Vacancy
              </Button>
            </Link>
          </div>

          {app.interviewScheduledDate && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Confirmed Interview Slot: {app.interviewScheduledDate}</span>
              </div>
              <div className="text-industrial-700">Venue: {app.interviewVenue || 'Plant Security Gate Desk'}</div>
              {app.interviewerNotes && <div className="text-2xs italic text-industrial-600">Note: "{app.interviewerNotes}"</div>}
            </div>
          )}

          <div className="text-xs space-y-2 text-industrial-700">
            <div>
              <span className="font-bold text-industrial-900">Application Reference ID:</span> {app.id}
            </div>
            <div>
              <span className="font-bold text-industrial-900">Submission Timestamp:</span> {app.appliedDate}
            </div>
            {app.candidateNotes && (
              <div>
                <span className="font-bold text-industrial-900">Your Message:</span> "{app.candidateNotes}"
              </div>
            )}
          </div>
        </Card>
      </div>
    </CandidateLayout>
  );
}
