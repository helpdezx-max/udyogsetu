import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CalendarCheck2,
  Clock,
  MapPin,
  Building2,
  Users2,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
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

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_12px_28px_rgba(217,119,6,0.08)]">
      {/* Top Header Row */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          {/* Timing / Date Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-2xs ${
              isTodayOrTomorrow
                ? 'border border-amber-500/30 bg-amber-500/10 text-amber-900'
                : 'border border-zinc-200/80 bg-zinc-100 text-zinc-800'
            }`}
          >
            {isTodayOrTomorrow && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
            )}
            <CalendarCheck2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{walkin.eventDates}</span>
          </span>

          {/* Vacancies Count Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-bold text-white shadow-2xs shrink-0">
            <Users2 className="h-3 w-3 text-zinc-300 shrink-0" />
            <span>{walkin.openingsCount} Vacancies</span>
          </span>
        </div>

        {/* Job Title & Company */}
        <div>
          <Link href={`/jobs/${walkin.jobId}`} className="group/title block">
            <h3 className="line-clamp-2 text-base sm:text-[17px] font-black text-zinc-950 transition-colors group-hover/title:text-zinc-700 leading-snug">
              {walkin.jobTitle}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium pt-1">
            <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="font-bold text-zinc-800 truncate">{walkin.companyName}</span>
            <span>•</span>
            <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-500 truncate">{walkin.clusterName}</span>
          </div>
        </div>

        {/* Plant Gate Briefing Box (High Contrast Scannable Area) */}
        <div className="rounded-xl border border-amber-200/60 bg-gradient-to-b from-amber-50/50 to-zinc-50/40 p-3.5 text-xs space-y-2.5">
          {/* Reporting Window */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shadow-2xs">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-900/70">
                Gate Reporting Window
              </span>
              <span className="font-extrabold text-zinc-950 text-xs sm:text-[13px]">
                {walkin.reportingTime}
              </span>
            </div>
          </div>

          {/* Plant Gate Address */}
          <div className="flex items-start gap-2.5 pt-1.5 border-t border-amber-200/40">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-amber-200/60 text-zinc-700 shadow-2xs mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-amber-700" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Plant Gate Desk
              </span>
              <p className="line-clamp-2 text-xs font-semibold text-zinc-800 leading-snug">
                {walkin.venueAddress}
              </p>
            </div>
          </div>

          {/* Mandatory Instructions & Safe Desk */}
          <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/40 text-[11px] text-amber-900 font-semibold gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Bring safety shoes & original documents</span>
            </div>
            {walkin.contactPhone && (
              <span className="text-zinc-500 font-normal shrink-0 hidden sm:inline">
                Desk: {walkin.contactPhone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Salary + Action Buttons */}
      <div className="mt-5 border-t border-zinc-100 pt-4 flex items-end justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            In-Hand Salary
          </span>
          <div className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
            {walkin.salaryDisplay.split('+')[0]}
            <span className="text-xs font-normal text-zinc-500 ml-1">in-hand</span>
          </div>
          <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
            <span>✓ Direct Spot Offer Letter</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showPreRegister && correspondingJob ? (
            alreadyApplied ? (
              <button
                disabled
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Pre-Registered</span>
              </button>
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
                className="flex items-center gap-1 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95 cursor-pointer"
              >
                <span>Pre-Register</span>
              </button>
            )
          ) : (
            <Link href={`/jobs/${walkin.jobId}`}>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Gate Venue</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
