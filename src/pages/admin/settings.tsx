import React, { useState } from 'react';
import Head from 'next/head';
import { Settings, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminSettingsPage() {
  const { resetDemoData } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Are you sure you want to restore all demo data, applications, and verification queues?')) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Admin System Settings • UdyogSetu</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Platform Administration Settings</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Configure moderation thresholds and manage local demo storage.
          </p>
        </div>

        <Card className="p-6 space-y-5 text-xs">
          <div className="space-y-2 pb-4 border-b border-industrial-100">
            <h3 className="font-bold text-sm text-industrial-900">Moderation Rules</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
              <span className="font-semibold text-industrial-800">
                Require statutory Udyam & GSTIN verification before public publishing
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
              <span className="font-semibold text-industrial-800">
                Immediately freeze job listings when 3 or more candidate fee complaints are logged
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-industrial-900 text-red-700">Prototype Demo State Management</h3>
            <p className="text-industrial-600">
              Reset all modified records (newly posted jobs, updated verification approvals, applicant stages) to the initial demo state.
            </p>
            <Button variant="danger" size="sm" onClick={handleReset} className="font-bold">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Restore Default Demo Data
            </Button>
            {resetSuccess && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-2">
                <CheckCircle2 className="w-4 h-4" /> Demo data restored to factory defaults!
              </span>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
