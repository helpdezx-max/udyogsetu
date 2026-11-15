import React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Clock,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
} from 'lucide-react';
import { JobVacancy } from '../../data/demo-data';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../hooks/useLocale';

export interface JobCardProps {
  job: JobVacancy;
  index?: number;
}

interface PastelPalette {
  bg: string;
  border: string;
  chipBg: string;
  chipText: string;
  avatarBg: string;
}

const PASTEL_PALETTES: PastelPalette[] = [
  {
    // Pale Lavender
    bg: 'bg-[#F7F4FC]',
    border: 'border-[#E8E0F5]',
    chipBg: 'bg-[#EDE5F8]',
    chipText: 'text-[#4F2D87]',
    avatarBg: 'bg-[#5B329B]',
  },
  {
    // Mint / Sage
    bg: 'bg-[#F1F8F4]',
    border: 'border-[#D5ECE0]',
    chipBg: 'bg-[#DCF2E6]',
    chipText: 'text-[#1D603F]',
    avatarBg: 'bg-[#186341]',
  },
  {
    // Soft Airy Blue
    bg: 'bg-[#F2F6FD]',
    border: 'border-[#D8E6FA]',
    chipBg: 'bg-[#DFEDFC]',
    chipText: 'text-[#1B4D8D]',
    avatarBg: 'bg-[#1D4ED8]',
  },
  {
    // Blush / Warm Peach
    bg: 'bg-[#FAF4F0]',
    border: 'border-[#F4E3DA]',
    chipBg: 'bg-[#F8E7DF]',
    chipText: 'text-[#873A21]',
    avatarBg: 'bg-[#C2410C]',
  },
  {
    // Refined Slate Gray
    bg: 'bg-[#F7F8FA]',
    border: 'border-[#E4E6EB]',
    chipBg: 'bg-[#EAECEF]',
    chipText: 'text-[#374151]',
    avatarBg: 'bg-[#334155]',
  },
  {
    // Pale Butter Cream
    bg: 'bg-[#FFF9EE]',
    border: 'border-[#FAECBF]',
    chipBg: 'bg-[#FAEDC8]',
    chipText: 'text-[#7C5104]',
    avatarBg: 'bg-[#B45309]',
  },
];

export const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  const { toggleSaveJob, isJobSaved, openApplyModal, applications } = useApp();
  const { t } = useLocale();

  const saved = isJobSaved(job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);
  
  // Choose palette based on job id hash or index
  const hash = job.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), index);
  const palette = PASTEL_PALETTES[hash % PASTEL_PALETTES.length];

  return (
    <div
      className={`${palette.bg} ${palette.border} border rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-0.5 relative group`}
    >
      {/* Top Meta Bar */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          {/* Verification / Freshness Badge */}
          <div className="flex flex-wrap items-center gap-1.5">
            {job.recruitmentTier === 'verified_direct' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/90 text-emerald-800 border border-emerald-200 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Plant</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/90 text-blue-800 border border-blue-200 shadow-2xs">
                <span>Licensed Agency</span>
              </span>
            )}

            {job.walkInAvailable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/90 text-amber-900 border border-amber-200">
                <CalendarCheck2 className="w-3 h-3 text-amber-600" />
                <span>Walk-in</span>
              </span>
            )}
          </div>

          {/* Minimal Save Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleSaveJob(job.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 border border-neutral-200/60 shadow-2xs flex items-center justify-center transition-colors shrink-0"
            title={saved ? 'Remove Bookmark' : 'Save Vacancy'}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                saved ? 'fill-neutral-900 text-neutral-900' : 'text-neutral-500'
              }`}
            />
          </button>
        </div>

        {/* Company Avatar & Name */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl ${palette.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0`}
          >
            {job.companyName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-neutral-800 truncate">
              {job.companyName}
            </h4>
            <p className="text-3xs text-neutral-500 flex items-center gap-1 truncate">
              <MapPin className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
              <span>{job.clusterName}</span>
            </p>
          </div>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`} className="block group-hover:underline">
          <h3 className="text-base font-bold text-neutral-950 leading-snug line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Scannable Spec Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className={`text-3xs font-semibold px-2 py-0.5 rounded-lg ${palette.chipBg} ${palette.chipText}`}>
            {job.shiftType.split(' ')[0]}
          </span>
          <span className="text-3xs font-semibold px-2 py-0.5 rounded-lg bg-white/80 text-neutral-700 border border-neutral-200/60">
            {job.qualificationRequired.split('(')[0].trim()}
          </span>
          <span className="text-3xs font-semibold px-2 py-0.5 rounded-lg bg-white/80 text-neutral-700 border border-neutral-200/60">
            {job.openingsCount} Openings
          </span>
          {job.busFacilityProvided && (
            <span className="text-3xs font-semibold px-2 py-0.5 rounded-lg bg-white/80 text-blue-800 border border-blue-200/50">
              Bus Facility
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Salary + Dark Apply Button */}
      <div className="pt-5 mt-4 border-t border-black/5 flex items-center justify-between gap-3">
        <div>
          <div className="text-3xs font-bold uppercase tracking-wider text-neutral-500">
            In-hand Salary
          </div>
          <div className="text-base sm:text-lg font-black text-neutral-950">
            ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}{' '}
            <span className="text-3xs font-medium text-neutral-500">/ mo</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/jobs/${job.id}`}>
            <button className="text-3xs font-bold text-neutral-600 hover:text-black px-2 py-1.5 rounded-lg">
              Details
            </button>
          </Link>

          {alreadyApplied ? (
            <button
              disabled
              className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-xl cursor-default flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openApplyModal(job)}
              className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
            >
              Apply now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
