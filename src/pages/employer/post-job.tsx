import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PlusCircle, CheckCircle2, ShieldCheck, Banknote, Bus, Coffee, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { INDUSTRIAL_CLUSTERS, JobVacancy } from '../../data/demo-data';
import { trustService } from '../../services/trustService';

export default function PostJobPage() {
  const router = useRouter();
  const { addNewJob, companies, jobs } = useApp();

  const currentCompany = companies[0] || {
    id: '',
    name: 'Manufacturing Unit',
    clusterName: 'Chakan MIDC Phase 1',
    specificAddress: 'Plot 45, Chakan MIDC, Pune 410501',
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<JobVacancy['category']>('Machining & CNC');
  const [employmentType, setEmploymentType] = useState<JobVacancy['employmentType']>('Permanent / On-Roll');
  const [qualification, setQualification] = useState<JobVacancy['qualificationRequired']>('ITI (Fitter/Machinist/Turner/Welder/Electrician)');
  const [experience, setExperience] = useState<JobVacancy['experienceRequired']>('1 - 3 Years');
  const [shiftType, setShiftType] = useState<JobVacancy['shiftType']>('Rotational 3-Shifts (A/B/C)');
  const [openings, setOpenings] = useState(5);
  const [clusterName, setClusterName] = useState(currentCompany.clusterName);
  const [specificLocation, setSpecificLocation] = useState(currentCompany.specificAddress);

  // Salary
  const [inHandMonthly, setInHandMonthly] = useState(21000);
  const [grossMonthly, setGrossMonthly] = useState(25000);
  const [pfDeductionMonthly, setPfDeductionMonthly] = useState(1950);
  const [otHourlyRate, setOtHourlyRate] = useState(115);
  const [attendanceBonus, setAttendanceBonus] = useState(1500);

  // Perks
  const [busFacility, setBusFacility] = useState(true);
  const [canteenProvided, setCanteenProvided] = useState(true);
  const [accommodationHelp, setAccommodationHelp] = useState(false);

  // Description & skills
  const [description, setDescription] = useState('');
  const [skillsRaw, setSkillsRaw] = useState('Fanuc CNC, Micrometer, Blueprint Reading');
  const [responsibilitiesRaw, setResponsibilitiesRaw] = useState('Operating machines per daily target\nMaintaining 5S at workstation\nChecking first piece with dial gauge');

  // Walk-in toggle
  const [walkInAvailable, setWalkInAvailable] = useState(false);
  const [walkInDates, setWalkInDates] = useState('Daily (Mon to Fri), 10:00 AM - 01:00 PM');
  const [walkInVenue, setWalkInVenue] = useState(currentCompany.specificAddress);

  const [isSuccess, setIsSuccess] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);
    setDuplicateNotice(null);

    // 1. Run Automated Pre-moderation & Risk Evaluation
    const riskEval = trustService.evaluateJobRisk({
      title,
      description,
      category,
      salary: {
        inHandMonthly: Number(inHandMonthly),
        grossMonthly: Number(grossMonthly),
        pfDeductionMonthly: Number(pfDeductionMonthly),
        esicCovered: true,
      },
      responsibilities: responsibilitiesRaw.split('\n').filter(Boolean),
    });

    if (riskEval.riskLevel === 'critical') {
      setModerationError(
        'Submission Blocked: Job content contains prohibited keywords (such as registration fees or deposits). Under UdyogSetu zero-charge policies, candidates cannot be charged under any circumstances.'
      );
      return;
    }

    // 2. Check for Duplicate Postings within the Company
    const dupCheck = trustService.detectDuplicateVacancies(
      { title, companyName: currentCompany.name, clusterName },
      jobs
    );

    if (dupCheck.isDuplicate) {
      setDuplicateNotice(
        `Notice: A similar active vacancy (${dupCheck.matchedJob?.title}) was detected for this facility. This listing has been routed to admin moderation for duplicate verification.`
      );
    }

    const created = await addNewJob({
      title: title || 'CNC / VMC Operator',
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      clusterName,
      specificLocation,
      industry: currentCompany.industry,
      category,
      employmentType,
      qualificationRequired: qualification,
      experienceRequired: experience,
      shiftType,
      openingsCount: Number(openings),
      salary: {
        inHandMonthly: Number(inHandMonthly),
        grossMonthly: Number(grossMonthly),
        pfDeductionMonthly: Number(pfDeductionMonthly),
        esicCovered: true,
        otHourlyRate: Number(otHourlyRate),
        attendanceBonusMonthly: Number(attendanceBonus),
      },
      busFacilityProvided: busFacility,
      canteenProvided,
      accommodationHelp,
      walkInAvailable,
      walkInDetails: walkInAvailable
        ? {
            interviewDates: walkInDates,
            reportingTime: '10:00 AM Sharp',
            venue: walkInVenue,
            contactPerson: 'Mr. Sunil Patil (Plant HR)',
            documentsToCarry: ['Resume', 'ITI Certificate', 'Aadhar Card', 'Safety Shoes'],
          }
        : undefined,
      recruitmentTier: 'verified_direct',
      description: description || 'Direct plant recruitment for manufacturing operations.',
      responsibilities: responsibilitiesRaw.split('\n').filter(Boolean),
      requiredSkills: skillsRaw.split(',').map((s) => s.trim()).filter(Boolean),
      genderPreference: 'All Eligible',
      deadlineDate: '15-Dec-2026',
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/employer/manage-jobs');
    }, 1500);
  };

  return (
    <EmployerLayout>
      <Head>
        <title>Post New Factory Vacancy • Plant HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Publish Factory Job Vacancy</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Transparent listings receive 3x more relevant applications from local candidates.
          </p>
        </div>

        {moderationError && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-300 text-red-900 text-xs font-semibold flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <span>{moderationError}</span>
          </div>
        )}

        {duplicateNotice && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{duplicateNotice}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Vacancy successfully published! Redirecting to Manage Vacancies...</span>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* 1. Basic Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-industrial-900 border-b border-industrial-100 pb-2">
                1. Role & Trade Category
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Job Title / Position"
                  placeholder="e.g. VMC Machine Operator (4-Axis Fanuc)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Technical Trade Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JobVacancy['category'])}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Machining & CNC">Machining & CNC</option>
                    <option value="Assembly & Line">Assembly & Line</option>
                    <option value="Welding & Fabrication">Welding & Fabrication</option>
                    <option value="Quality Control & CMM">Quality Control & CMM</option>
                    <option value="Maintenance & Electrical">Maintenance & Electrical</option>
                    <option value="Tool & Die">Tool & Die</option>
                    <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as JobVacancy['employmentType'])}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Permanent / On-Roll">Permanent / On-Roll</option>
                    <option value="Contractual (Fixed Term)">Contractual (Fixed Term)</option>
                    <option value="NEEM / NAPS Trainee">NEEM / NAPS Trainee</option>
                    <option value="Apprentice">Apprentice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Minimum Qualification
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value as JobVacancy['qualificationRequired'])}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="10th / 12th">10th / 12th Pass</option>
                    <option value="ITI (Fitter/Machinist/Turner/Welder/Electrician)">ITI Certificate</option>
                    <option value="Diploma (Mechanical/Auto/Electrical)">Diploma in Engineering</option>
                    <option value="B.E. / B.Tech (Mechanical/Prod)">B.E. / B.Tech Mechanical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Total Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={openings}
                    onChange={(e) => setOpenings(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 text-industrial-900 focus:outline-none focus:border-brand-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Salary Breakdown */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-industrial-900 border-b border-industrial-100 pb-2">
                2. Salary & Statutory Allowances
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Net In-Hand Monthly (₹)"
                  type="number"
                  value={inHandMonthly}
                  onChange={(e) => setInHandMonthly(Number(e.target.value))}
                  required
                />
                <Input
                  label="Gross Monthly (₹)"
                  type="number"
                  value={grossMonthly}
                  onChange={(e) => setGrossMonthly(Number(e.target.value))}
                  required
                />
                <Input
                  label="PF Deduction Monthly (₹)"
                  type="number"
                  value={pfDeductionMonthly}
                  onChange={(e) => setPfDeductionMonthly(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Overtime Rate (₹ / Hour)"
                  type="number"
                  value={otHourlyRate}
                  onChange={(e) => setOtHourlyRate(Number(e.target.value))}
                />
                <Input
                  label="Attendance Incentive Bonus (₹ / Month)"
                  type="number"
                  value={attendanceBonus}
                  onChange={(e) => setAttendanceBonus(Number(e.target.value))}
                />
              </div>
            </div>

            {/* 3. Shifts & Location */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-industrial-900 border-b border-industrial-100 pb-2">
                3. Shifts, Plant Location & Worker Perks
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Shift Timing
                  </label>
                  <select
                    value={shiftType}
                    onChange={(e) => setShiftType(e.target.value as JobVacancy['shiftType'])}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Rotational 3-Shifts (A/B/C)">Rotational 3-Shifts (A/B/C)</option>
                    <option value="Day Shift Only">Day Shift Only</option>
                    <option value="General Shift (8:30 AM - 5:00 PM)">General Shift (08:30 AM - 05:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                    Industrial Cluster
                  </label>
                  <select
                    value={clusterName}
                    onChange={(e) => setClusterName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
                  >
                    {INDUSTRIAL_CLUSTERS.map((cl) => (
                      <option key={cl.id} value={cl.name}>
                        {cl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={busFacility}
                    onChange={(e) => setBusFacility(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="font-semibold text-industrial-800">Company Bus Transportation Provided</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canteenProvided}
                    onChange={(e) => setCanteenProvided(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="font-semibold text-industrial-800">Subsidized Canteen Meal Provided</span>
                </label>
              </div>
            </div>

            {/* 4. Walk-in Toggle */}
            <div className="space-y-3 p-4 bg-amber-50/60 rounded-xl border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={walkInAvailable}
                  onChange={(e) => setWalkInAvailable(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="font-bold text-amber-900 text-xs">
                  Enable Direct Plant Gate Walk-in Interview for this Vacancy
                </span>
              </label>

              {walkInAvailable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Input
                    label="Interview Dates & Reporting Hours"
                    value={walkInDates}
                    onChange={(e) => setWalkInDates(e.target.value)}
                    placeholder="e.g. Every Monday & Wednesday, 10 AM to 1 PM"
                  />
                  <Input
                    label="Gate Reporting Venue"
                    value={walkInVenue}
                    onChange={(e) => setWalkInVenue(e.target.value)}
                    placeholder="e.g. Gate 2 HR Desk"
                  />
                </div>
              )}
            </div>

            {/* 5. Job Description & Skills */}
            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                  Job Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={responsibilitiesRaw}
                  onChange={(e) => setResponsibilitiesRaw(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 focus:outline-none focus:border-brand-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                  Required Skills & Tools (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsRaw}
                  onChange={(e) => setSkillsRaw(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-industrial-100 flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push('/employer/manage-jobs')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                Publish Vacancy
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </EmployerLayout>
  );
}
