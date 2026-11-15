import React from 'react';
import Head from 'next/head';
import { Users2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminAgenciesPage() {
  const agencies = [
    {
      name: 'Pragati Manpower Services & Contractors',
      cluster: 'Chakan MIDC Phase 1',
      license: 'LAB-CON-REG-2024-81',
      director: 'Mr. Balasaheb Thorat',
      status: 'verified',
      clientCount: 4,
    },
    {
      name: 'Apex Industrial Manpower Solutions',
      cluster: 'Chakan MIDC Phase 2',
      license: 'LAB-CON-REG-2023-44',
      director: 'Mr. Anil Gite',
      status: 'verified',
      clientCount: 3,
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Recruitment Agency & Contractor Management • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Labor Contractor & Agency Auditing</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Licensed labor contractors compliant with statutory EPFO and ESIC registrations.
          </p>
        </div>

        <div className="space-y-4">
          {agencies.map((agency) => (
            <Card key={agency.name} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-industrial-900">{agency.name}</h3>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    License Audited
                  </span>
                </div>
                <div className="text-industrial-500 text-2xs mt-1">
                  License: <span className="font-mono text-industrial-800">{agency.license}</span> • {agency.cluster}
                </div>
                <div className="text-industrial-600 mt-1">
                  Authorized Signatory: <span className="font-semibold text-industrial-800">{agency.director}</span> • Active Clients: {agency.clientCount} Plants
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-2xs px-2.5 py-1">
                  Inspect ECR Compliance
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
