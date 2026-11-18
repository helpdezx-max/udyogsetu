import React, { useState } from 'react';
import Head from 'next/head';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

export default function AdminReportsPage() {
  const { reports, resolveReport } = useApp();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [actionTaken, setActionTaken] = useState<string>('warning_issued');
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'resolved') return r.status !== 'pending';
    return true;
  });

  const handleOpenInvestigate = (report: any) => {
    setSelectedReport(report);
    setInvestigationNotes(
      `Investigated by ${user?.email || 'admin@udyogsetu.gov.in'}. Verified candidate claims against employer records.`
    );
  };

  const handleConfirmResolution = (status: 'resolved' | 'dismissed') => {
    if (!selectedReport) return;
    resolveReport(selectedReport.id, status);

    setResolutionMessage(
      `Case ${selectedReport.id.toUpperCase()} closed with status: ${status.toUpperCase()}. Action taken: ${actionTaken.toUpperCase()}.`
    );
    setSelectedReport(null);
    setTimeout(() => setResolutionMessage(null), 4000);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Fraud Investigations &amp; Complaints Desk • Rozzy Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Fraud Investigations &amp; Candidate Reports</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Whistleblower protection and formal investigation desk for fee demands, ghost vacancies, and fraudulent recruitment in Pune industrial clusters.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pending' ? 'bg-white text-red-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Under Investigation ({reports.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'resolved' ? 'bg-white text-emerald-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Closed Cases ({reports.filter((r) => r.status !== 'pending').length})
            </button>
          </div>
        </div>

        {resolutionMessage && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resolutionMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {filteredReports.map((r) => {
            const ticketNo = `CASE-2026-${r.id.replace('rep-', '').padStart(4, '0')}`;
            return (
              <Card
                key={r.id}
                className={`p-5 space-y-4 border ${
                  r.status === 'pending' ? 'border-red-300 bg-red-50/20' : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
                        {ticketNo}
                      </span>
                      <span className="text-3xs font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-200">
                        {r.reason}
                      </span>
                      <h3 className="font-bold text-sm text-neutral-900">{r.jobTitle}</h3>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      Hiring Company: <strong className="text-neutral-900">{r.companyName}</strong> • Candidate: {r.reportedBy} ({r.reportedDate})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-3xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        r.status === 'pending'
                          ? 'bg-red-50 text-red-800 border-red-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {r.status === 'pending' ? 'Investigation Active' : 'Resolved & Closed'}
                    </span>

                    {r.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenInvestigate(r)}
                        className="text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800"
                      >
                        Investigate Case
                      </Button>
                    ) : (
                      <span className="text-2xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Action Logged
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-neutral-800">
                  <div className="flex items-center justify-between text-2xs font-bold text-neutral-500 mb-1">
                    <span>CANDIDATE TESTIMONY &amp; WHISTLEBLOWER STATEMENT:</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <Lock className="w-3 h-3" /> Identity Protected
                    </span>
                  </div>
                  <p className="italic text-neutral-700">&quot;{r.details}&quot;</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-2xs text-neutral-500 pt-1">
                  <span>Assigned Officer: Senior Compliance Auditor (Chakan Zone)</span>
                  <span>Whistleblower Rights: Protected under platform zero-tolerance policy</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Investigation Modal */}
        {selectedReport && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedReport(null)}
            title={`Investigate Fraud Complaint: CASE-2026-${selectedReport.id.replace('rep-', '').padStart(4, '0')}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Allegation: {selectedReport.reason}
                </div>
                <p className="text-2xs text-red-800 leading-relaxed">
                  Target Company: <strong>{selectedReport.companyName}</strong> • Job: {selectedReport.jobTitle}
                </p>
                <p className="text-2xs text-neutral-700 italic pt-1 bg-white p-2 rounded border border-red-100">
                  &quot;{selectedReport.details}&quot;
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-neutral-700 block">Enforcement Action Required:</label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs"
                >
                  <option value="warning_issued">Issue Formal Regulatory Warning to Plant HR</option>
                  <option value="job_suspended">Suspend Vacancy &amp; Quarantine Job Listing</option>
                  <option value="employer_suspended">Suspend Employer Account &amp; Revoke Verification Badges</option>
                  <option value="agency_authorization_revoked">Revoke Recruitment Agency Mandate</option>
                  <option value="banned">Permanent Platform Ban &amp; Report to Industry Association</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-neutral-700 block">
                  Confidential Investigation Log &amp; Findings (Restricted Access):
                </label>
                <textarea
                  rows={3}
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                  placeholder="Record interview notes with HR, phone logs, or candidate receipt crosscheck..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConfirmResolution('dismissed')}
                  className="text-xs"
                >
                  Dismiss (Unsubstantiated)
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConfirmResolution('resolved')}
                  className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
                >
                  Apply Enforcement &amp; Close Case
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
