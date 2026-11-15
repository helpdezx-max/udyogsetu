import React from 'react';
import Head from 'next/head';
import { CalendarCheck2, Clock, MapPin, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminWalkInsPage() {
  const { walkIns } = useApp();

  return (
    <AdminLayout>
      <Head>
        <title>Walk-in Drives Moderation • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Walk-in Interview Events Moderation</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Audit plant gate interviews for verified venue addresses, valid reporting times, and safety provisions.
          </p>
        </div>

        <div className="space-y-4">
          {walkIns.map((w) => (
            <Card key={w.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    {w.eventDates}
                  </span>
                  <h3 className="font-bold text-sm text-industrial-900">{w.jobTitle}</h3>
                </div>
                <div className="text-industrial-600 text-xs mt-1">
                  Plant: <span className="font-semibold text-industrial-900">{w.companyName}</span> ({w.clusterName})
                </div>
                <div className="text-2xs text-industrial-500 mt-0.5">
                  Venue: {w.venueAddress} • Contact: {w.contactPerson} ({w.contactPhone})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  Gate Drive Approved
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
