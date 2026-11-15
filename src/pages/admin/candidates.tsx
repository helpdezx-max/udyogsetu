import React from 'react';
import Head from 'next/head';
import { Users2, Award, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/Card';

export default function AdminCandidatesPage() {
  const { candidateProfile, applications } = useApp();

  return (
    <AdminLayout>
      <Head>
        <title>Candidate Database Management • Admin Desk</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-industrial-900">Candidate Records Management</h2>
          <p className="text-xs text-industrial-500 mt-0.5">
            Registered industrial job seekers, technical trades, and application records.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-industrial-50 border-b border-industrial-200 text-industrial-500 uppercase tracking-wider text-2xs">
                <tr>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Trade Specialization</th>
                  <th className="py-3 px-4">Qualification</th>
                  <th className="py-3 px-4">Residence</th>
                  <th className="py-3 px-4">Applications</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                <tr className="hover:bg-industrial-50/50">
                  <td className="py-3.5 px-4 font-bold text-industrial-900">{candidateProfile.fullName}</td>
                  <td className="py-3.5 px-4 text-industrial-700">{candidateProfile.tradeSpecialization}</td>
                  <td className="py-3.5 px-4 text-industrial-600">{candidateProfile.highestQualification}</td>
                  <td className="py-3.5 px-4 text-industrial-600">{candidateProfile.currentResidence}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-700">{applications.length} Submitted</td>
                  <td className="py-3.5 px-4">
                    <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active Seeker
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
