import React, { useState } from 'react';
import Head from 'next/head';
import {
  FileCheck2,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Eye,
  FileText,
  AlertCircle,
  Building2,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmployerVerificationRequest } from '../../data/demo-data';
import { trustService, VerificationMethod } from '../../services/trustService';

export default function AdminVerificationsPage() {
  const { verifications, updateVerificationStatus } = useApp();
  const { user } = useAuth();
  const [selectedVerif, setSelectedVerif] = useState<EmployerVerificationRequest | null>(null);
  const [inspectDocName, setInspectDocName] = useState<string | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('gstin_registry_check');
  const [internalNotes, setInternalNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleApprove = async (id: string, companyId: string) => {
    updateVerificationStatus(id, 'verified');
    
    // Log audit decision
    await trustService.updateEmployerVerificationStage({
      companyId: companyId || 'comp-1',
      stage: 'verified',
      reviewerId: user?.id,
      method: verificationMethod,
      documentsReviewed: ['gstin_certificate', 'udyam_msme', 'midc_plot_allotment', 'factory_license_dish'],
      notes: internalNotes || 'Statutory credentials cross-checked against Maharashtra MIDC and GSTIN records. Verified direct plant status granted.',
      decision: 'approved',
    });

    setActionSuccessMessage(`Employer verification APPROVED. Direct Factory Verified badge activated.`);
    setSelectedVerif(null);
    setInternalNotes('');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleReject = async (id: string, companyId: string) => {
    const reason = prompt(
      'Enter mandatory verification rejection reason (visible to employer):',
      'Factory address does not match MIDC plot master record or GSTIN certificate is cancelled.'
    );
    if (reason) {
      updateVerificationStatus(id, 'rejected', reason);
      
      await trustService.updateEmployerVerificationStage({
        companyId: companyId || 'comp-1',
        stage: 'rejected',
        reviewerId: user?.id,
        method: verificationMethod,
        documentsReviewed: ['gstin_certificate'],
        notes: internalNotes || 'Mismatched credentials during desk audit.',
        decision: 'rejected',
        rejectionReason: reason,
      });

      setActionSuccessMessage(`Employer verification REJECTED with logged audit notice.`);
      setSelectedVerif(null);
      setInternalNotes('');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  const handleRequestInfo = async (id: string, companyId: string) => {
    const infoDetails = prompt(
      'Specify additional information required from employer:',
      'Please submit an updated DISH Factory License renewal receipt and signed HR authorization letter.'
    );
    if (infoDetails) {
      await trustService.updateEmployerVerificationStage({
        companyId: companyId || 'comp-1',
        stage: 'additional_info_required',
        reviewerId: user?.id,
        method: verificationMethod,
        notes: `Additional info requested: ${infoDetails}`,
        decision: 'more_info_needed',
      });

      setActionSuccessMessage(`Additional info request dispatched to plant HR.`);
      setSelectedVerif(null);
      setInternalNotes('');
      setTimeout(() => setActionSuccessMessage(null), 4000);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Plant Verification Desk &amp; Statutory Audits • UdyogSetu Admin</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Plant Verification Desk &amp; Statutory Audits</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit submitted GSTIN certificates, Udyam MSME credentials, and MIDC industrial allotment documents. All reviewer notes are stored securely with strict administrative privacy.
          </p>
        </div>

        {actionSuccessMessage && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {verifications.map((v) => (
            <Card key={v.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-900">{v.companyName}</h3>
                    <span
                      className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                        v.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : v.status === 'rejected'
                          ? 'bg-red-50 text-red-800 border-red-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {v.status === 'pending' ? 'Pending Desk Audit' : v.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Location: <span className="font-semibold text-neutral-800">{v.clusterName}</span> • Submitted: {v.submittedDate}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Contact: {v.contactPerson} ({v.contactPhone})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVerif(v)}
                    className="text-xs font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" /> Inspect &amp; Audit
                  </Button>

                  {v.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(v.id, 'comp-1')}
                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestInfo(v.id, 'comp-1')}
                        className="text-xs font-bold text-amber-700 border-amber-300 hover:bg-amber-50"
                      >
                        Request Info
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(v.id, 'comp-1')}
                        className="text-xs font-bold"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Document Overview Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs">
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-500 block">GSTIN Registration:</span>
                  <span className="text-neutral-900 font-medium">27AAACS1234F1Z5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-500 block">Udyam Registration:</span>
                  <span className="text-neutral-900 font-medium">UDYAM-MH-26-0045129</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-500 block">MIDC Plot Allotment:</span>
                  <span className="text-neutral-900 font-medium">Plot G-22, Chakan Phase 2</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-500 block">DISH Factory License:</span>
                  <span className="text-neutral-900 font-medium">PUN/FAC/2012/8841</span>
                </div>
              </div>

              {v.rejectionReason && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span><strong>Rejection Reason:</strong> {v.rejectionReason}</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Audit Modal */}
        {selectedVerif && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedVerif(null)}
            title={`Audit Plant Documents: ${selectedVerif.companyName}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <p className="font-bold">Verification Checklist:</p>
                <p className="mt-0.5 text-2xs leading-relaxed">
                  Verify that the factory address explicitly mentions Chakan MIDC / Pune industrial clusters and that the legal entity matches GSTIN certificate.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-neutral-700 block">Primary Verification Method Used:</label>
                <select
                  value={verificationMethod}
                  onChange={(e) => setVerificationMethod(e.target.value as VerificationMethod)}
                  className="w-full p-2 rounded-xl border border-neutral-300 text-xs"
                >
                  <option value="gstin_registry_check">GSTIN Registry &amp; Tax Portal Crosscheck</option>
                  <option value="udyam_msme_check">MSME Udyam Database Validation</option>
                  <option value="midc_plot_allotment_check">MIDC Industrial Area Plot Allotment Check</option>
                  <option value="factory_license_dish_check">DISH Maharashtra Factory License Check</option>
                  <option value="physical_plant_audit">Physical Plant &amp; Gate Inspection</option>
                  <option value="official_email_domain">Official Corporate Email Domain Match</option>
                  <option value="manual_desk_audit">Manual Desk Audit by Trust &amp; Safety Officer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-neutral-700 block">
                  Private Auditor Internal Notes (Never visible to candidates or public):
                </label>
                <textarea
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record verification methodology, crosscheck timestamps, or specific discrepancy notes..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedVerif(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(selectedVerif.id, 'comp-1')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Approve Verification
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
