import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle2, ShieldCheck, AlertCircle, Building2, MapPin } from 'lucide-react';

export const ApplyModal: React.FC = () => {
  const { applyingJob, closeApplyModal, candidateProfile, submitApplication } = useApp();
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(candidateProfile.phone);
  const [shiftPreference, setShiftPreference] = useState('Any Shift');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!applyingJob) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitApplication(applyingJob.id, `${notes} | Shift Pref: ${shiftPreference}`);
    setSubmittedStatus(result);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setSubmittedStatus(null);
    setNotes('');
    closeApplyModal();
  };

  return (
    <Modal
      isOpen={!!applyingJob}
      onClose={handleClose}
      title={submittedStatus ? 'Application Submitted' : 'Direct Factory Application'}
      description={
        submittedStatus
          ? 'Your details have been registered directly with the plant recruitment team.'
          : 'Free direct job application. No charges or intermediaries.'
      }
      maxWidth="lg"
    >
      {submittedStatus ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-industrial-900">{submittedStatus.message}</h4>
            <p className="text-sm text-industrial-600 mt-1 max-w-sm mx-auto">
              You can track the progress of this application in real-time inside your{' '}
              <span className="font-semibold text-industrial-800">Candidate Dashboard</span>.
            </p>
          </div>

          <div className="bg-industrial-50 rounded-xl p-4 border border-industrial-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-industrial-500">Vacancy Applied:</span>
              <span className="font-semibold text-industrial-800">{applyingJob.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-industrial-500">Plant / Unit:</span>
              <span className="font-semibold text-industrial-800">{applyingJob.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-industrial-500">Location:</span>
              <span className="font-semibold text-industrial-800">{applyingJob.clusterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-industrial-500">Estimated In-hand:</span>
              <span className="font-bold text-emerald-700">₹{applyingJob.salary.inHandMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={handleClose} variant="primary" className="w-full sm:w-auto">
              Done & Return
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Job summary banner */}
          <div className="p-3.5 bg-industrial-50 rounded-xl border border-industrial-200 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg border border-industrial-200 text-industrial-700 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-xs text-industrial-900 truncate">{applyingJob.title}</h4>
              <p className="text-2xs text-industrial-600 truncate">{applyingJob.companyName} • {applyingJob.clusterName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xs font-bold text-emerald-700">
                  ₹{applyingJob.salary.inHandMonthly.toLocaleString('en-IN')}/month in-hand
                </span>
                <span className="text-3xs bg-industrial-200 text-industrial-700 font-semibold px-1.5 py-0.5 rounded">
                  {applyingJob.shiftType}
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Bio Info Check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-industrial-500">Applicant Profile</span>
              <span className="text-2xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct to Plant HR
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-industrial-200 text-xs space-y-1">
              <div className="font-bold text-industrial-900">{candidateProfile.fullName}</div>
              <div className="text-2xs text-industrial-600">
                {candidateProfile.highestQualification} {candidateProfile.tradeSpecialization ? `• ${candidateProfile.tradeSpecialization}` : ''}
              </div>
              <div className="text-2xs text-industrial-500">
                {candidateProfile.currentDesignation} • {candidateProfile.totalExperienceMonths} months exp
              </div>
            </div>

            <Input
              label="Contact Mobile (WhatsApp Confirmed)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1">
                Shift Availability Preference
              </label>
              <select
                value={shiftPreference}
                onChange={(e) => setShiftPreference(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Any Shift (Rotational A/B/C)">Any Shift (Rotational A/B/C)</option>
                <option value="First Shift (7:00 AM - 3:30 PM)">First Shift (7:00 AM - 3:30 PM)</option>
                <option value="General Shift (8:30 AM - 5:00 PM)">General Shift (8:30 AM - 5:00 PM)</option>
                <option value="Night Shift Only">Night Shift Only</option>
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1">
                Note for Plant HR / Line Supervisor (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Can join immediately. Experience on Fanuc VMC machines."
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-2xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              By clicking apply, your industrial bio and contact details will be shared with the verified HR department of {applyingJob.companyName}.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-industrial-100">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Application...' : 'Confirm & Send Application'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
