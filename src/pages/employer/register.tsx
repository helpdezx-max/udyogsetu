import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building2, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { INDUSTRIAL_CLUSTERS } from '../../data/demo-data';

export default function EmployerRegisterPage() {
  const router = useRouter();
  const { signUpEmployer, isConfigured } = useAuth();
  const { setActiveRole } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [cluster, setCluster] = useState('chakan-phase-1');
  const [industry, setIndustry] = useState('Auto Components Tier-1');
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hrPhone, setHrPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (isConfigured) {
      const { data, error } = await signUpEmployer({
        email: hrEmail,
        password,
        fullName: hrName,
        phone: hrPhone,
        companyName,
        clusterId: cluster,
        industry,
      });

      if (error) {
        setErrorMessage(error.message || 'Factory registration failed.');
        setIsSubmitting(false);
        return;
      }
    }

    setActiveRole('employer');
    setIsSubmitting(false);
    router.push('/employer/onboarding');
  };

  return (
    <>
      <Head>
        <title>Register Factory / Company • UdyogSetu Employer Network</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-industrial-100/50">
        <div className="max-w-md w-full bg-white rounded-2xl border border-industrial-200 p-8 shadow-card space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-industrial-900 text-white flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-black text-industrial-900 tracking-tight">Factory Onboarding</h1>
            <p className="text-xs text-industrial-500">
              Register your manufacturing plant to recruit verified machine operators & line personnel.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Company / Factory Name"
              placeholder="e.g. Pune Transmission Auto Works Ltd."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Industrial Cluster Location
              </label>
              <select
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
              >
                {INDUSTRIAL_CLUSTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.zone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-industrial-700 mb-1.5">
                Manufacturing Industry Sector
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-industrial-300 bg-white text-industrial-900 focus:ring-2 focus:ring-brand-500"
              >
                <option value="Auto Components Tier-1">Auto Components Tier-1</option>
                <option value="Automotive OEM">Automotive OEM</option>
                <option value="Precision Machining">Precision Machining & CNC</option>
                <option value="Press & Stamping">Press & Sheet Metal Stamping</option>
                <option value="Electronics & Electricals">Electronics & EV Electricals</option>
                <option value="Packaging & Polymer">Packaging & Polymers</option>
                <option value="Logistics & Warehousing">Logistics & Warehousing</option>
              </select>
            </div>

            <Input
              label="Plant HR Manager Name"
              placeholder="e.g. Ramesh Kadam"
              value={hrName}
              onChange={(e) => setHrName(e.target.value)}
              required
            />

            <Input
              label="Official Work Email (Login ID)"
              type="email"
              placeholder="hr@companyname.com"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              required
            />

            <Input
              label="Set Portal Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <Input
              label="Direct HR / Plant Contact Number"
              placeholder="+91 2135 XXXXXX / 98XXXXXXXX"
              value={hrPhone}
              onChange={(e) => setHrPhone(e.target.value)}
              required
            />

            <Button type="submit" variant="secondary" className="w-full font-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Registering Facility...' : 'Register Factory & Proceed to Verification'}
            </Button>
          </form>

          <div className="pt-4 border-t border-industrial-100 text-center text-xs text-industrial-600">
            <span>Already registered? </span>
            <Link href="/employer/login" className="font-bold text-brand-600 hover:underline">
              Sign In to HR Portal
            </Link>
          </div>

          <div className="bg-industrial-50 rounded-xl p-3 border border-industrial-200 text-2xs text-industrial-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>MIDC / Factory License verification audit is required before postings go live.</span>
          </div>
        </div>
      </div>
    </>
  );
}
