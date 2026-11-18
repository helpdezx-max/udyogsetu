import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Users2,
  AlertTriangle,
  Building2,
  MapPin,
  CalendarCheck2,
  BarChart3,
  Settings,
  Lock,
  Globe,
  Sparkles,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { RouteGuard } from '../auth/RouteGuard';

export const AdminLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const router = useRouter();
  const { verifications, reports } = useApp();
  const { signOut } = useAuth();

  const pendingVerifs = verifications.filter((v) => v.status === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const navItems = [
    { label: 'Admin Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Verification Queue',
      href: '/admin/verifications',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: pendingVerifs.length,
      alert: pendingVerifs.length > 0,
    },
    {
      label: 'Job Moderation Queue',
      href: '/admin/moderation',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      label: 'Job Sources & Discovery',
      href: '/admin/sources',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: 'AI & WhatsApp Control',
      href: '/admin/ai-control',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      label: 'Complaints & Reports',
      href: '/admin/reports',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: pendingReports.length,
      alert: pendingReports.length > 0,
    },
    { label: 'Employer Acquisition', href: '/admin/acquisition', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Employer Management', href: '/admin/employers', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Agency Management', href: '/admin/agencies', icon: <Users2 className="w-4 h-4" /> },
    { label: 'Candidate Records', href: '/admin/candidates', icon: <Users2 className="w-4 h-4" /> },
    { label: 'Walk-in Drives', href: '/admin/walk-ins', icon: <CalendarCheck2 className="w-4 h-4" /> },
    { label: 'Industrial Clusters', href: '/admin/locations', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Platform Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'System Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin?logged_out=1');
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="flex-1 p-4 sm:p-7 space-y-6">
        {/* Admin Header Banner */}
        <div className="bg-[#F7F8FA] rounded-3xl border border-[#E4E6EB] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-bold flex items-center justify-center shadow-xs shrink-0">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-950">Rozzy Moderation & Trust Desk</h2>
                <span className="text-3xs font-black uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Auditing factory plots, GSTIN authenticity, and fraud reports across Chakan MIDC.
              </p>
            </div>
          </div>

          <div className="text-3xs text-neutral-600 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs font-semibold">
            Platform Governance & Trust Audit Desk
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
                          active
                            ? 'bg-white text-neutral-900'
                            : item.alert
                            ? 'bg-red-500 text-white'
                            : 'bg-neutral-200 text-neutral-700'
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
          </aside>

          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </RouteGuard>
  );
};
