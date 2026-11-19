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
    <div className="bg-white border border-zinc-200/90 hover:border-zinc-300 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-subtle hover:shadow-mobbin-hover relative group">
      {/* Top Meta Bar */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          {/* Verification / Freshness Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            {job.recruitmentTier === 'verified_direct' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Verified Direct Plant</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                <span>Licensed Contractor</span>
              </span>
            )}

            {job.walkInAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                <CalendarCheck2 className="w-3 h-3 text-amber-600" />
                <span>Walk-in Gate</span>
              </span>
            )}
          </div>

          {/* Minimal Save / Bookmark Button */}
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
            className="w-8 h-8 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/80 flex items-center justify-center transition-colors shrink-0"
            title={saved ? 'Remove Bookmark' : 'Save Vacancy'}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                saved ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-500'
              }`}
            />
          </button>
        </div>

        {/* Company Avatar & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            {job.companyName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-800 truncate">
              {job.companyName}
            </h4>
            <p className="text-3xs text-zinc-500 flex items-center gap-1 truncate">
              <MapPin className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
              <span>{job.clusterName}</span>
            </p>
          </div>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`} className="block group/title">
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 leading-snug line-clamp-2 group-hover/title:text-zinc-700 transition-colors">
            {job.title}
          </h3>
        </Link>

        {/* Scannable Spec Tags (Mobbin pill style) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-3xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/50">
            {job.shiftType.split(' ')[0]} Shift
          </span>
          <span className="text-3xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/50">
            {job.qualificationRequired.split('(')[0].trim()}
          </span>
          <span className="text-3xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200/50">
            {job.openingsCount} Openings
          </span>
          {job.busFacilityProvided && (
            <span className="text-3xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
              Bus Route
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Salary + Dark Apply Button */}
      <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-3xs font-medium uppercase tracking-wider text-zinc-400">
            In-hand Salary
          </div>
          <div className="text-base sm:text-lg font-black text-zinc-950">
            ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}{' '}
            <span className="text-3xs font-normal text-zinc-500">/ mo</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/jobs/${job.id}`}>
            <span className="text-xs font-medium text-zinc-600 hover:text-zinc-950 px-2 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors inline-flex items-center gap-0.5">
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {alreadyApplied ? (
            <button
              disabled
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-xl cursor-default flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Apply now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
