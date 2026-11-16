import React, { useState } from 'react';
import Head from 'next/head';
import {
  Users2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  PlusCircle,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export interface AuthorizedAgency {
  id: string;
  name: string;
  cluster: string;
  clraLicense: string;
  epfoRegistration: string;
  esicRegistration: string;
  director: string;
  phone: string;
  verificationStatus: 'verified' | 'pending_audit' | 'suspended';
  specializations: string[];
  authorizedClients: { clientName: string; scope: string; validUntil: string }[];
  candidateHandlingRating: number; // Out of 5
  complaintsCount: number;
  directRepresentationBarred: boolean;
  notes: string;
}

export const PILOT_AGENCIES: AuthorizedAgency[] = [];

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<AuthorizedAgency[]>(PILOT_AGENCIES);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filtered = agencies.filter((a) => {
    if (selectedFilter === 'all') return true;
    return a.verificationStatus === selectedFilter;
  });

  return (
    <AdminLayout>
      <Head>
        <title>Recruitment Agency &amp; Contractor Network • UdyogSetu Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900">Authorized Agency &amp; Contractor Network</h2>
              <span className="text-3xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                CLRA Compliant
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Audited staffing agencies, labor contractors, and manpower suppliers operating in the Chakan–Khed pilot.
            </p>
          </div>
        </div>

        {/* Anti-Impersonation Policy Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-indigo-900">
            <Lock className="w-4 h-4 text-indigo-700" />
            <span>Strict Anti-Impersonation &amp; Authorization Rule:</span>
          </div>
          <p className="text-2xs text-indigo-900/90 leading-relaxed">
            Staffing agencies are strictly prohibited from representing themselves as direct manufacturing employers.
            All agency-sourced vacancies must display the &apos;Authorized Staffing Agency&apos; badge and link to a
            valid client mandate letter issued under Contract Labour Act Form V/VI. No candidate fees may be charged
            under any circumstance.
          </p>
        </div>

        {/* Operational Roster */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-xs text-neutral-500 border-dashed">
              <Users2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-neutral-900">No Recruitment Agencies in Audit Roster</p>
              <p className="text-2xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Third-party staffing vendors and labor contractors undergo statutory CLRA, EPFO, and ESIC verification before being authorized on the platform.
              </p>
            </Card>
          ) : (
            filtered.map((agency) => (
            <Card key={agency.id} className="p-5 space-y-4 hover:border-neutral-400 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-950">{agency.name}</h3>
                    <span
                      className={`text-3xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                        agency.verificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {agency.verificationStatus === 'verified' ? 'Statutory Verified' : 'Audit In Progress'}
                    </span>
                    <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {agency.cluster}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>
                      Director: <strong className="text-neutral-800">{agency.director}</strong>
                    </span>
                    <span>•</span>
                    <span>Phone: {agency.phone}</span>
                    <span>•</span>
                    <span className="font-mono text-3xs">CLRA: {agency.clraLicense}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900">
                    Candidate Trust Rating: {agency.candidateHandlingRating} / 5.0
                  </div>
                  <div className="text-3xs text-neutral-500">
                    {agency.complaintsCount === 0 ? (
                      <span className="text-emerald-700 font-semibold">0 Complaints Recorded</span>
                    ) : (
                      <span className="text-red-700 font-semibold">{agency.complaintsCount} Case Under Review</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Statutory & Specializations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Authorized Client Plants */}
                <div className="bg-[#F7F8FA] p-3.5 rounded-2xl border border-[#E4E6EB] space-y-2">
                  <div className="text-3xs uppercase tracking-wider font-bold text-neutral-500 flex items-center justify-between">
                    <span>Authorized Client Mandates:</span>
                    <span className="text-neutral-900 font-extrabold">{agency.authorizedClients.length} Plants</span>
                  </div>
                  <ul className="space-y-1.5">
                    {agency.authorizedClients.map((client) => (
                      <li
                        key={client.clientName}
                        className="p-2 rounded-xl bg-white border border-neutral-200/70 text-2xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-neutral-900">{client.clientName}</div>
                          <div className="text-neutral-500">{client.scope}</div>
                        </div>
                        <span className="text-3xs font-mono text-neutral-500">Until {client.validUntil}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Statutory Numbers & Candidate Safeguards */}
                <div className="bg-[#F7F8FA] p-3.5 rounded-2xl border border-[#E4E6EB] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-3xs uppercase tracking-wider font-bold text-neutral-500">
                      Statutory Compliance:
                    </div>
                    <div className="text-2xs font-mono text-neutral-700">EPFO: {agency.epfoRegistration}</div>
                    <div className="text-2xs font-mono text-neutral-700">ESIC: {agency.esicRegistration}</div>

                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {agency.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="text-3xs font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                    <span className="text-3xs text-neutral-500 italic">&quot;{agency.notes}&quot;</span>
                    <Button size="sm" variant="outline" className="text-3xs px-2.5 py-1">
                      Audit Mandate Files
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )))}
        </div>
      </div>
    </AdminLayout>
  );
}
