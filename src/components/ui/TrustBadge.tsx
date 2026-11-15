import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Users2,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Building2,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Modal } from './Modal';

export type TrustBadgeType =
  | 'company_verified'
  | 'rep_verified'
  | 'agency_verified'
  | 'authorized_partner'
  | 'employer_confirmed'
  | 'source_confirmed'
  | 'verified_direct'
  | 'verified_agency'
  | 'walkin_drive'
  | 'verification_pending';

export interface TrustBadgeProps {
  badge?: TrustBadgeType;
  tier?: TrustBadgeType;
  className?: string;
  showIcon?: boolean;
  interactive?: boolean; // Clicking opens explanation modal
}

export const BADGE_DEFINITIONS: Record<
  TrustBadgeType,
  {
    title: string;
    shortLabel: string;
    description: string;
    criteria: string[];
    colorBg: string;
    colorText: string;
    colorBorder: string;
    icon: React.ElementType;
  }
> = {
  company_verified: {
    title: 'Company Verified',
    shortLabel: 'Company Verified',
    description: 'Confirms that the manufacturing unit’s legal identity, physical factory address, and business registration (GSTIN/Udyam/Factory License) have been vetted by UdyogSetu moderation auditors.',
    criteria: [
      'Active GSTIN registration and Maharashtra state tax filing match',
      'MSME Udyam certificate matches industrial plot records',
      'Physical factory address verified in Chakan MIDC / Khed City / Pune belt',
    ],
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-800',
    colorBorder: 'border-emerald-300',
    icon: ShieldCheck,
  },
  rep_verified: {
    title: 'HR Representative Verified',
    shortLabel: 'HR Verified',
    description: 'Confirms that the recruiter is an authorized human resources manager or plant representative acting on behalf of the registered company.',
    criteria: [
      'Official company email domain confirmed (@company.com)',
      'Official authorization letter from plant director or HR head',
      'Direct contact phone number verified by moderation desk',
    ],
    colorBg: 'bg-teal-50',
    colorText: 'text-teal-800',
    colorBorder: 'border-teal-300',
    icon: UserCheck,
  },
  agency_verified: {
    title: 'Recruitment Agency Verified',
    shortLabel: 'Agency Verified',
    description: 'Confirms that the manpower contractor holds a valid Contract Labour Regulation & Abolition (CLRA) license and registered business credentials.',
    criteria: [
      'Valid Labour Contractor License number on file',
      'Official manpower agency registration documentation audited',
      'Zero pending wage withholding or fraud complaints on UdyogSetu',
    ],
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-800',
    colorBorder: 'border-blue-300',
    icon: Users2,
  },
  authorized_partner: {
    title: 'Authorized Recruitment Partner',
    shortLabel: 'Authorized Partner',
    description: 'Confirms that the recruitment agency has an active, documented legal contract or recruitment mandate directly from the hiring factory unit.',
    criteria: [
      'Bilateral recruitment mandate letter submitted and verified',
      'Defined vacancy scope and validity period confirmed with plant HR',
      'Strict adherence to zero candidate fees mandate',
    ],
    colorBg: 'bg-indigo-50',
    colorText: 'text-indigo-800',
    colorBorder: 'border-indigo-300',
    icon: FileCheck2,
  },
  employer_confirmed: {
    title: 'Employer-Confirmed Vacancy',
    shortLabel: 'Employer Confirmed',
    description: 'Indicates that the hiring factory HR team has specifically reconfirmed this vacancy within the last 14 days as actively accepting applicants.',
    criteria: [
      'Reconfirmed by plant HR within the rolling 14-day freshness window',
      'Salary, shift, and openings count confirmed accurate',
      'Interviews scheduled at factory gate or plant HR premises',
    ],
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-900',
    colorBorder: 'border-amber-300',
    icon: CheckCircle2,
  },
  source_confirmed: {
    title: 'Source Confirmed',
    shortLabel: 'Source Confirmed',
    description: 'Indicates that the job requisition details were independently verified against official corporate career pages, plant noticeboards, or verified public notices.',
    criteria: [
      'Official corporate career portal or factory gate requisition verified',
      'Direct interview date and venue cross-referenced with company notices',
    ],
    colorBg: 'bg-sky-50',
    colorText: 'text-sky-900',
    colorBorder: 'border-sky-300',
    icon: BadgeCheck,
  },
  verified_direct: {
    title: 'Direct Factory Verified',
    shortLabel: 'Verified Plant',
    description: 'Legacy direct factory hiring badge confirming company premises and direct payroll employment.',
    criteria: ['Direct factory payroll (no contractor intermediary)', 'Premises verified in Chakan belt'],
    colorBg: 'bg-emerald-50',
    colorText: 'text-emerald-800',
    colorBorder: 'border-emerald-300',
    icon: ShieldCheck,
  },
  verified_agency: {
    title: 'Licensed Manpower Agency',
    shortLabel: 'Licensed Agency',
    description: 'Recruitment facilitated through an authorized technical contractor.',
    criteria: ['Licensed labor contractor on file', 'Authorized client relationship'],
    colorBg: 'bg-blue-50',
    colorText: 'text-blue-800',
    colorBorder: 'border-blue-200',
    icon: Users2,
  },
  walkin_drive: {
    title: 'Confirmed Walk-in Drive',
    shortLabel: 'Walk-in Confirmed',
    description: 'Plant walk-in interview with confirmed dates, reporting time, and factory gate venue.',
    criteria: ['Scheduled gate reporting hours', 'Authorized contact person at factory gate'],
    colorBg: 'bg-amber-50',
    colorText: 'text-amber-900',
    colorBorder: 'border-amber-300',
    icon: Clock,
  },
  verification_pending: {
    title: 'Verification Pending',
    shortLabel: 'Audit in Progress',
    description: 'Employer has submitted documentation; desk and plot audit currently in progress.',
    criteria: ['Statutory documents uploaded', 'Awaiting administrative verification audit'],
    colorBg: 'bg-neutral-100',
    colorText: 'text-neutral-700',
    colorBorder: 'border-neutral-300',
    icon: AlertCircle,
  },
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  badge,
  tier,
  className,
  showIcon = true,
  interactive = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const targetKey = badge || tier || 'company_verified';
  const def = BADGE_DEFINITIONS[targetKey] || BADGE_DEFINITIONS.verification_pending;
  const Icon = def.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => interactive && setModalOpen(true)}
        className={cn(
          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider border shadow-2xs transition-all',
          def.colorBg,
          def.colorText,
          def.colorBorder,
          interactive ? 'hover:brightness-95 cursor-pointer' : 'cursor-default',
          className
        )}
        title={`${def.title} • Click to view verification criteria`}
      >
        {showIcon && <Icon className="w-3 h-3 shrink-0" />}
        <span>{def.shortLabel}</span>
      </button>

      {interactive && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={def.title}
          description="UdyogSetu Trust & Authenticity Standard"
          maxWidth="md"
        >
          <div className="space-y-4 py-1 text-xs">
            <div className={cn('p-4 rounded-2xl border flex items-start gap-3', def.colorBg, def.colorBorder)}>
              <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
                <Icon className={cn('w-5 h-5', def.colorText)} />
              </div>
              <div>
                <h4 className={cn('font-bold text-sm', def.colorText)}>{def.title}</h4>
                <p className="text-2xs text-industrial-600 mt-1 leading-relaxed">{def.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-industrial-500">
                Mandatory Verification Criteria
              </span>
              <ul className="space-y-1.5">
                {def.criteria.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-2xs text-industrial-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200 text-3xs text-industrial-500">
              UdyogSetu trust badges are strictly assigned by administrative compliance auditors following document verification. Badges cannot be purchased or self-assigned.
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export const TrustBadgeExplainerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="UdyogSetu Trust & Verification Architecture"
      description="Our independent verification indicators ensure total transparency for industrial candidates."
      maxWidth="xl"
    >
      <div className="space-y-4 py-2 text-xs max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-industrial-600 text-2xs">
          To combat recruitment fraud, fake salaries, and unauthorized job postings, UdyogSetu uses independent, non-combining verification badges. Each badge represents a specific audited aspect of hiring.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              'company_verified',
              'rep_verified',
              'agency_verified',
              'authorized_partner',
              'employer_confirmed',
              'source_confirmed',
            ] as TrustBadgeType[]
          ).map((key) => {
            const def = BADGE_DEFINITIONS[key];
            const Icon = def.icon;
            return (
              <div key={key} className={cn('p-3.5 rounded-2xl border space-y-2', def.colorBg, def.colorBorder)}>
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', def.colorText)} />
                  <h4 className={cn('font-bold text-xs', def.colorText)}>{def.title}</h4>
                </div>
                <p className="text-3xs text-industrial-600 leading-relaxed">{def.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
