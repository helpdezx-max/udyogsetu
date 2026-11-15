import React from 'react';
import Head from 'next/head';
import { Bell, CalendarCheck2, ShieldCheck, Briefcase } from 'lucide-react';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';

export default function CandidateNotificationsPage() {
  const notifications = [
    {
      id: 'notif-1',
      type: 'interview',
      title: 'Interview Call from Sahyadri Precision Auto-Tech',
      message: 'Your practical VMC test has been scheduled for 17-Nov at 10:30 AM in Chakan Phase 1.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 'notif-2',
      type: 'shortlist',
      title: 'Shortlisted by Nighoje Precision CNC Works',
      message: 'Your profile has been shortlisted for the CNC Turning Operator vacancy.',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 'notif-3',
      type: 'walkin',
      title: 'New Spot Walk-in Drive in Khed City SEZ',
      message: 'Khed Dynamics is hosting walk-ins for 25 assembly technicians this Thursday.',
      time: '2 days ago',
      unread: false,
    },
  ];

  return (
    <CandidateLayout>
      <Head>
        <title>Notifications & Interview Alerts • Candidate Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Notifications & Alerts</h2>
          <p className="text-xs text-industrial-500 mt-0.5">Stay updated with direct messages from factory HRs.</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 border transition-all ${
                n.unread ? 'bg-brand-50/40 border-brand-200' : 'bg-white border-industrial-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-brand-100 text-brand-700 rounded-xl shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-industrial-900">{n.title}</h4>
                    <span className="text-3xs text-industrial-400 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-industrial-600 mt-1">{n.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </CandidateLayout>
  );
}
