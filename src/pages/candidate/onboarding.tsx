import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CheckCircle2, User, Wrench, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useApp } from '../../context/AppContext';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function CandidateOnboardingPage() {
  const router = useRouter();
  const { updateCandidateProfile } = useApp();

  const [trade, setTrade] = useState('ITI Machinist / CNC');
  const [experienceMonths, setExperienceMonths] = useState(24);
  const [preferredCluster, setPreferredCluster] = useState('Chakan MIDC Phase 1');
  const [expectedSalary, setExpectedSalary] = useState(20000);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile({
      tradeSpecialization: trade,
      totalExperienceMonths: Number(experienceMonths),
      currentResidence: preferredCluster,
      expectedSalaryInHand: Number(expectedSalary),
      profileCompletionPercentage: 90,
    });
    router.push('/candidate/dashboard');
  };

  return (
    <>
      <Head>
        <title>Quick Trade Onboarding • Candidate Portal</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              Step 2 of 2 • Trade Preferences
            </span>
            <h1 className="text-xl font-bold text-industrial-900">Set Up Your Industrial Preferences</h1>
            <p className="text-xs text-industrial-500">
              Help us match you with matching shift schedules and factory routes.
            </p>
          </div>

          <form onSubmit={handleFinish} className="space-y-4 text-xs">
            <Input
              label="Primary Technical Trade / Machine"
              placeholder="e.g. VMC Operator, Welder, Electrician"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              required
            />

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Total Shop-Floor Experience (Months)
              </label>
              <input
                type="number"
                min="0"
                value={experienceMonths}
                onChange={(e) => setExperienceMonths(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 focus:outline-none focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Preferred Industrial Area in Pune
              </label>
              <select
                value={preferredCluster}
                onChange={(e) => setPreferredCluster(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-800 focus:outline-none focus:border-brand-600"
              >
                {INDUSTRIAL_CLUSTERS.map((cl) => (
                  <option key={cl.id} value={cl.name}>
                    {cl.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Minimum Expected In-Hand Salary (₹/month)"
              type="number"
              step="500"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(Number(e.target.value))}
              required
            />

            <Button type="submit" variant="primary" className="w-full font-bold">
              Complete Setup & Open Dashboard
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
