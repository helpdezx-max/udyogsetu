import React from 'react';
import Head from 'next/head';
import { Users2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyApplicationsPage() {
  const { applications } = useApp();

  return (
    <AgencyLayout>
      <Head>
        <title>Agency Candidate Pool • UdyogSetu Agency Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Agency Candidate Applications</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Candidates available for immediate deployment across client manufacturing units.
          </p>
        </div>

        <div className="space-y-3">
          {applications.length === 0 ? (
            <Card className="p-12 text-center text-xs text-industrial-500 border-dashed">
              <Users2 className="w-8 h-8 text-industrial-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-industrial-900">No Candidate Applications in Pool</p>
              <p className="text-2xs text-industrial-500 mt-1 max-w-sm mx-auto">
                When candidates apply to your agency-authorized plant mandates or walk-in rosters, they will appear here.
              </p>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-industrial-900 text-sm">
                    Candidate ID #{app.id.slice(0, 8)}
                  </h4>
                  <div className="text-industrial-500 text-2xs mt-0.5">
                    Applied for: <span className="font-semibold text-industrial-700">{app.jobTitle}</span> • Applied {app.appliedDate}
                  </div>
                  <div className="text-emerald-700 font-semibold mt-1">Available for deployment • Chakan &amp; Pune Corridor</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {app.currentStatus}
                  </span>
                  <Button size="sm" variant="outline" className="text-2xs px-2.5 py-1">
                    Allocate to Client Plant
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AgencyLayout>
  );
}
