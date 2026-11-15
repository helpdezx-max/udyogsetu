import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Users2,
  Briefcase,
  Building2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgencyLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const { companies, jobs, applications } = useApp();

  const currentAgency = companies.find((c) => c.id === 'comp-5') || companies[0];
  const agencyJobs = jobs.filter((j) => j.companyId === currentAgency.id || j.recruitmentTier === 'verified_agency');

  const navItems = [
    { label: 'Agency Overview', href: '/agency/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Client Companies',
      href: '/agency/employers',
      icon: <Building2 className="w-4 h-4" />,
      badge: 4,
    },
    {
      label: 'Manage Vacancies',
      href: '/agency/vacancies',
      icon: <Briefcase className="w-4 h-4" />,
      badge: agencyJobs.length,
    },
    {
      label: 'Candidate Applications',
      href: '/agency/applications',
      icon: <Users2 className="w-4 h-4" />,
      badge: applications.length,
    },
    { label: 'Agency Profile', href: '/agency/profile', icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Contractor License', href: '/agency/verification', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 p-4 sm:p-7 space-y-6">
      {/* Top Agency Header */}
      <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-950">{currentAgency.name}</h2>
              <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                LICENSED CONTRACTOR
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Labour License: LAB-CON-REG-2024-81 • Chakan Talegaon Chowk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-white text-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 font-semibold shadow-2xs">
            Authorized Manpower Supplier
          </span>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-[#FAFAFA] rounded-3xl border border-neutral-200 p-2.5 space-y-1 shadow-2xs">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white font-bold shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-200/50 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-white' : 'text-neutral-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-3xs px-2 py-0.5 rounded-full font-bold ${
                        active ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
};
