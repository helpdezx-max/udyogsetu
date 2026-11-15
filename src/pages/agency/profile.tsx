import React from 'react';
import Head from 'next/head';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { AgencyLayout } from '../../components/layout/AgencyLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function AgencyProfilePage() {
  return (
    <AgencyLayout>
      <Head>
        <title>Agency Profile & License Details • Pragati Manpower</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Agency Commercial Profile</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Verified contractor identity displayed to candidates and client manufacturing companies.
          </p>
        </div>

        <Card className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Agency Legal Name" value="Pragati Manpower Services & Contractors" disabled />
            <Input label="Labour Contractor License" value="LAB-CON-REG-2024-81" disabled />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Chakan Office Address" value="Talegaon Chowk, Opp. State Bank, Chakan 410501" disabled />
            <Input label="Director Contact" value="+91 98220 11920 (Mr. Balasaheb Thorat)" disabled />
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Licensed contractor with valid PF / ESIC compliance and labor code registration.</span>
          </div>
        </Card>
      </div>
    </AgencyLayout>
  );
}
