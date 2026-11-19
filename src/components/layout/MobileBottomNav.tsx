import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Briefcase,
  CalendarCheck2,
  Building2,
  MessageSquare,
  User,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const { user, profile, activeRole, activeWorkspace } = useAuth();

  const isCurrent = (path: string) => {
    if (path === '/') return router.pathname === '/' || router.pathname === '';
    return router.pathname.startsWith(path);
  };

  const getAccountLink = () => {
    if (!user) return '/signin';
    if (activeRole === 'admin') return '/admin/dashboard';
    if (activeRole === 'agency') return '/agency/dashboard';
    if (activeRole === 'employer') return '/employer/dashboard';
    return '/candidate/dashboard';
  };

  const navItems = [
    {
      label: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
      active: isCurrent('/jobs') || router.pathname === '/',
    },
    {
      label: 'Walk-ins',
      href: '/walk-ins',
      icon: CalendarCheck2,
      active: isCurrent('/walk-ins'),
      badge: 'LIVE',
    },
    {
      label: 'Plants',
      href: '/companies',
      icon: Building2,
      active: isCurrent('/companies') || isCurrent('/locations'),
    },
    {
      label: 'Alerts',
      href: '/candidate/assistant',
      icon: MessageSquare,
      active: isCurrent('/candidate/assistant'),
    },
    {
      label: user ? 'Account' : 'Sign In',
      href: getAccountLink(),
      icon: user ? User : LogIn,
      active:
        isCurrent('/signin') ||
        isCurrent('/candidate/dashboard') ||
        isCurrent('/employer/dashboard') ||
        isCurrent('/agency/dashboard') ||
        isCurrent('/admin/dashboard'),
      isAvatar: Boolean(user),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-1.5 transition-transform"
    >
      <div className="grid grid-cols-5 items-center px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative group ${
                item.active
                  ? 'text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700 font-medium'
              }`}
            >
              <div className="relative">
                {item.isAvatar ? (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-3xs font-extrabold uppercase transition-all ${
                      item.active
                        ? 'bg-zinc-950 text-white ring-2 ring-zinc-950/20'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                ) : (
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      item.active ? 'scale-110 stroke-[2.3]' : 'stroke-[1.8]'
                    }`}
                  />
                )}

                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-amber-500 text-white text-[8px] font-black rounded-full leading-none tracking-tight animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-1 leading-none truncate max-w-full">
                {item.label}
              </span>

              {item.active && (
                <span className="w-1 h-1 rounded-full bg-zinc-950 mt-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
