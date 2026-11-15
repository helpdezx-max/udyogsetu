import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Briefcase,
  Users2,
  CalendarCheck2,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmployerLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const { companies, jobs, applications } = useApp();

  const currentCompany = companies.find((c) => c.id === 'comp-1') || companies[0];
  const companyJobs = jobs.filter((j) => j.companyId === currentCompany.id);

  const navItems = [
    { label: 'Overview Dashboard', href: '/employer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Post Factory Job', href: '/employer/post-job', icon: <PlusCircle className="w-4 h-4" />, highlight: true },
    {
      label: 'Manage Vacancies',
      href: '/employer/manage-jobs',
      icon: <Briefcase className="w-4 h-4" />,
      badge: companyJobs.length,
    },
    {
      label: 'Applicants Pipeline',
      href: '/employer/applicants',
      icon: <Users2 className="w-4 h-4" />,
      badge: applications.length,
    },
    { label: 'Interview Management', href: '/employer/interviews', icon: <CalendarCheck2 className="w-4 h-4" /> },
    { label: 'Plant Profile & Setup', href: '/employer/profile', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Verification & Compliance', href: '/employer/verification', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Recruitment Analytics', href: '/employer/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'HR Settings', href: '/employer/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-1 p-4 sm:p-7 space-y-6">
      {/* Plant HR Banner */}
      <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl ${currentCompany.logoPlaceholderBg} text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0`}
          >
            {currentCompany.logoLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-950">{currentCompany.name}</h2>
              <span className="text-3xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                VERIFIED FACTORY
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {currentCompany.clusterName} • Plot C-14, Phase 1 MIDC • {currentCompany.industry}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/employer/post-job">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-colors shadow-xs">
              <PlusCircle className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </button>
          </Link>
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
                      : item.highlight
                      ? 'bg-amber-50 text-amber-900 font-bold hover:bg-amber-100'
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
