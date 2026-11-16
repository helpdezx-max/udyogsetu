import React, { useState } from 'react';
import Head from 'next/head';
import { Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmployerLayout } from '../../components/layout/EmployerLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function EmployerProfilePage() {
  const { companies } = useApp();
  const company = companies[0] || {
    id: '',
    name: '',
    clusterName: 'Chakan MIDC Phase 1',
    specificAddress: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
  };

  const [plantName, setPlantName] = useState(company.name);
  const [address, setAddress] = useState(company.specificAddress);
  const [contactPhone, setContactPhone] = useState(company.contactPhone);
  const [contactEmail, setContactEmail] = useState(company.contactEmail);
  const [desc, setDesc] = useState(company.description);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <EmployerLayout>
      <Head>
        <title>Factory Profile & Plant Information • Plant HR Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Plant Identity & Profile Management</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Public factory details displayed to prospective technicians and applicants.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-industrial-100">
              <h3 className="font-bold text-sm text-industrial-900">Registered Plant Information</h3>
              {saved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Changes Saved
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Manufacturing Entity / Plant Name"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                required
              />
              <Input
                label="Industrial Sector / Cluster"
                value={company.clusterName}
                disabled
                helperText="Locked to MIDC allotment plot"
              />
            </div>

            <Input
              label="Physical Factory Address & Gate Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="HR Recruitment Desk Phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
              <Input
                label="Official HR Contact Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Plant Overview & Products
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 focus:outline-none focus:border-brand-600"
              />
            </div>

            <div className="pt-4 border-t border-industrial-100 flex justify-end">
              <Button type="submit" variant="primary" className="font-bold">
                Save Plant Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </EmployerLayout>
  );
}
