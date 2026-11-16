import React, { useState } from 'react';
import Head from 'next/head';
import { CalendarCheck2, Clock, MapPin, CheckCircle2, User, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function EmployerInterviewsPage() {
  const { applications, updateApplicationStatus } = useApp();

  const scheduled = applications.filter((a) => a.currentStatus === 'Interview Scheduled');

  return (
    <EmployerLayout>
      <Head>
        <title>Interview & Walk-in Management • Plant HR</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Plant Interview Schedule & Walk-ins</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Manage candidates arriving at your plant security gate for machine shop practical tests.
          </p>
        </div>

        <div className="space-y-4">
          {scheduled.length === 0 ? (
            <Card className="p-8 text-center text-xs text-industrial-500 border-dashed">
              No interviews scheduled currently. Shortlist candidates from your applicant pipeline to schedule slots.
            </Card>
          ) : (
            scheduled.map((app) => (
              <Card key={app.id} className="p-5 border-amber-300 bg-amber-50/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-amber-200/60">
                  <div>
                    <span className="text-2xs font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                      Confirmed Gate Interview
                    </span>
                    <h3 className="font-bold text-base text-industrial-900 mt-1">
                      Candidate ID #{app.id.slice(0, 8)}
                    </h3>
                    <p className="text-xs text-industrial-600">Candidate for: {app.jobTitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {app.interviewScheduledDate}
                    </span>
                    <span className="text-3xs text-industrial-500">Security Gate pass pre-authorized</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-industrial-700">
                  <div>
                    <span className="font-semibold">Assessment Type:</span> Technical &amp; Safety Gate Evaluation
                  </div>
                  {app.interviewerNotes && (
                    <div className="italic text-2xs text-industrial-600">Note: "{app.interviewerNotes}"</div>
                  )}
                </div>

                <div className="pt-2 border-t border-industrial-100 flex items-center justify-between">
                  <span className="text-2xs text-industrial-500 font-semibold">Post-Interview Decision:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateApplicationStatus(app.id, 'Selected', 'Passed practical test with 95% score')}
                      className="text-xs font-bold"
                    >
                      Pass & Select
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                      className="text-xs"
                    >
                      Needs Second Round
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </EmployerLayout>
  );
}
