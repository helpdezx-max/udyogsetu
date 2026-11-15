import React from 'react';
import Head from 'next/head';
import { BarChart3, TrendingUp, Users2, Clock, CheckCircle2 } from 'lucide-react';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';

export default function EmployerAnalyticsPage() {
  return (
    <EmployerLayout>
      <Head>
        <title>Recruitment Analytics & Fill Rates • Plant HR</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Plant Recruitment Analytics</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Measure hiring velocity, applicant retention, and shift fulfillment efficiency across Chakan MIDC.
          </p>
        </div>

        {/* Funnel Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Total Profile Views</span>
            <div className="text-2xl font-black text-industrial-900">1,480</div>
            <span className="text-3xs text-emerald-600 font-semibold">+18% this week</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Applications Received</span>
            <div className="text-2xl font-black text-brand-700">114</div>
            <span className="text-3xs text-industrial-500">8.2% conversion rate</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Gate Interviews Held</span>
            <div className="text-2xl font-black text-amber-700">42</div>
            <span className="text-3xs text-industrial-500">88% turn-up rate</span>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-2xs font-bold uppercase text-industrial-400">Offers Accepted</span>
            <div className="text-2xl font-black text-emerald-700">28</div>
            <span className="text-3xs text-emerald-600 font-semibold">93% joined shift</span>
          </Card>
        </div>

        {/* Hiring Speed Breakdown */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-sm text-industrial-900">Average Days to Fill by Trade Role</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-industrial-800 mb-1">
                <span>VMC / CNC Machine Operator</span>
                <span className="text-brand-700 font-bold">4.2 Days (Fastest in Chakan)</span>
              </div>
              <div className="w-full h-2.5 bg-industrial-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600 rounded-full w-[35%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-industrial-800 mb-1">
                <span>MIG / CO2 Welders</span>
                <span className="text-brand-700 font-bold">5.8 Days</span>
              </div>
              <div className="w-full h-2.5 bg-industrial-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[48%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-industrial-800 mb-1">
                <span>Tool & Die Progressive Makers</span>
                <span className="text-brand-700 font-bold">11.4 Days (Specialized)</span>
              </div>
              <div className="w-full h-2.5 bg-industrial-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[78%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </EmployerLayout>
  );
}
