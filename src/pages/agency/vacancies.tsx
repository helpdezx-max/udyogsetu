import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Briefcase, PlusCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyVacanciesPage() {
  const { jobs } = useApp();

  const agencyJobs = jobs.filter(
    (j) => j.companyId === 'comp-5' || j.recruitmentTier === 'verified_agency'
  );

  return (
    <AgencyLayout>
      <Head>
        <title>Contractor Vacancies • Agency Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-industrial-900">Contractor & Manpower Vacancies</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Openings posted under Pragati Manpower Services labor supply license.
            </p>
          </div>
          <Link href="/employer/post-job">
            <Button variant="primary" size="sm" className="font-bold">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Post Agency Job
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {agencyJobs.map((j) => (
            <Card key={j.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-industrial-900">{j.title}</h3>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    Agency Role
                  </span>
                </div>
                <div className="text-xs text-industrial-500 mt-1">
                  Deploying at: <span className="font-semibold text-industrial-800">{j.specificLocation}</span> • Openings: <span className="font-bold text-industrial-900">{j.openingsCount}</span>
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-1">
                  In-Hand: ₹{j.salary.inHandMonthly.toLocaleString('en-IN')}/mo (PF & ESIC Covered)
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/jobs/${j.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Public Job
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AgencyLayout>
  );
}
