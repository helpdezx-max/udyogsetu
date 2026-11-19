import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { WalkInEvent, JobVacancy } from '../../data/demo-data';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export interface WalkInCardProps {
  walkin: WalkInEvent;
  correspondingJob?: JobVacancy;
  showPreRegister?: boolean;
}

export const WalkInCard: React.FC<WalkInCardProps> = ({
  walkin,
  correspondingJob,
  showPreRegister = false,
}) => {
  const router = useRouter();
  const { openApplyModal, applications } = useApp();
  const { user } = useAuth();

  const isTodayOrTomorrow =
    walkin.eventDates.toLowerCase().includes('today') ||
    walkin.eventDates.toLowerCase().includes('tomorrow');

  const alreadyApplied = correspondingJob
    ? applications.some((a) => a.jobId === correspondingJob.id)
    : false;

  // Clean salary to avoid duplicate strings like "in-hand in-hand"
  const cleanSalary = walkin.salaryDisplay.replace(/\s*in-hand/gi, '').split('+')[0].trim();

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm">
      <div className="space-y-4">
        {/* Top Header: Date Pill & Vacancy Count */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              isTodayOrTomorrow
                ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{walkin.eventDates}</span>
          </span>

          <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md shrink-0">
            {walkin.openingsCount} Openings
          </span>
        </div>

        {/* Job Title & Company */}
        <div>
          <Link href={`/jobs/${walkin.jobId}`} className="group/title block">
            <h3 className="text-base sm:text-[17px] font-bold text-zinc-950 transition-colors group-hover/title:text-blue-600 leading-snug">
              {walkin.jobTitle}
            </h3>
          </Link>

          <p className="text-xs text-zinc-500 font-medium mt-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-800 truncate">{walkin.companyName}</span>
            <span>•</span>
            <span className="truncate">{walkin.clusterName}</span>
          </p>
        </div>

        {/* Venue & Timing Details */}
        <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-700">
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900">{walkin.reportingTime}</span>
          </div>

          <div className="flex items-start gap-2 text-zinc-600">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{walkin.venueAddress}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Carry original certificates & safety shoes</span>
          </div>
        </div>
      </div>

      {/* Footer: Salary + Action Button */}
      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-zinc-950">
            {cleanSalary}{' '}
            <span className="text-xs font-normal text-zinc-500">/ mo</span>
          </div>
        </div>

        <div>
          {showPreRegister && correspondingJob ? (
            alreadyApplied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Applied</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
                    return;
                  }
                  openApplyModal(correspondingJob);
                }}
                className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Pre-Register
              </button>
            )
          ) : (
            <Link href={`/jobs/${walkin.jobId}`}>
              <button
                type="button"
                className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Venue</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
