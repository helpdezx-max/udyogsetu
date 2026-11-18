import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Users2, Building2, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyDashboardPage() {
  const { jobs, applications, companies } = useApp();

  const totalMandateOpenings = jobs.reduce((sum, j) => sum + j.openingsCount, 0);
  const spotWalkinCount = jobs.filter((j) => j.walkInAvailable).length;

  return (
    <AgencyLayout>
      <Head>
        <title>Recruitment Agency &amp; Contractor Portal • Rozzy</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Manpower Contractor Overview</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Distinct tier for licensed labor contractors deploying workforce to Chakan automotive manufacturing plants.
          </p>
        </div>

        {/* Agency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-indigo-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Client Plants Served</span>
            <div className="text-2xl font-black text-industrial-900 mt-1">{companies.length} Plants</div>
            <div className="text-3xs text-industrial-500 mt-1">Verified Client Master</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-brand-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Active Supply Mandates</span>
            <div className="text-2xl font-black text-brand-700 mt-1">{totalMandateOpenings} Openings</div>
            <div className="text-3xs text-industrial-500 mt-1">{jobs.length} Active Positions</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-industrial-500">Candidate Pipeline</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{applications.length} Candidates</div>
            <div className="text-3xs text-emerald-600 font-semibold">100% Zero-fee policy</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-amber-500">
            <span className="text-2xs font-bold uppercase text-industrial-500">Spot Walk-ins Scheduled</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{spotWalkinCount} Drives</div>
            <div className="text-3xs text-amber-700 font-semibold">Active Gate Drives</div>
          </Card>
        </div>

        {/* Client Plants List */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-industrial-900">Current Client Factory Mandates</h3>
            <Link href="/agency/employers" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Manage Client Accounts
            </Link>
          </div>

          {companies.length === 0 ? (
            <div className="py-8 text-center space-y-2 border border-dashed border-industrial-200 rounded-xl bg-industrial-50/50 p-6">
              <Building2 className="w-8 h-8 text-industrial-400 mx-auto" />
              <h4 className="text-sm font-bold text-industrial-900">No Client Plant Mandates Connected</h4>
              <p className="text-xs text-industrial-500 max-w-sm mx-auto">
                Licensed manpower contractors connect their verified corporate manufacturing accounts here to post authorized plant vacancies.
              </p>
              <div className="pt-1">
                <Link href="/agency/employers">
                  <Button size="sm" variant="outline" className="text-xs">
                    Connect Client Employer
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {companies.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-industrial-200 bg-industrial-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-industrial-900">{c.name}</h4>
                    <p className="text-2xs text-industrial-500">{c.clusterName} • {c.industry}</p>
                  </div>
                  <span className="text-2xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active Client
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AgencyLayout>
  );
}
