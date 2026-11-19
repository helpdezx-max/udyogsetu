import React, { useState } from 'react';
import Head from 'next/head';
import { CandidateLayout } from '../../components/layout/CandidateLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function CandidateSettingsPage() {
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [preferredShift, setPreferredShift] = useState('Rotational 3-Shifts');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <CandidateLayout>
      <Head>
        <title>Account Settings • Candidate Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Account Preferences & Job Alerts</h2>
          <p className="text-xs text-industrial-500 mt-0.5">Configure how you receive walk-in alerts and job invitations.</p>
        </div>

        <Card className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="space-y-3 pb-4 border-b border-industrial-100">
              <h3 className="font-bold text-sm text-industrial-900">Direct Alert Channels</h3>

              <label className="flex items-center justify-between p-3 rounded-xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                <div>
                  <div className="font-bold text-industrial-900">WhatsApp Interview Alerts</div>
                  <div className="text-2xs text-industrial-500">Receive gate interview passes and venue addresses instantly</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                <div>
                  <div className="font-bold text-industrial-900">SMS Job Notifications</div>
                  <div className="text-2xs text-industrial-500">Important status updates when HR shortlists your profile</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
              </label>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-industrial-900">Shift Availability Preference</h3>
              <select
                value={preferredShift}
                onChange={(e) => setPreferredShift(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-brand-600"
              >
                <option value="Rotational 3-Shifts">Willing to work Rotational 3-Shifts (A/B/C)</option>
                <option value="Day Shift Only">Day Shift Preferred Only</option>
                <option value="General Shift">General Shift (08:30 AM - 05:00 PM)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-industrial-100 flex items-center justify-between">
              {saved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
                </span>
              )}
              <Button type="submit" variant="primary" className="ml-auto">
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </CandidateLayout>
  );
}
