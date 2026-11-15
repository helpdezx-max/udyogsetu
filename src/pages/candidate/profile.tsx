import React, { useState } from 'react';
import Head from 'next/head';
import { useApp } from '../../context/AppContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function CandidateProfilePage() {
  const { candidateProfile, updateCandidateProfile } = useApp();

  const [fullName, setFullName] = useState(candidateProfile.fullName);
  const [phone, setPhone] = useState(candidateProfile.phone);
  const [email, setEmail] = useState(candidateProfile.email);
  const [currentResidence, setCurrentResidence] = useState(candidateProfile.currentResidence);
  const [highestQualification, setHighestQualification] = useState(candidateProfile.highestQualification);
  const [tradeSpecialization, setTradeSpecialization] = useState(candidateProfile.tradeSpecialization || '');
  const [currentDesignation, setCurrentDesignation] = useState(candidateProfile.currentDesignation);
  const [totalExperienceMonths, setTotalExperienceMonths] = useState(candidateProfile.totalExperienceMonths);
  const [expectedSalaryInHand, setExpectedSalaryInHand] = useState(candidateProfile.expectedSalaryInHand);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile({
      fullName,
      phone,
      email,
      currentResidence,
      highestQualification,
      tradeSpecialization,
      currentDesignation,
      totalExperienceMonths: Number(totalExperienceMonths),
      expectedSalaryInHand: Number(expectedSalaryInHand),
      profileCompletionPercentage: 95,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <CandidateLayout>
      <Head>
        <title>My Technical Profile • Candidate Portal</title>
      </Head>

      <div className="bg-white rounded-2xl border border-industrial-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-industrial-100">
          <div>
            <h2 className="text-lg font-bold text-industrial-900">Technical Profile & Work Preferences</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Keep your contact and machine experience updated so Chakan factory HRs can shortlist you faster.
            </p>
          </div>
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Saved to Demo State
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Mobile Number (WhatsApp Enabled)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Current Residence / Area in Pune"
              value={currentResidence}
              onChange={(e) => setCurrentResidence(e.target.value)}
              placeholder="e.g. Ambethan Chowk, Chakan"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Highest Educational Qualification
              </label>
              <select
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
              >
                <option value="10th / 12th">10th / 12th Pass</option>
                <option value="ITI (Fitter/Machinist/Turner/Welder/Electrician)">ITI Certificate Holder</option>
                <option value="Diploma (Mechanical/Auto/Electrical)">Diploma in Engineering</option>
                <option value="B.E. / B.Tech (Mechanical/Prod)">B.E. / B.Tech Mechanical / Auto</option>
                <option value="Any Graduate">Graduate (BA / B.Com / B.Sc)</option>
              </select>
            </div>

            <Input
              label="Trade Specialization / NCTVT"
              value={tradeSpecialization}
              onChange={(e) => setTradeSpecialization(e.target.value)}
              placeholder="e.g. ITI Machinist (2022 batch)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Current Designation / Role"
              value={currentDesignation}
              onChange={(e) => setCurrentDesignation(e.target.value)}
            />
            <Input
              label="Total Experience (Months)"
              type="number"
              value={totalExperienceMonths}
              onChange={(e) => setTotalExperienceMonths(Number(e.target.value))}
            />
            <Input
              label="Expected In-Hand Monthly (₹)"
              type="number"
              value={expectedSalaryInHand}
              onChange={(e) => setExpectedSalaryInHand(Number(e.target.value))}
            />
          </div>

          <div className="pt-4 border-t border-industrial-100 flex justify-end">
            <Button type="submit" variant="primary" className="font-bold">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </CandidateLayout>
  );
}
