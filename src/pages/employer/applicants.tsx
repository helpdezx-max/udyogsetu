import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Users2,
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  FileText,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { JobApplication } from '../../data/demo-data';

export default function EmployerApplicantsPage() {
  const { applications, updateApplicationStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.currentStatus === filterStatus;
  });

  return (
    <EmployerLayout>
      <Head>
        <title>Applicants Pipeline • Plant HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-industrial-900">Candidate Applicant Pipeline</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Review technician profiles, schedule plant gate tests, and issue offers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-industrial-500 font-semibold">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 rounded-lg border border-industrial-300 bg-white font-medium text-industrial-800"
            >
              <option value="all">All Stages ({applications.length})</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Joined">Joined</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card key={app.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-industrial-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center shrink-0">
                    M
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-industrial-900">Mahesh Santosh Shinde</h3>
                    <p className="text-xs text-industrial-500">
                      Applied for: <span className="font-semibold text-industrial-800">{app.jobTitle}</span>
                    </p>
                    <div className="flex items-center gap-3 text-2xs text-industrial-600 mt-1">
                      <span>ITI Machinist (NCVT 2022)</span>
                      <span>•</span>
                      <span>28 Months Exp</span>
                      <span>•</span>
                      <span>Residing: Chakan Ambethan</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xs font-bold px-2.5 py-0.5 rounded-full border ${
                      app.currentStatus === 'Interview Scheduled'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : app.currentStatus === 'Selected'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {app.currentStatus}
                  </span>
                  <Link href={`/employer/candidates/cand-001`}>
                    <Button size="sm" variant="outline" className="text-2xs px-2.5 py-1">
                      Full Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {app.candidateNotes && (
                <div className="text-xs bg-industrial-50 p-2.5 rounded-lg border border-industrial-200 text-industrial-700">
                  <span className="font-semibold">Candidate Message:</span> "{app.candidateNotes}"
                </div>
              )}

              {/* Action Pipeline Control */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="text-2xs font-bold text-industrial-500 uppercase">
                  Advance Recruitment Stage (Interactive Demo):
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                    className="px-2.5 py-1 rounded-md text-2xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() =>
                      updateApplicationStatus(
                        app.id,
                        'Interview Scheduled',
                        'Invited for practical CNC offset test at Gate 2 HR Desk'
                      )
                    }
                    className="px-2.5 py-1 rounded-md text-2xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'Selected', 'Offer Letter Issued')}
                    className="px-2.5 py-1 rounded-md text-2xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  >
                    Select & Offer
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'Joined')}
                    className="px-2.5 py-1 rounded-md text-2xs font-bold bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100"
                  >
                    Mark Joined
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </EmployerLayout>
  );
}
