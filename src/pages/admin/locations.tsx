import React from 'react';
import Head from 'next/head';
import { MapPin, Building2, PlusCircle } from 'lucide-react';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminLocationsPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Industrial Location Master • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-industrial-900">Industrial Cluster Management</h2>
            <p className="text-xs text-industrial-500 mt-0.5">
              Configured MIDC sectors, PIN codes, transit hubs, and landmark coordinates.
            </p>
          </div>
          <Button variant="primary" size="sm" className="font-bold">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Add Cluster
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-industrial-50 border-b border-industrial-200 text-industrial-500 uppercase tracking-wider text-2xs">
                <tr>
                  <th className="py-3 px-4">Cluster / Zone</th>
                  <th className="py-3 px-4">PIN Code</th>
                  <th className="py-3 px-4">Key Landmark</th>
                  <th className="py-3 px-4">Public Transit Access</th>
                  <th className="py-3 px-4">Active Openings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {INDUSTRIAL_CLUSTERS.map((cl) => (
                  <tr key={cl.id} className="hover:bg-industrial-50/50">
                    <td className="py-3.5 px-4 font-bold text-industrial-900">{cl.name}</td>
                    <td className="py-3.5 px-4 font-mono text-2xs text-industrial-600">{cl.pincode}</td>
                    <td className="py-3.5 px-4 text-industrial-700">{cl.landmark}</td>
                    <td className="py-3.5 px-4 text-industrial-600">{cl.transitAccess}</td>
                    <td className="py-3.5 px-4 font-bold text-brand-700">{cl.openJobsCount}</td>
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
