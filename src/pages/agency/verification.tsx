import React from 'react';
import Head from 'next/head';
import { ShieldCheck, FileCheck2, Upload } from 'lucide-react';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyVerificationPage() {
  return (
    <AgencyLayout>
      <Head>
        <title>Contractor License Verification • Agency Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Contractor License Verification</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Statutory labor contractor licenses required under Maharashtra Contract Labour rules.
          </p>
        </div>

        <Card className="p-6 space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Contractor License Verified</span>
              <p className="text-2xs text-emerald-800">
                License verified by Pune Labour Commissioner office. Valid until December 2027.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-industrial-50 rounded-xl border border-industrial-200 space-y-1">
              <span className="text-2xs font-bold uppercase text-industrial-400">EPFO Code</span>
              <div className="font-mono font-bold text-industrial-800">MH/PUN/0091820/000</div>
              <span className="text-3xs text-emerald-700 font-semibold">Active ECR filing status</span>
            </div>

            <div className="p-4 bg-industrial-50 rounded-xl border border-industrial-200 space-y-1">
              <span className="text-2xs font-bold uppercase text-industrial-400">ESIC Employer Code</span>
              <div className="font-mono font-bold text-industrial-800">33000889120000606</div>
              <span className="text-3xs text-emerald-700 font-semibold">Active ESIC remittance</span>
            </div>
          </div>
        </Card>
      </div>
    </AgencyLayout>
  );
}
