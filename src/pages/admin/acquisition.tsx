import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  TrendingUp,
  Building2,
  Users2,
  Calendar,
  CheckCircle2,
  PlusCircle,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Filter,
  FileText,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export type PipelineStage =
  | 'prospect_identified'
  | 'research_completed'
  | 'contacted'
  | 'interested'
  | 'meeting_scheduled'
  | 'verification_started'
  | 'employer_verified'
  | 'first_vacancy_submitted'
  | 'first_vacancy_published'
  | 'active_employer'
  | 'inactive_employer';

export interface EmployerProspect {
  id: string;
  companyName: string;
  industry: string;
  industrialLocation: string;
  officialWebsite?: string;
  publicBusinessContact: string;
  contactPerson: string;
  contactRole: string;
  contactSource: string;
  outreachDate: string;
  outreachMethod: 'email' | 'phone' | 'linkedin' | 'in_person';
  responseStatus: 'no_response' | 'responsive' | 'interested' | 'not_interested' | 'follow_up_needed';
  meetingStatus: 'none' | 'scheduled' | 'completed' | 'cancelled';
  verificationStatus: 'unverified' | 'in_progress' | 'verified' | 'rejected';
  vacancyAvailability: 'immediate' | 'upcoming' | 'none' | 'unknown';
  nextFollowupDate: string;
  pipelineStage: PipelineStage;
  internalNotes: string;
}

export const PIPELINE_STAGES: { key: PipelineStage; label: string; step: number; color: string }[] = [
  { key: 'prospect_identified', label: '1. Prospect Identified', step: 1, color: 'bg-neutral-100 text-neutral-800' },
  { key: 'research_completed', label: '2. Research Completed', step: 2, color: 'bg-blue-50 text-blue-800' },
  { key: 'contacted', label: '3. Contacted', step: 3, color: 'bg-indigo-50 text-indigo-800' },
  { key: 'interested', label: '4. Interested', step: 4, color: 'bg-cyan-50 text-cyan-800' },
  { key: 'meeting_scheduled', label: '5. Meeting Scheduled', step: 5, color: 'bg-amber-50 text-amber-900' },
  { key: 'verification_started', label: '6. Verification Started', step: 6, color: 'bg-orange-50 text-orange-800' },
  { key: 'employer_verified', label: '7. Employer Verified', step: 7, color: 'bg-emerald-50 text-emerald-800' },
  { key: 'first_vacancy_submitted', label: '8. Vacancy Submitted', step: 8, color: 'bg-purple-50 text-purple-800' },
  { key: 'first_vacancy_published', label: '9. Vacancy Published', step: 9, color: 'bg-teal-50 text-teal-800' },
  { key: 'active_employer', label: '10. Active Employer', step: 10, color: 'bg-emerald-100 text-emerald-950 font-bold' },
  { key: 'inactive_employer', label: '11. Inactive Employer', step: 11, color: 'bg-rose-50 text-rose-800' },
];

export const INITIAL_PROSPECTS: EmployerProspect[] = [];

