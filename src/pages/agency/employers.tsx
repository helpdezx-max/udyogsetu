import React from 'react';
import Head from 'next/head';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyEmployersPage() {
  const { companies } = useApp();

  return (
    <AgencyLayout>
      <Head>
        <title>Associated Factories &amp; Client Mandates • Agency Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Associated Client Factories</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Registered industrial plants with authorized workforce contracts.
          </p>
        </div>

        <div className="space-y-4">
          {companies.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-industrial-200 rounded-xl bg-industrial-50/50 p-6">
              <Building2 className="w-8 h-8 text-industrial-400 mx-auto" />
              <h4 className="text-sm font-bold text-industrial-900">No Associated Client Plants Yet</h4>
              <p className="text-xs text-industrial-500 max-w-sm mx-auto">
                When your agency establishes an authorized contractor relationship with verified factories in Chakan or Khed, their mandates will appear here.
              </p>
            </div>
          ) : (
            companies.map((c) => (
              <Card key={c.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-industrial-100">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-sm text-industrial-900">{c.name}</h3>
                  </div>
                  <span className="text-2xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Verified Principal Employer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-industrial-600">
                  <div>
                    <span className="text-industrial-400 block text-2xs uppercase font-bold">Location</span>
                    <span className="font-semibold text-industrial-800">{c.clusterName}</span>
                  </div>
                  <div>
                    <span className="text-industrial-400 block text-2xs uppercase font-bold">Industry</span>
                    <span className="font-semibold text-industrial-800">{c.industry}</span>
                  </div>
                  <div>
                    <span className="text-industrial-400 block text-2xs uppercase font-bold">Employee Scale</span>
                    <span className="font-bold text-indigo-700">{c.employeeBand} Employees</span>
                  </div>
                </div>

                <div className="text-xs bg-industrial-50 p-2.5 rounded-lg border border-industrial-200 text-industrial-700">
                  <span className="font-semibold">Plant Address:</span> {c.specificAddress}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AgencyLayout>
  );
}
