import React, { useState } from 'react';
import Head from 'next/head';
import { Settings, CheckCircle2 } from 'lucide-react';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function EmployerSettingsPage() {
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [autoRejectOld, setAutoRejectOld] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <EmployerLayout>
      <Head>
        <title>HR Portal Settings • Plant HR</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Plant HR Account Settings</h2>
          <p className="text-xs text-industrial-500 mt-0.5">Notification preferences and automated hiring rules.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="space-y-3 pb-4 border-b border-industrial-100">
              <h3 className="font-bold text-sm text-industrial-900">Application Dispatch</h3>

              <label className="flex items-center justify-between p-3 rounded-xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                <div>
                  <div className="font-bold text-industrial-900">Instant WhatsApp Ping on Candidate Application</div>
                  <div className="text-2xs text-industrial-500">Alert plant HR manager whenever an ITI technician applies</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-industrial-50 border border-industrial-200 cursor-pointer">
                <div>
                  <div className="font-bold text-industrial-900">Auto-Close Expired Vacancies</div>
                  <div className="text-2xs text-industrial-500">Automatically delist openings once deadline date passes</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoRejectOld}
                  onChange={(e) => setAutoRejectOld(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Settings Updated!
                </span>
              )}
              <Button type="submit" variant="primary" className="ml-auto">
                Save Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </EmployerLayout>
  );
}
