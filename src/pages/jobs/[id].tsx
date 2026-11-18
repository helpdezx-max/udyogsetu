import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Building2,
  MapPin,
  Clock,
  Banknote,
  Bus,
  Coffee,
  Bookmark,
  Share2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
  ChevronLeft,
  Users2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrustBadge } from '../../components/ui/TrustBadge';
import { Modal } from '../../components/ui/Modal';
import { trustService } from '../../services/trustService';

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { jobs, companies, isJobSaved, toggleSaveJob, openApplyModal, applications } = useApp();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Demanded Money / Registration Fee');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');
  const [copied, setCopied] = useState(false);

  const job = jobs.find((j) => j.id === id);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  if (!job) {
    return (
      <div className="flex-1 p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Vacancy Not Found</h2>
        <p className="text-xs text-neutral-500">The requested industrial vacancy may have closed or expired.</p>
        <Link href="/jobs">
          <button className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Return to Jobs Directory
          </button>
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const alreadyApplied = applications.some((a) => a.jobId === job.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await trustService.submitReport({
      jobId: job.id,
      companyId: job.companyId,
      reportCategory: reportReason as any,
      description: reportDetails,
      reporterContactAllowed: true,
    });
    setTicketNo(res.ticketNo);
    setReportSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>{`${job.title} at ${job.companyName} • Rozzy Chakan`}</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Vacancies</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* MAIN CONTENT (8 COLS) */}
          <main className="lg:col-span-8 space-y-6">
            {/* Header Box */}
            <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <TrustBadge tier={job.recruitmentTier} />
                  {job.walkInAvailable && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-[#FFF9EE] text-[#7C5104] border border-[#FAECBF]">
                      <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Walk-in Interviews Available</span>
                    </span>
                  )}
                  <span className="text-3xs text-neutral-600 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200">
                    {job.openingsCount} Openings
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-black transition-colors text-xs flex items-center gap-1 shadow-2xs"
                    title="Copy Link to Job"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span className="text-3xs font-semibold hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
                  </button>

                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-2 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-black transition-colors shadow-2xs"
                    title={saved ? 'Remove from Saved' : 'Save Job'}
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-neutral-900 text-neutral-900' : ''}`} />
                  </button>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-neutral-600">
                  <Link
                    href={company?.slug ? `/companies/${company.slug}` : `/companies`}
                    className="font-bold text-neutral-900 hover:underline flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{job.companyName}</span>
                  </Link>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{job.clusterName}</span>
                  </span>
                  <span>•</span>
                  <span className="text-neutral-500">
                    Posted {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo} days ago`}
                  </span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="pt-4 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-3xs font-bold uppercase tracking-wider text-neutral-500">
                    Guaranteed In-Hand Take-Home
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-neutral-950">
                    ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-neutral-500">/ month</span>
                  </div>
                </div>

                <div>
                  {alreadyApplied ? (
                    <button
                      disabled
                      className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application Submitted</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openApplyModal(job)}
                      className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      Apply Directly Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Walk-in Alert Banner if Applicable */}
            {job.walkInAvailable && job.walkInDetails && (
              <div className="bg-[#FFF9EE] rounded-3xl border border-[#FAECBF] p-6 space-y-4">
                <div className="flex items-center gap-2 text-[#7C5104]">
                  <CalendarCheck2 className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Confirmed Walk-in Interview Schedule</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/90 p-4 rounded-2xl border border-[#FAECBF]">
                    <div className="text-neutral-500 font-semibold text-3xs uppercase tracking-wider">Interview Dates</div>
                    <div className="font-bold text-neutral-950 text-sm mt-0.5">
                      {job.walkInDetails.interviewDates}
                    </div>
                    <div className="text-[#7C5104] mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{job.walkInDetails.reportingTime}</span>
                    </div>
                  </div>

                  <div className="bg-white/90 p-4 rounded-2xl border border-[#FAECBF]">
                    <div className="text-neutral-500 font-semibold text-3xs uppercase tracking-wider">Reporting Desk / Venue</div>
                    <div className="font-bold text-neutral-950 text-sm mt-0.5">
                      {job.walkInDetails.contactPerson}
                    </div>
                    <div className="text-neutral-600 mt-1">{job.walkInDetails.venue}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-neutral-800 mb-1.5">Mandatory Documents to Carry to Gate:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.walkInDetails.documentsToCarry.map((doc) => (
                      <span key={doc} className="text-3xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#FAECBF] text-neutral-800">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transparent Salary Breakdown */}
            <div className="bg-[#F1F8F4] rounded-3xl border border-[#D5ECE0] p-6 space-y-4">
              <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-700" />
                <span>Transparent Salary & Deductions Breakdown</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-[#D5ECE0]">
                  <span className="text-3xs font-bold uppercase text-neutral-500 tracking-wider block">Gross Salary</span>
                  <span className="text-base font-bold text-neutral-950 mt-0.5 block">
                    ₹{job.salary.grossMonthly.toLocaleString('en-IN')}
                  </span>
                  <span className="text-3xs text-neutral-400">Before deductions</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#DCF2E6] border border-[#BCE4CF]">
                  <span className="text-3xs font-bold uppercase text-[#1D603F] tracking-wider block">Net In-Hand</span>
                  <span className="text-base font-black text-[#1D603F] mt-0.5 block">
                    ₹{job.salary.inHandMonthly.toLocaleString('en-IN')}
                  </span>
                  <span className="text-3xs text-[#1D603F]">Bank deposit</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#D5ECE0]">
                  <span className="text-3xs font-bold uppercase text-neutral-500 tracking-wider block">PF (Employee)</span>
                  <span className="text-base font-bold text-neutral-950 mt-0.5 block">
                    ₹{job.salary.pfDeductionMonthly}
                  </span>
                  <span className="text-3xs text-neutral-400">EPFO account</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#D5ECE0]">
                  <span className="text-3xs font-bold uppercase text-neutral-500 tracking-wider block">Overtime (OT)</span>
                  <span className="text-base font-bold text-neutral-950 mt-0.5 block">
                    {job.salary.otHourlyRate ? `₹${job.salary.otHourlyRate}/hr` : 'As per Factory Act'}
                  </span>
                  <span className="text-3xs text-neutral-400">Paid monthly</span>
                </div>
              </div>

              {job.salary.attendanceBonusMonthly && (
                <div className="p-3.5 rounded-2xl bg-white border border-[#D5ECE0] text-xs text-neutral-800 flex items-center justify-between">
                  <span className="font-semibold">Full Attendance Incentive (26 Days Present):</span>
                  <span className="font-bold text-neutral-950">+ ₹{job.salary.attendanceBonusMonthly.toLocaleString('en-IN')} / month</span>
                </div>
              )}
            </div>

            {/* Description & Responsibilities */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-950 mb-2">Job Description</h3>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  Key Daily Responsibilities
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                  Required Technical Skills & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-semibold px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Amenities & Workplace Facilities */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-neutral-950">Workplace Facilities & Benefits</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-neutral-200 bg-[#F2F6FD] space-y-2">
                  <div className="p-2 bg-white text-blue-700 rounded-xl w-fit shadow-2xs">
                    <Bus className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-950">Transportation / Bus</h4>
                  <p className="text-neutral-600">
                    {job.busFacilityProvided ? 'Company bus pickup available.' : 'Self transport / public bus.'}
                  </p>
                  {job.busRoutes && (
                    <div className="text-3xs text-neutral-500 pt-1 border-t border-neutral-200">
                      Routes: {job.busRoutes.join(', ')}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 bg-[#FFF9EE] space-y-2">
                  <div className="p-2 bg-white text-amber-700 rounded-xl w-fit shadow-2xs">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-950">Food & Canteen</h4>
                  <p className="text-neutral-600">
                    {job.canteenProvided ? 'Subsidized hygienic thali and tea provided on-shift.' : 'Pack lunch from home.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-neutral-200 bg-[#F1F8F4] space-y-2">
                  <div className="p-2 bg-white text-emerald-700 rounded-xl w-fit shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-neutral-950">ESIC & Health</h4>
                  <p className="text-neutral-600">
                    {job.salary.esicCovered ? 'ESIC card issued for free medical treatment at Bhosari ESI Hospital.' : 'Mediclaim insurance covered.'}
                  </p>
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT SIDEBAR (4 COLS) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Fact Sheet */}
            <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-5 space-y-3.5 text-xs">
              <h3 className="font-bold text-neutral-950 text-sm pb-2 border-b border-neutral-200/80">
                Job Overview
              </h3>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Employment Type:</span>
                <span className="font-bold text-neutral-900">{job.employmentType}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Qualification:</span>
                <span className="font-bold text-neutral-900">{job.qualificationRequired}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Experience:</span>
                <span className="font-bold text-neutral-900">{job.experienceRequired}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Shift Timings:</span>
                <span className="font-bold text-neutral-900">{job.shiftType}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Gender Preference:</span>
                <span className="font-bold text-neutral-900">{job.genderPreference}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-neutral-200/50">
                <span className="text-neutral-500">Application Deadline:</span>
                <span className="font-bold text-neutral-900">{job.deadlineDate}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Verification Source:</span>
                <span className="font-semibold text-emerald-800">Direct Plant HR Desk</span>
              </div>
            </div>

            {/* Company Card */}
            {company && (
              <div className="bg-white rounded-3xl border border-neutral-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${company.logoPlaceholderBg} text-white font-bold flex items-center justify-center text-base shadow-xs`}>
                    {company.logoLetter}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-sm">{company.name}</h4>
                    <p className="text-3xs text-neutral-500">{company.industry}</p>
                    <div className="flex items-center gap-1 text-3xs text-emerald-800 font-semibold mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Udyam & MIDC Verified</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {company.description}
                </p>

                <div className="text-3xs text-neutral-500 space-y-1 pt-2 border-t border-neutral-100">
                  <div>
                    <span className="font-semibold">Plant Address:</span> {company.specificAddress}
                  </div>
                  <div>
                    <span className="font-semibold">Udyam No:</span> {company.udyamRegistrationNo}
                  </div>
                </div>

                <Link href={`/companies/${company.slug || company.id}`}>
                  <button className="w-full text-xs font-semibold py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
                    View Company Profile & Jobs
                  </button>
                </Link>
              </div>
            )}

            {/* Report Job */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="text-3xs text-neutral-400 hover:text-red-600 inline-flex items-center gap-1 transition-colors font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report this listing if money was demanded or information is inaccurate</span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setReportSubmitted(false);
        }}
        title="Report Job Listing to Anti-Fraud Desk"
      >
        {reportSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-neutral-950">Investigation Case Registered</h3>
            <div className="inline-block px-3 py-1 bg-neutral-100 rounded-lg text-xs font-mono font-bold text-neutral-800">
              Ticket: {ticketNo || 'CASE-2026-CONFIRMED'}
            </div>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Your report has been lodged with the Trust & Safety audit desk. Reporter identity is strictly protected under Rozzy whistleblower safeguards.
            </p>
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportSubmitted(false);
              }}
              className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-3"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Reason for Complaint</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white"
              >
                <option value="Demanded Money / Registration Fee">Demanded Money / Registration Fee / Security Deposit</option>
                <option value="Fake Salary">Fake / Misleading In-Hand Monthly Salary</option>
                <option value="Ghost Vacancy">Ghost Vacancy / Plant Not Hiring</option>
                <option value="Incorrect Location">Incorrect Factory Location / Bogus Address</option>
                <option value="Impersonation">Impersonation of Direct Plant HR</option>
                <option value="Suspicious External Link">Suspicious External Link / WhatsApp Group Redirect</option>
                <option value="Unsafe Working Conditions">Unsafe Working Conditions</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Details & Evidence</label>
              <textarea
                rows={3}
                required
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what occurred, who communicated, or paste phone numbers / payment demands received..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 resize-none"
              />
            </div>

            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-3xs text-neutral-500">
              Identity Protection: Your name and contact details are NEVER shared with the reported employer or recruiter.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
                Submit Anti-Fraud Complaint
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
