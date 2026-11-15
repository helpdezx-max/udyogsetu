import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Building2, ShieldCheck, MapPin, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminEmployersPage() {
  const { companies } = useApp();

  return (
    <AdminLayout>
      <Head>
        <title>Employer Directory & Audit • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Employer Management Desk</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Overview of all manufacturing entities registered on the Chakan platform.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-industrial-50 border-b border-industrial-200 text-industrial-500 uppercase tracking-wider text-2xs">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Cluster</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Udyam No</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-industrial-50/50">
                    <td className="py-3.5 px-4 font-bold text-industrial-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-industrial-600">{c.clusterName}</td>
                    <td className="py-3.5 px-4 text-industrial-600">{c.industry}</td>
                    <td className="py-3.5 px-4 font-mono text-2xs text-industrial-700">
                      {c.udyamRegistrationNo || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${
                          c.verificationStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {c.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/companies/${c.slug || c.id}`}>
                        <Button size="sm" variant="outline" className="text-2xs px-2.5 py-0.5">
                          Profile
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
