import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MapPin, Building2, PlusCircle, ExternalLink, ShieldCheck, Bus } from 'lucide-react';
import { CHAKAN_PILOT_LOCATIONS, PilotLocation } from '../../data/pilot-locations';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<PilotLocation[]>(CHAKAN_PILOT_LOCATIONS);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filtered = locations.filter((loc) => {
    if (filterPriority === 'all') return true;
    return loc.pilotPriority === filterPriority;
  });

  return (
    <AdminLayout>
      <Head>
        <title>Chakan–Khed 12 Pilot Hubs Master • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Chakan–Khed Industrial Pilot Clusters</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Admin-managed roster of 12 manufacturing sectors, PMPML bus terminals, and security gate landmarks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/locations" target="_blank">
              <Button variant="outline" size="sm" className="font-semibold text-xs">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Public Directory
              </Button>
            </Link>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-l-4 border-l-neutral-900">
            <span className="text-2xs font-bold uppercase text-neutral-500">Pilot Locations</span>
            <div className="text-2xl font-black text-neutral-950 mt-1">{locations.length} Industrial Hubs</div>
            <div className="text-3xs text-neutral-500 mt-1">Chakan, Khed, Kuruli, Mahalunge, Vasuli</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-emerald-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">High-Priority Core Belts</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {locations.filter((l) => l.pilotPriority === 'high').length} Hubs
            </div>
            <div className="text-3xs text-emerald-700 font-semibold mt-1">Chakan Phase 1-4 &amp; Khed SEZ</div>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-600">
            <span className="text-2xs font-bold uppercase text-neutral-500">Total Est. Openings</span>
            <div className="text-2xl font-black text-blue-700 mt-1">
              {locations.reduce((acc, curr) => acc + curr.openJobsCount, 0).toLocaleString()} Roles
            </div>
            <div className="text-3xs text-neutral-500 mt-1">Across all verified participating units</div>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-neutral-600">Filter Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-neutral-300 bg-white font-medium text-neutral-800"
          >
            <option value="all">All 12 Pilot Hubs</option>
            <option value="high">High Priority (Core Phase 1-4 &amp; Khed SEZ)</option>
            <option value="medium">Medium Priority (Peripheral Belts)</option>
          </select>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F8FA] border-b border-[#E4E6EB] text-neutral-500 uppercase tracking-wider text-3xs font-bold">
                <tr>
                  <th className="py-3 px-4">Cluster / Hub</th>
                  <th className="py-3 px-4">PIN Code</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Key Landmark</th>
                  <th className="py-3 px-4">Transit / Bus Lines</th>
                  <th className="py-3 px-4 text-center">Units</th>
                  <th className="py-3 px-4 text-center">Openings</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((cl) => (
                  <tr key={cl.id} className="hover:bg-neutral-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-950">{cl.name}</div>
                      <div className="text-3xs text-neutral-500">{cl.marathiName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-3xs text-neutral-600">{cl.pincode}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          cl.pilotPriority === 'high'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {cl.pilotPriority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 max-w-[180px] truncate" title={cl.landmark}>
                      {cl.landmark}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 max-w-[200px] truncate" title={cl.transitAccess}>
                      {cl.transitAccess}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-neutral-900">{cl.activeCompaniesCount}</td>
                    <td className="py-3.5 px-4 text-center font-black text-neutral-950">{cl.openJobsCount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/locations/${cl.id}`}>
                        <Button size="sm" variant="outline" className="text-3xs px-2.5 py-1">
                          View Landing
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
