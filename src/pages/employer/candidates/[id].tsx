import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Award,
  Briefcase,
  FileText,
  ChevronLeft,
  CheckCircle2,
  CalendarCheck2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EmployerLayout } from '../../../components/layout/EmployerLayout';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function CandidateDetailsEmployerPage() {
  const router = useRouter();
  const { candidateProfile, applications, updateApplicationStatus } = useApp();

  const app = applications.find((a) => a.jobId === 'job-101') || applications[0];

  return (
    <EmployerLayout>
      <Head>
        <title>{`Candidate Profile: ${candidateProfile.fullName} • Plant HR`}</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/employer/applicants"
            className="text-xs text-industrial-600 hover:text-brand-600 flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Applicants</span>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-industrial-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
                {candidateProfile.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-industrial-900">{candidateProfile.fullName}</h1>
                <p className="text-xs text-industrial-500 font-medium">
                  {candidateProfile.tradeSpecialization}
                </p>
                <div className="flex items-center gap-3 text-2xs text-industrial-600 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-industrial-400" />
                    {candidateProfile.currentResidence}
                  </span>
                  <span>•</span>
                  <span>Exp: {candidateProfile.totalExperienceMonths} Months</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {app && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                  Status: {app.currentStatus}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200">
              <span className="text-2xs font-bold uppercase text-industrial-400 block">Mobile WhatsApp</span>
              <span className="font-semibold text-industrial-900 mt-0.5 block">{candidateProfile.phone}</span>
            </div>
            <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200">
              <span className="text-2xs font-bold uppercase text-industrial-400 block">Expected In-Hand</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">
                ₹{candidateProfile.expectedSalaryInHand.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200">
              <span className="text-2xs font-bold uppercase text-industrial-400 block">Joining Notice</span>
              <span className="font-semibold text-industrial-900 mt-0.5 block">
                Immediate (within {candidateProfile.readyToJoinDays} days)
              </span>
            </div>
          </div>

          {/* Education & Experience Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-industrial-900">Technical Qualifications</h3>
            <div className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/50 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-industrial-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>{candidateProfile.highestQualification}</span>
                </span>
                <span className="text-3xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  VERIFIED NCVT
                </span>
              </div>
              <p className="text-2xs text-industrial-600">
                Specialized in 4-axis VMC machining, CNC lathe program offset checking, and precision dimensional measurement.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          {app && (
            <div className="pt-4 border-t border-industrial-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-industrial-500 font-semibold">HR Stage Action:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="safety"
                  onClick={() =>
                    updateApplicationStatus(
                      app.id,
                      'Interview Scheduled',
                      'Confirmed for practical Fanuc offset test at Gate 2'
                    )
                  }
                  className="text-xs font-bold"
                >
                  Schedule Practical Gate Test
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => updateApplicationStatus(app.id, 'Selected', 'Offer Letter Dispatched')}
                  className="text-xs font-bold"
                >
                  Issue Offer Letter
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </EmployerLayout>
  );
}
