import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bell, CalendarCheck2, ShieldCheck, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

export default function CandidateNotificationsPage() {
  const { applications } = useApp();

  // Generate live notifications based on actual candidate applications
  const notifications = applications.map((app, idx) => {
    if (app.currentStatus === 'Interview Scheduled') {
      return {
        id: `notif-app-${app.id}`,
        type: 'interview',
        title: `Gate Interview Scheduled: ${app.jobTitle}`,
        message: `Reporting venue: ${app.clusterName}. Date & Time: ${app.interviewScheduledDate || 'Confirmed by Plant HR'}. Bring original trade certificates and photo ID.`,
        time: app.appliedDate || 'Recent',
        unread: true,
      };
    }
    if (app.currentStatus === 'Selected') {
      return {
        id: `notif-app-${app.id}`,
        type: 'shortlist',
        title: `Offer Issued for ${app.jobTitle}`,
        message: `Congratulations! ${app.companyName} has issued an offer. Check with Plant HR for joining formalities.`,
        time: app.appliedDate || 'Recent',
        unread: false,
      };
    }
    return {
      id: `notif-app-${app.id}`,
      type: 'status',
      title: `Application Status: ${app.currentStatus}`,
      message: `Your application for ${app.jobTitle} at ${app.companyName} is currently ${app.currentStatus.toLowerCase()}.`,
      time: app.appliedDate || 'Recent',
      unread: false,
    };
  });

  return (
    <CandidateLayout>
      <Head>
        <title>Notifications &amp; Interview Alerts • Candidate Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Notifications &amp; Alerts</h2>
          <p className="text-xs text-industrial-500 mt-0.5">Stay updated with direct messages from factory HRs.</p>
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-8 h-8" />}
            title="No Notifications Yet"
            description="You have no alerts at this time. When you apply to vacancies, interview invites and application updates will appear here."
            action={
              <Link href="/jobs">
                <Button variant="primary">Browse Factory Jobs</Button>
              </Link>
            }
          />
        ) : (
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
        )}
      </div>
    </CandidateLayout>
  );
}
