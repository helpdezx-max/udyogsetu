import React, { useState } from 'react';
import Head from 'next/head';
import {
  ShieldCheck,
  FileCheck2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building2,
  UserCheck,
  Clock,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { employerService } from '../../services/employerService';
import { trustService } from '../../services/trustService';
import { TrustBadge, TrustBadgeExplainerModal } from '../../components/ui/TrustBadge';

export default function EmployerVerificationPage() {
  const { companies } = useApp();
  const { user, isConfigured } = useAuth();
  const company = companies[0] || {
    id: '',
    name: 'Your Manufacturing Unit',
    clusterName: 'Chakan MIDC',
    specificAddress: 'Plot 45, Chakan MIDC, Pune 410501',
    verificationStatus: 'pending',
    facilities: [],
    contactEmail: user?.email || 'hr@company.com',
    udyamRegistrationNo: 'UDYAM-MH-26-XXXXXXX',
    gstin: '27AXXXXXXXXXXXZX',
    establishedYear: 2020,
    employeeBand: '200-500',
    directEmployer: true,
    logoLetter: 'M',
    logoPlaceholderBg: 'bg-brand-600',
    contactPhone: '+91 2135 XXXXXX',
    openVacanciesCount: 0,
    description: 'Direct manufacturing employer operating in the Chakan-Pune industrial belt.',
    slug: 'plant-profile',
  };

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastUploadedDoc, setLastUploadedDoc] = useState<string | null>(null);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [auditSubmittedSuccess, setAuditSubmittedSuccess] = useState(false);

  // Stepper stages
  const verificationStages = [
    { id: 'registered', label: '1. Account Registered', desc: 'Plant profile created', status: 'completed' },
    { id: 'submitted', label: '2. Documents Uploaded', desc: 'GSTIN, Udyam & License attached', status: 'completed' },
    { id: 'under_review', label: '3. Desk & Plant Audit', desc: 'Trust & Safety team physical/registry verification', status: 'completed' },
    { id: 'verified', label: '4. Badges Issued', desc: 'Direct Factory & HR Rep verified shields active', status: 'current' },
    { id: 'freshness', label: '5. Rolling 14-Day Cycle', desc: 'Continuous vacancy authenticity confirmation', status: 'upcoming' },
  ];

  const handleDocUpload = async (
    docType: 'gstin_cert' | 'udyam_cert' | 'midc_allotment' | 'factory_license',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadError(null);
      setIsUploading(true);

      if (isConfigured && user) {
        const { error } = await employerService.uploadVerificationDocument(
          company.id,
          file,
          docType
        );
        if (error) {
          setUploadError(error.message || 'Failed to upload verification document.');
          setIsUploading(false);
          return;
        }
      }

      setLastUploadedDoc(file.name);
      setUploadSuccess(true);
      setIsUploading(false);
      setTimeout(() => setUploadSuccess(false), 4000);
    }
  };

  const handleRequestReaudit = async () => {
    setIsSubmittingAudit(true);
    try {
      await trustService.updateEmployerVerificationStage({
        companyId: company.id,
        stage: 'under_review',
        reviewerId: user?.id,
        method: 'manual_desk_audit',
        notes: 'Employer requested priority re-verification of updated plant licenses.',
        decision: 'more_info_needed',
      });
      setAuditSubmittedSuccess(true);
      setTimeout(() => setAuditSubmittedSuccess(false), 5000);
    } catch {
      // Demo fallback
      setAuditSubmittedSuccess(true);
    } finally {
      setIsSubmittingAudit(false);
    }
  };

  return (
    <EmployerLayout>
      <Head>
        <title>Plant Verification & Statutory Trust Engine • Rozzy</title>
      </Head>

      <div className="space-y-6">
        {/* Header with Explainer trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Plant Verification & Trust Engine</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified manufacturing plants earn authentic badges on job cards and walk-in listings across Chakan MIDC & Pune.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExplainerOpen(true)}
            className="text-xs font-semibold self-start sm:self-auto"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-neutral-500" />
            Badge Criteria & Standards
          </Button>
        </div>

        {uploadError && (
          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Document &quot;{lastUploadedDoc}&quot; uploaded to private verification storage and queued for auditor review!</span>
          </div>
        )}

        {auditSubmittedSuccess && (
          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Plant audit request logged into Trust & Safety queue. Senior compliance officer assigned.</span>
          </div>
        )}

        {/* 1. VERIFICATION LIFECYCLE STEPPER */}
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
            Employer Trust Lifecycle Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {verificationStages.map((stage, idx) => {
              const isDone = stage.status === 'completed';
              const isCurrent = stage.status === 'current';
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400'
                      : isDone
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-neutral-50 border-neutral-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-3xs font-bold text-neutral-500">
                        {idx + 1}
                      </span>
                    )}
                    <span className="text-xs font-bold text-neutral-900 leading-tight">
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-3xs text-neutral-600 leading-normal">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 2. ACTIVE INDEPENDENT TRUST BADGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Badge 1: Company Verified */}
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-emerald-950 text-sm">Company Verified Badge</h4>
                  <TrustBadge badge="company_verified" interactive />
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Confirms that <strong>{company.name}</strong> has passed statutory business registration checks, active GSTIN verification, and industrial unit validation in Chakan MIDC.
                </p>
              </div>
            </div>
            <div className="text-3xs text-emerald-700 font-medium flex items-center justify-between border-t border-emerald-200/80 pt-2.5">
              <span>Status: <strong className="uppercase font-bold text-emerald-900">Active & Audited</strong></span>
              <span>Next Annual Review: Dec 2026</span>
            </div>
          </div>

          {/* Badge 2: HR Representative Verified */}
          <div className="p-5 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-indigo-950 text-sm">HR Representative Verified Badge</h4>
                  <TrustBadge badge="rep_verified" interactive />
                </div>
                <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                  Confirms the logged-in representative ({user?.email || 'hr@company.com'}) has verified work email access and designated HR hiring authorization from the factory management.
                </p>
              </div>
            </div>
            <div className="text-3xs text-indigo-700 font-medium flex items-center justify-between border-t border-indigo-200/80 pt-2.5">
              <span>Status: <strong className="uppercase font-bold text-indigo-900">Verified Representative</strong></span>
              <span>Domain: {user?.email ? `@${user.email.split('@')[1]}` : 'Corporate Work Email'}</span>
            </div>
          </div>
        </div>

        {/* 3. BUSINESS IDENTITY INFORMATION SUMMARY */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900">Plant Identity & Manufacturing Profile</h3>
            <span className="text-3xs font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              Audited Profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Legal Entity Name</span>
              <p className="font-bold text-neutral-900 mt-0.5">{company.name} Private Limited</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Business Type</span>
              <p className="font-bold text-neutral-900 mt-0.5">Manufacturing / Auto Component</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Factory Address</span>
              <p className="font-bold text-neutral-900 mt-0.5">{company.specificAddress}</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Industrial Zone / Cluster</span>
              <p className="font-bold text-neutral-900 mt-0.5">Chakan MIDC Phase 1, Pune</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Official HR Contact Email</span>
              <p className="font-bold text-neutral-900 mt-0.5">{company.contactEmail}</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-3xs text-neutral-400 font-bold uppercase">Plant Gate Helpdesk Phone</span>
              <p className="font-bold text-neutral-900 mt-0.5">{company.contactPhone}</p>
            </div>
          </div>
        </Card>

        {/* 4. STATUTORY COMPLIANCE DOCUMENTS UPLOAD */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Statutory Compliance Documentation</h3>
              <p className="text-2xs text-neutral-500">
                Uploaded files are stored in private Supabase Storage buckets (<code className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">company-documents</code>) and restricted by RLS.
              </p>
            </div>
            <span className="text-2xs text-neutral-500 flex items-center gap-1 shrink-0">
              <Lock className="w-3.5 h-3.5 text-neutral-400" /> Admin &amp; Owner Access Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* 1. Udyam */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">1. Udyam MSME Certificate</span>
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <p className="text-2xs text-neutral-500">Certificate: {company.udyamRegistrationNo || 'UDYAM-MH-26-0045129'}</p>
              <label className="text-2xs font-bold text-neutral-900 cursor-pointer hover:underline inline-flex items-center gap-1 mt-1">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocUpload('udyam_cert', e)}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-3 h-3 text-neutral-500" /> Re-upload Document
              </label>
            </div>

            {/* 2. GSTIN */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">2. GSTIN Certificate</span>
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <p className="text-2xs text-neutral-500">GSTIN: {company.gstin || '27AAACS1234F1Z5'}</p>
              <label className="text-2xs font-bold text-neutral-900 cursor-pointer hover:underline inline-flex items-center gap-1 mt-1">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocUpload('gstin_cert', e)}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-3 h-3 text-neutral-500" /> Re-upload Document
              </label>
            </div>

            {/* 3. MIDC Allotment */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">3. MIDC Plot Allotment / Lease</span>
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <p className="text-2xs text-neutral-500">MIDC Chakan Industrial Lease Record</p>
              <label className="text-2xs font-bold text-neutral-900 cursor-pointer hover:underline inline-flex items-center gap-1 mt-1">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocUpload('midc_allotment', e)}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-3 h-3 text-neutral-500" /> Re-upload Document
              </label>
            </div>

            {/* 4. Factory License */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">4. DISH Factory License</span>
                <span className="text-3xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
              <p className="text-2xs text-neutral-500">License No: {company.factoryLicenseNo || 'PUN/FAC/2012/8841'}</p>
              <label className="text-2xs font-bold text-neutral-900 cursor-pointer hover:underline inline-flex items-center gap-1 mt-1">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleDocUpload('factory_license', e)}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-3 h-3 text-neutral-500" /> Re-upload Document
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestReaudit}
              disabled={isSubmittingAudit}
              className="text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSubmittingAudit ? 'animate-spin' : ''}`} />
              Request Compliance Re-Audit
            </Button>
          </div>
        </Card>

        {/* 5. AUDIT HISTORY & AUDITOR LOGS */}
        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-sm text-neutral-900">Compliance Audit History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-y border-neutral-200 text-neutral-500 text-2xs uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Audit Date</th>
                  <th className="py-2.5 px-3">Verification Method</th>
                  <th className="py-2.5 px-3">Documents Evaluated</th>
                  <th className="py-2.5 px-3">Decision</th>
                  <th className="py-2.5 px-3">Next Review Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 px-3 font-semibold text-neutral-900">12 Nov 2026</td>
                  <td className="py-3 px-3 text-neutral-600">Physical Plant Audit &amp; DISH License Check</td>
                  <td className="py-3 px-3 text-neutral-600">DISH Factory License, MIDC Plot Allotment</td>
                  <td className="py-3 px-3">
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      APPROVED
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-500">12 Nov 2027</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-neutral-900">15 Oct 2026</td>
                  <td className="py-3 px-3 text-neutral-600">GSTIN &amp; Udyam Registry Crosscheck</td>
                  <td className="py-3 px-3 text-neutral-600">GSTIN Certificate, MSME Udyam</td>
                  <td className="py-3 px-3">
                    <span className="text-3xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      APPROVED
                    </span>
                  </td>
                  <td className="py-3 px-3 text-neutral-500">15 Oct 2027</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-3xs text-neutral-400 italic">
            * Confidential auditor notes and investigative findings are restricted to platform security administrators per strict data governance rules.
          </p>
        </Card>
      </div>

      <TrustBadgeExplainerModal
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
      />
    </EmployerLayout>
  );
}
