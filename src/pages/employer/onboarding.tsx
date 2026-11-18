import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const [udyam, setUdyam] = useState('UDYAM-MH-26-XXXXXXX');
  const [gstin, setGstin] = useState('27AABCXXXXXX');
  const [plotNo, setPlotNo] = useState('Plot No. 44, Phase 2 MIDC');

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/employer/dashboard');
  };

  return (
    <>
      <Head>
        <title>Plant Verification Onboarding • Rozzy</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Step 2 of 2 • Statutory Verification
            </span>
            <h1 className="text-xl font-bold text-industrial-900">Verify Physical Factory Premises</h1>
            <p className="text-xs text-industrial-500">
              Enter your statutory registration numbers to activate the Direct Factory Verified trust shield.
            </p>
          </div>

          <form onSubmit={handleFinish} className="space-y-4 text-xs">
            <Input
              label="Udyam Registration Number"
              placeholder="UDYAM-MH-26-0000000"
              value={udyam}
              onChange={(e) => setUdyam(e.target.value)}
              required
            />

            <Input
              label="GSTIN Number"
              placeholder="27XXXXXXXXXXXXX"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              required
            />

            <Input
              label="MIDC Plot & Allotment Number"
              placeholder="Plot Number, Sector"
              value={plotNo}
              onChange={(e) => setPlotNo(e.target.value)}
              required
            />

            <div className="p-3 bg-industrial-50 rounded-xl border border-industrial-200">
              <label className="block text-2xs font-bold uppercase text-industrial-600 mb-1">
                Upload Scanned Factory License (DISH) or Plot Letter
              </label>
              <input
                type="file"
                className="w-full text-2xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-industrial-200"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full font-bold">
              Submit Verification & Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
