import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Building2,
  MapPin,
  Clock,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
  ArrowUpRight,
  Briefcase,
  Users2,
  Bus,
} from 'lucide-react';
import { JobVacancy } from '../../data/demo-data';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../hooks/useLocale';

export interface JobCardProps {
  job: JobVacancy;
  index?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  const router = useRouter();
  const { toggleSaveJob, isJobSaved, openApplyModal, applications } = useApp();
  const { user } = useAuth();
  const { t } = useLocale();

  const saved = isJobSaved(job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
      {/* Top Header Row: Status Pills & Action */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {/* Status Indicators — Side-by-side, no capsule for verified, with blue tick */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
            {job.recruitmentTier === 'verified_direct' ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 shrink-0 whitespace-nowrap">
                <span>Verified Direct Plant</span>
                <svg
                  className="w-3.5 h-3.5 text-blue-600 fill-current shrink-0 inline-block"
                  viewBox="0 0 24 24"
                  aria-label="Verified"
                >
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.21.46-1.39.2-2.97-.68-4.14-1.17-.88-2.75-1.14-4.14-.68C14.67 2.66 13.43 1.75 12 1.75s-2.67.88-3.24 2.19c-1.39-.46-2.97-.2-4.14.68-.88 1.17-1.14 2.75-.68 4.14C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.24c-.46 1.39-.2 2.97.68 4.14 1.17.88 2.75 1.14 4.14.68.57 1.31 1.81 2.19 3.24 2.19s2.67-.88 3.24-2.19c1.39.46 2.97.2 4.14-.68.88-1.17 1.14-2.75.68-4.14 1.31-.57 2.19-1.81 2.19-3.24zm-11.5 4.25l-4-4 1.41-1.41L10.75 13.42l6.84-6.84 1.41 1.41-8.25 8.26z" />
                </svg>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 shrink-0 whitespace-nowrap">
                <span>Licensed Contractor</span>
              </span>
            )}

            {job.walkInAvailable && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-2xs font-semibold text-amber-800 border border-amber-200/70 shrink-0 whitespace-nowrap">
                <CalendarCheck2 className="h-3 w-3 text-amber-600" />
                <span>Walk-in Gate</span>
              </span>
            )}

            {job.postedDaysAgo === 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wider text-blue-700 border border-blue-200/60 shrink-0 whitespace-nowrap">
                Today
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
                return;
              }
              toggleSaveJob(job.id);
            }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90 ${
              saved
                ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                : 'border-zinc-200/80 bg-zinc-50/80 text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
            title={saved ? 'Remove Bookmark' : 'Save Vacancy'}
            aria-label={saved ? 'Remove Bookmark' : 'Save Vacancy'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Company Avatar & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 text-sm font-black text-white shadow-xs border border-zinc-700/40">
            {job.companyName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-xs sm:text-[13px] font-bold text-zinc-900 flex items-center gap-1.5">
              <span className="truncate">{job.companyName}</span>
              <span title="Verified Direct Plant" className="inline-flex shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-blue-600 fill-current shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.21.46-1.39.2-2.97-.68-4.14-1.17-.88-2.75-1.14-4.14-.68C14.67 2.66 13.43 1.75 12 1.75s-2.67.88-3.24 2.19c-1.39-.46-2.97-.2-4.14.68-.88 1.17-1.14 2.75-.68 4.14C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.24c-.46 1.39-.2 2.97.68 4.14 1.17.88 2.75 1.14 4.14.68.57 1.31 1.81 2.19 3.24 2.19s2.67-.88 3.24-2.19c1.39.46 2.97.2 4.14-.68.88-1.17 1.14-2.75.68-4.14 1.31-.57 2.19-1.81 2.19-3.24zm-11.5 4.25l-4-4 1.41-1.41L10.75 13.42l6.84-6.84 1.41 1.41-8.25 8.26z" />
                </svg>
              </span>
            </h4>
            <p className="flex items-center gap-1 text-[11px] text-zinc-500 font-medium truncate mt-0.5">
              <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
              <span className="truncate">{job.clusterName}</span>
            </p>
          </div>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`} className="block group/title pt-0.5">
          <h3 className="line-clamp-2 text-[15px] sm:text-base font-bold text-zinc-950 transition-colors group-hover/title:text-zinc-700 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Scannable Spec Tags (Mobbin pill style) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 border border-zinc-200/60">
            <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
            <span>{job.shiftType.split(' ')[0]} Shift</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 border border-zinc-200/60">
            <Briefcase className="h-3 w-3 text-zinc-400 shrink-0" />
            <span>{job.qualificationRequired.split('(')[0].trim()}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-zinc-100/90 px-2.5 py-1 text-[11px] font-medium text-zinc-700 border border-zinc-200/60">
            <Users2 className="h-3 w-3 text-zinc-400 shrink-0" />
            <span>{job.openingsCount} Vacancies</span>
          </span>
          {job.busFacilityProvided && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-200/60">
              <Bus className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>Bus Route</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: In-Hand Salary + Action Buttons */}
      <div className="mt-5 border-t border-zinc-100 pt-4 flex items-end justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            In-Hand Salary
          </span>
          <div className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">
            ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-zinc-500">/ mo</span>
          </div>
          <div className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
            <span>✓ ₹0 Recruitment Fee</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`}>
            <span className="inline-flex items-center gap-0.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950">
              <span>View</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>

          {alreadyApplied ? (
            <button
              disabled
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 cursor-default"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Applied</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  router.push(`/signin?redirect=${encodeURIComponent(router.asPath)}`);
                  return;
                }
                openApplyModal(job);
              }}
              className="flex items-center gap-1 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-zinc-800 active:scale-95 cursor-pointer"
            >
              <span>Apply now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