export default function EmployerAcquisitionPage() {
  const [prospects, setProspects] = useState<EmployerProspect[]>(INITIAL_PROSPECTS);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'kit' | 'scripts'>('pipeline');

  // Form state for adding new prospect
  const [newCompany, setNewCompany] = useState({
    companyName: '',
    industry: 'Auto Components Tier-1',
    industrialLocation: 'Chakan MIDC Phase 1',
    publicBusinessContact: '',
    contactPerson: '',
    contactRole: 'HR Manager',
    contactSource: 'Industrial Directory',
    outreachMethod: 'phone' as 'email' | 'phone' | 'linkedin' | 'in_person',
    nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    internalNotes: '',
  });

  const filteredProspects = prospects.filter((p) => {
    if (selectedStage !== 'all' && p.pipelineStage !== selectedStage) return false;
    if (selectedLocation !== 'all' && !p.industrialLocation.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleStageChange = (id: string, newStage: PipelineStage) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, pipelineStage: newStage } : p))
    );
  };

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.companyName.trim()) return;

    const newProspect: EmployerProspect = {
      id: `pr-${Date.now()}`,
      companyName: newCompany.companyName,
      industry: newCompany.industry,
      industrialLocation: newCompany.industrialLocation,
      publicBusinessContact: newCompany.publicBusinessContact || 'N/A',
      contactPerson: newCompany.contactPerson || 'Reception / HR Desk',
      contactRole: newCompany.contactRole,
      contactSource: newCompany.contactSource,
      outreachDate: new Date().toLocaleDateString('en-GB'),
      outreachMethod: newCompany.outreachMethod,
      responseStatus: 'no_response',
      meetingStatus: 'none',
      verificationStatus: 'unverified',
      vacancyAvailability: 'unknown',
      nextFollowupDate: newCompany.nextFollowupDate,
      pipelineStage: 'contacted',
      internalNotes: newCompany.internalNotes || 'Initial contact logged.',
    };

    setProspects([newProspect, ...prospects]);
    setIsAddModalOpen(false);
    setNewCompany({
      companyName: '',
      industry: 'Auto Components Tier-1',
      industrialLocation: 'Chakan MIDC Phase 1',
      publicBusinessContact: '',
      contactPerson: '',
      contactRole: 'HR Manager',
      contactSource: 'Industrial Directory',
      outreachMethod: 'phone',
      nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      internalNotes: '',
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Employer Acquisition Operations &amp; Funnel • Rozzy Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900">Employer Acquisition Operations</h2>
              <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                Phase 8 Pilot Ops
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Structured 11-stage BD acquisition funnel connecting verified manufacturing units across Chakan &amp; Khed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" /> Log New Prospect
            </Button>
          </div>
        </div>

        {/* Top Funnel Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3.5 space-y-1 border-l-4 border-l-neutral-800">
            <span className="text-3xs font-bold uppercase text-neutral-500">Total Pipeline</span>
            <div className="text-xl font-black text-neutral-950">{prospects.length} Plants</div>
            <span className="text-3xs text-neutral-500">Chakan &amp; Khed</span>
          </Card>

          <Card className="p-3.5 space-y-1 border-l-4 border-l-indigo-600">
            <span className="text-3xs font-bold uppercase text-neutral-500">Contacted</span>
            <div className="text-xl font-black text-indigo-700">
              {prospects.filter((p) => p.pipelineStage !== 'prospect_identified' && p.pipelineStage !== 'research_completed').length}
            </div>
            <span className="text-3xs text-neutral-500">Outreach in motion</span>
          </Card>

          <Card className="p-3.5 space-y-1 border-l-4 border-l-amber-500">
            <span className="text-3xs font-bold uppercase text-neutral-500">Meetings</span>
            <div className="text-xl font-black text-amber-700">
              {prospects.filter((p) => p.meetingStatus === 'scheduled' || p.meetingStatus === 'completed').length}
            </div>
            <span className="text-3xs text-amber-700 font-semibold">Plant Visits</span>
          </Card>

          <Card className="p-3.5 space-y-1 border-l-4 border-l-orange-500">
            <span className="text-3xs font-bold uppercase text-neutral-500">Audit Started</span>
            <div className="text-xl font-black text-orange-700">
              {prospects.filter((p) => p.verificationStatus === 'in_progress').length}
            </div>
            <span className="text-3xs text-neutral-500">GSTIN / Udyam review</span>
          </Card>

          <Card className="p-3.5 space-y-1 border-l-4 border-l-emerald-600">
            <span className="text-3xs font-bold uppercase text-neutral-500">Active Units</span>
            <div className="text-xl font-black text-emerald-700">
              {prospects.filter((p) => p.pipelineStage === 'active_employer').length}
            </div>
            <span className="text-3xs text-emerald-700 font-bold">Posting Jobs</span>
          </Card>

          <Card className="p-3.5 space-y-1 border-l-4 border-l-teal-600">
            <span className="text-3xs font-bold uppercase text-neutral-500">Conversion Rate</span>
            <div className="text-xl font-black text-teal-700">
              {Math.round(
                (prospects.filter((p) => p.pipelineStage === 'active_employer' || p.pipelineStage === 'first_vacancy_submitted').length /
                  Math.max(1, prospects.length)) *
                  100
              )}
              %
            </div>
            <span className="text-3xs text-neutral-500">Contact to Vacancy</span>
          </Card>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'pipeline'
                ? 'border-neutral-900 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            11-Stage Pipeline Desk ({filteredProspects.length})
          </button>
          <button
            onClick={() => setActiveTab('kit')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'kit'
                ? 'border-neutral-900 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Employer Introduction Kit
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'scripts'
                ? 'border-neutral-900 text-neutral-950'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Outreach Scripts (Email, Phone, Visits)
          </button>
        </div>

        {/* TAB 1: 11-STAGE PIPELINE DESK */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F7F8FA] p-3 rounded-2xl border border-[#E4E6EB]">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <Filter className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Pipeline Stage:</span>
                </div>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="text-xs p-1.5 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-800"
                >
                  <option value="all">All Stages (1-11)</option>
                  {PIPELINE_STAGES.map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
                  <span>Location:</span>
                </div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-xs p-1.5 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-800"
                >
                  <option value="all">All Locations</option>
                  <option value="phase 1">Chakan Phase 1</option>
                  <option value="phase 2">Chakan Phase 2</option>
                  <option value="phase 3">Chakan Phase 3</option>
                  <option value="phase 4">Chakan Phase 4</option>
                  <option value="khed">Khed City SEZ</option>
                  <option value="mahalunge">Mahalunge</option>
                  <option value="kuruli">Kuruli</option>
                </select>
              </div>

              <div className="text-3xs text-neutral-500 font-semibold">
                Showing {filteredProspects.length} of {prospects.length} prospect records
              </div>
            </div>

            {/* Prospects Roster */}
            <div className="space-y-3">
              {filteredProspects.length === 0 ? (
                <div className="py-12 text-center space-y-2 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 p-6">
                  <Building2 className="w-8 h-8 text-neutral-400 mx-auto" />
                  <h4 className="text-sm font-bold text-neutral-900">No Employer Prospects in Pipeline</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Log new plant prospect outreach, track HR meetings, and progress employers towards verified vacancy publishing.
                  </p>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setIsAddModalOpen(true)}
                      className="text-xs font-semibold"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Log First Plant Prospect
                    </Button>
                  </div>
                </div>
              ) : (
                filteredProspects.map((p) => {
                const stageObj = PIPELINE_STAGES.find((s) => s.key === p.pipelineStage) || PIPELINE_STAGES[0];

                return (
                  <Card key={p.id} className="p-5 hover:border-neutral-400 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-neutral-950">{p.companyName}</h3>
                          <span className={`text-3xs font-extrabold px-2.5 py-0.5 rounded-full ${stageObj.color}`}>
                            {stageObj.label}
                          </span>
                          <span
                            className={`text-3xs font-bold px-2 py-0.5 rounded-full border ${
                              p.verificationStatus === 'verified'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : p.verificationStatus === 'in_progress'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                            }`}
                          >
                            {p.verificationStatus === 'verified'
                              ? 'Verified Plant'
                              : p.verificationStatus === 'in_progress'
                              ? 'Audit In Progress'
                              : 'Unverified'}
                          </span>
                        </div>

                        <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-neutral-700">{p.industry}</span>
                          <span>•</span>
                          <span>{p.industrialLocation}</span>
                          <span>•</span>
                          <span>Source: {p.contactSource}</span>
                        </div>
                      </div>

                      {/* Stage Progression Selector */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-3xs font-bold uppercase text-neutral-500">Stage:</span>
                        <select
                          value={p.pipelineStage}
                          onChange={(e) => handleStageChange(p.id, e.target.value as PipelineStage)}
                          className="text-xs font-semibold p-1.5 rounded-lg border border-neutral-300 bg-white"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Contact & Meeting Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#F7F8FA] p-3 rounded-2xl border border-[#E4E6EB]">
                      <div>
                        <span className="text-3xs uppercase tracking-wider font-bold text-neutral-500">
                          Contact Person
                        </span>
                        <div className="font-semibold text-neutral-900 mt-0.5">{p.contactPerson}</div>
                        <div className="text-3xs text-neutral-500">{p.contactRole}</div>
                        <div className="text-3xs text-neutral-700 font-mono mt-0.5">{p.publicBusinessContact}</div>
                      </div>

                      <div>
                        <span className="text-3xs uppercase tracking-wider font-bold text-neutral-500">
                          Outreach &amp; Meeting
                        </span>
                        <div className="font-semibold text-neutral-900 mt-0.5 capitalize">
                          Via {p.outreachMethod} on {p.outreachDate}
                        </div>
                        <div className="text-3xs text-neutral-600 capitalize">Meeting: {p.meetingStatus}</div>
                        <div className="text-3xs text-neutral-600">Vacancies: {p.vacancyAvailability}</div>
                      </div>

                      <div>
                        <span className="text-3xs uppercase tracking-wider font-bold text-neutral-500">
                          Next Action Date
                        </span>
                        <div className="font-bold text-neutral-950 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{p.nextFollowupDate}</span>
                        </div>
                        <div className="text-3xs text-neutral-500 mt-1">Response: {p.responseStatus}</div>
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="text-xs text-neutral-600 flex items-start gap-2 pt-1">
                      <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <p className="italic text-2xs">&quot;{p.internalNotes}&quot;</p>
                    </div>
                  </Card>
                );
              }))}
            </div>
          </div>
        )}

        {/* TAB 2: EMPLOYER INTRODUCTION KIT */}
        {activeTab === 'kit' && (
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-neutral-900" />
                <h3 className="text-base font-bold text-neutral-950">
                  Rozzy Official Employer Introduction Kit
                </h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Standardized presentation material for plant heads, HR managers, and industrial operations directors in
                Chakan MIDC &amp; Pune District.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>The Zero-Fee Candidate Purity Pledge</span>
                  </h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed">
                    Candidates never pay registration fees, application charges, or uniform deposits on Rozzy. This
                    guarantees higher trust, genuine applicants, and higher turnouts for technical gate interviews.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Hyperlocal Shift-Ready Matching</span>
                  </h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed">
                    Candidates are pre-filtered based on PMPML transit connectivity to your specific plant gate (Phase
                    1–4, Khed City, Mahalunge) and shift preference (Shift A, B, C, or General).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Statutory Plant Verification (Udyam &amp; GSTIN)</span>
                  </h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed">
                    Every employer undergoes formal statutory auditing (Udyam registration, GSTIN, Factory License, and
                    MIDC plot allotment) before vacancies receive the &apos;Direct Verified Plant&apos; trust badge.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E6EB] space-y-2">
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <Users2 className="w-4 h-4 text-amber-600" />
                    <span>Direct HR vs. Agency Clarity</span>
                  </h4>
                  <p className="text-2xs text-neutral-600 leading-relaxed">
                    Full transparency between on-roll direct plant hiring and third-party contract staffing. Agencies
                    must upload valid client mandate letters under Contract Labour Act Form V/VI.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: OUTREACH SCRIPTS */}
        {activeTab === 'scripts' && (
          <div className="space-y-5">
            {/* Cold Email Template */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Script 1: Cold Email to Plant HR / Operations Head
                </h4>
              </div>
              <div className="bg-neutral-900 text-neutral-100 p-4 rounded-2xl text-xs font-mono space-y-2 leading-relaxed overflow-x-auto">
                <p>
                  <strong>Subject:</strong> Verified Technical Manpower for [Company Name] — Rozzy Chakan Pilot
                </p>
                <p>Dear [Name],</p>
                <p>
                  I hope this finds you well. I am writing from Rozzy, the hyperlocal employment network dedicated
                  to manufacturing plants in Chakan MIDC (Phases 1–4) and Khed City.
                </p>
                <p>
                  We are currently onboarding verified manufacturing units for our Q4 industrial pilot. We specialize in
                  connecting plant HR directly with verified ITI/Diploma technicians (CNC/VMC operators, Fitters,
                  Welders, Quality Inspectors) residing within 15 km of your plant gate.
                </p>
                <p>
                  <strong>Key Benefits:</strong>
                  <br />- Zero candidate charges: 100% free for applicants, ensuring high interview turnout.
                  <br />- Direct applicant review: Direct WhatsApp and web notifications for plant HR.
                  <br />- Free participation during the Chakan launch phase.
                </p>
                <p>
                  Could we schedule a brief 10-minute introduction at your plant office this week?
                  <br />
                  Warm regards,
                  <br />
                  Operations &amp; Growth Team, Rozzy Pune
                </p>
              </div>
            </Card>

            {/* In-Person Plant Visit Script */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Script 2: In-Person Industrial Park Visit (Field BD SOP)
                </h4>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-[#E4E6EB] text-xs text-neutral-700 space-y-2 leading-relaxed">
                <p>
                  <strong>Target:</strong> Reception Desk / Security Gate / HR Office in Chakan Phase 1-4.
                </p>
                <p>
                  <strong>Field Executive Dialogue:</strong>
                  <br />
                  &quot;नमस्कार! आम्ही उद्योगसेतू (Rozzy) पुणे येथून आलो आहोत. चाकण एमआयडीसी परिसरातील उत्पादन
                  कंपन्यांसाठी आम्ही स्थानिक कुशल तंत्रज्ञ (CNC ऑपरेटर, फिटर, वेल्डर) थेट उपलब्ध करून देत आहोत. आमच्या
                  प्लॅटफॉर्मवर उमेदवारांकडून कोणताही चार्ज घेतला जात नाही. कंपनीच्या HR व्यवस्थापकांशी किंवा प्लांट
                  हेडशी ५ मिनिटे चर्चा होऊ शकेल का? आम्ही आमचे मोफत इंडस्ट्रियल पायलट ब्राऊशर आणि व्हेरीफिकेशन फॉर्म
                  सोपवू इच्छितो.&quot;
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: ADD NEW PROSPECT */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-base font-bold text-neutral-950">Log New Industrial Prospect</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProspect} className="space-y-3 text-xs">
                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany.companyName}
                    onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                    placeholder="e.g. Pune Automotive Stamping Pvt Ltd"
                    className="w-full p-2 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Industrial Area</label>
                    <select
                      value={newCompany.industrialLocation}
                      onChange={(e) => setNewCompany({ ...newCompany, industrialLocation: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-xl bg-white"
                    >
                      <option value="Chakan MIDC Phase 1">Chakan MIDC Phase 1</option>
                      <option value="Chakan MIDC Phase 2">Chakan MIDC Phase 2</option>
                      <option value="Chakan MIDC Phase 3">Chakan MIDC Phase 3</option>
                      <option value="Chakan MIDC Phase 4">Chakan MIDC Phase 4</option>
                      <option value="Khed City SEZ">Khed City SEZ</option>
                      <option value="Mahalunge Ingale">Mahalunge Ingale</option>
                      <option value="Kuruli Industrial Belt">Kuruli Industrial Belt</option>
                      <option value="Nighoje Manufacturing Hub">Nighoje Hub</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Industry</label>
                    <select
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-xl bg-white"
                    >
                      <option value="Auto Components Tier-1">Auto Components Tier-1</option>
                      <option value="Heavy Engineering">Heavy Engineering</option>
                      <option value="Precision Machining">Precision Machining</option>
                      <option value="Stamping & Press Tools">Stamping &amp; Press Tools</option>
                      <option value="Logistics & Warehousing">Logistics &amp; Warehousing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={newCompany.contactPerson}
                      onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                      placeholder="e.g. Mr. Ganesh Shinde"
                      className="w-full p-2 border border-neutral-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={newCompany.publicBusinessContact}
                      onChange={(e) => setNewCompany({ ...newCompany, publicBusinessContact: e.target.value })}
                      placeholder="+91 2135 220000"
                      className="w-full p-2 border border-neutral-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Outreach Method</label>
                    <select
                      value={newCompany.outreachMethod}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          outreachMethod: e.target.value as 'email' | 'phone' | 'linkedin' | 'in_person',
                        })
                      }
                      className="w-full p-2 border border-neutral-300 rounded-xl bg-white"
                    >
                      <option value="in_person">In-Person Plant Visit</option>
                      <option value="phone">Telephone Call</option>
                      <option value="email">Email Outreach</option>
                      <option value="linkedin">LinkedIn InMail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">
                      Next Follow-Up Date
                    </label>
                    <input
                      type="date"
                      value={newCompany.nextFollowupDate}
                      onChange={(e) => setNewCompany({ ...newCompany, nextFollowupDate: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-500 mb-1">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={newCompany.internalNotes}
                    onChange={(e) => setNewCompany({ ...newCompany, internalNotes: e.target.value })}
                    placeholder="Log details of conversation, specific machines (VMC, CNC), and requirements..."
                    className="w-full p-2 border border-neutral-300 rounded-xl"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="font-bold">
                    Save to Funnel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
