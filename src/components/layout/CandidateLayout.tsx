import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Briefcase,
  Bell,
  Settings,
  ShieldCheck,
  Bot,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { RouteGuard } from '../auth/RouteGuard';

export const CandidateLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const { candidateProfile, savedJobIds, applications } = useApp();
  const { profile, user, signOut } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/candidate/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Profile', href: '/candidate/profile', icon: <User className="w-4 h-4" /> },
    {
      label: 'My Applications',
      href: '/candidate/applications',
      icon: <Briefcase className="w-4 h-4" />,
      badge: applications.length,
    },
    {
      label: 'Saved Vacancies',
      href: '/candidate/saved-jobs',
      icon: <Bookmark className="w-4 h-4" />,
      badge: savedJobIds.length,
    },
    { label: 'Resume & Certificates', href: '/candidate/resume', icon: <FileText className="w-4 h-4" /> },
    { label: 'AI Career Assistant', href: '/candidate/assistant', icon: <Bot className="w-4 h-4" /> },
    { label: 'Notifications', href: '/candidate/notifications', icon: <Bell className="w-4 h-4" />, badge: 0 },
    { label: 'Account Settings', href: '/candidate/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin?logged_out=1');
  };

  const displayName = profile?.full_name || candidateProfile?.fullName || user?.email?.split('@')[0] || 'Candidate';

  return (
    <RouteGuard allowedRoles={['candidate', 'admin']}>
      <div className="flex-1 p-4 sm:p-7 space-y-6">
        {/* Profile Snapshot Header */}
        <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-950">
                  {displayName}
                </h2>
                <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Profile Active
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {candidateProfile?.tradeSpecialization || 'Industrial Technician'} • {candidateProfile?.currentResidence || 'Chakan / Pune Belt'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <div className="flex justify-between text-3xs font-bold uppercase tracking-wider text-neutral-600">
              <span>Profile Strength</span>
              <span className="text-neutral-950">{candidateProfile.profileCompletionPercentage || 25}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 rounded-full transition-all"
                style={{ width: `${candidateProfile.profileCompletionPercentage || 25}%` }}
              />
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Side Navigation */}
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

              <div className="pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Box */}
            <div className="p-4 rounded-3xl bg-[#F1F8F4] border border-[#D5ECE0] text-neutral-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-3xs uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Candidate Fee Guarantee</span>
              </div>
              <p className="text-3xs text-neutral-600 leading-relaxed">
                Applying for factory jobs on UdyogSetu is 100% free. Never pay any fee or deposit for interviews or gate passes.
              </p>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </RouteGuard>
  );
};
