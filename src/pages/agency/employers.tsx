import React from 'react';
import Head from 'next/head';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AgencyEmployersPage() {
  const clients = [
    {
      name: 'Sahyadri Precision Auto-Tech Ltd.',
      cluster: 'Chakan Phase 1',
      contractDuration: 'April 2026 – March 2027',
      deployedWorkers: 85,
      roles: 'Press Line Feeders, Deburring Helpers, Material Movers',
    },
    {
      name: 'Indo-German Tool & Pressings Corp.',
      cluster: 'Chakan Phase 2',
      contractDuration: 'June 2026 – May 2027',
      deployedWorkers: 60,
      roles: 'CO2 Welders, Grinders',
    },
    {
      name: 'Mahalunge Logistics Park Shed 4',
      cluster: 'Mahalunge Ingale',
      contractDuration: 'Annual Contract',
      deployedWorkers: 40,
      roles: 'Loading & Unloading Crews, Pallet Stackers',
    },
  ];

  return (
    <AgencyLayout>
      <Head>
        <title>Associated Factories & Client Mandates • Agency Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Associated Client Factories</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Registered industrial plants where Pragati Manpower Services is an authorized workforce vendor.
          </p>
        </div>

        <div className="space-y-4">
          {clients.map((c) => (
            <Card key={c.name} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-industrial-100">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm text-industrial-900">{c.name}</h3>
                </div>
                <span className="text-2xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Valid Principal Employer Certificate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-industrial-600">
                <div>
                  <span className="text-industrial-400 block text-2xs uppercase font-bold">Location</span>
                  <span className="font-semibold text-industrial-800">{c.cluster}</span>
                </div>
                <div>
                  <span className="text-industrial-400 block text-2xs uppercase font-bold">Contract Term</span>
                  <span className="font-semibold text-industrial-800">{c.contractDuration}</span>
                </div>
                <div>
                  <span className="text-industrial-400 block text-2xs uppercase font-bold">Active Deployment</span>
                  <span className="font-bold text-indigo-700">{c.deployedWorkers} Workers On-Site</span>
                </div>
              </div>

              <div className="text-xs bg-industrial-50 p-2.5 rounded-lg border border-industrial-200 text-industrial-700">
                <span className="font-semibold">Supplied Trades:</span> {c.roles}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AgencyLayout>
  );
}
