import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Factory,
  Search,
  Building2,
  CalendarCheck2,
  MapPin,
  ShieldCheck,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  User,
  Briefcase,
  Users2,
  Lock,
  LogOut,
  LogIn,
  UserPlus,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../hooks/useLocale';

export const Header: React.FC = () => {
  const router = useRouter();
  const { savedJobIds, isSupabaseConnected } = useApp();
  const { user, profile, activeRole, roles, workspaces, activeWorkspace, switchActiveWorkspace, signOut, isConfigured } = useAuth();
  const { t } = useLocale();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '';
    return router.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push('/signin?logged_out=1');
  };

  const getDashboardLink = () => {
    if (!user) return '/signin';
    if (roles.includes('admin') || activeRole === 'admin') return '/admin/dashboard';
    if (roles.includes('agency') || activeRole === 'agency') return '/agency/dashboard';
    if (roles.includes('employer') || activeRole === 'employer') return '/employer/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
      <Link href="/" className="flex items-center group shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Rozzy • Industrial Employment Network"
              className="h-6 sm:h-7 w-auto object-contain block"
            />
            <span className="bg-zinc-100 text-zinc-800 text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded-md border border-zinc-200/60 tracking-wider">
              CHAKAN
            </span>
          </div>
          <p className="text-3xs text-zinc-400 font-medium mt-0.5 hidden sm:block">
            Industrial Employment Network
          </p>
        </div>
      </Link>

      {/* Main Navigation Links (Desktop - Mobbin Pill Style) */}
      <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-600">
        <Link
          href="/jobs"
          className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
            isActive('/jobs')
              ? 'bg-zinc-950 text-white font-semibold shadow-xs'
              : 'hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Jobs</span>
        </Link>

        <Link
          href="/walk-ins"
          className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
            isActive('/walk-ins')
              ? 'bg-zinc-950 text-white font-semibold shadow-xs'
              : 'hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <CalendarCheck2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Walk-in Drives</span>
        </Link>

        <Link
          href="/companies"
          className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
            isActive('/companies')
              ? 'bg-zinc-950 text-white font-semibold shadow-xs'
              : 'hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Companies</span>
        </Link>

        <Link
          href="/locations"
          className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
            isActive('/locations')
              ? 'bg-zinc-950 text-white font-semibold shadow-xs'
              : 'hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Clusters</span>
        </Link>

        <Link
          href="/trust-and-safety"
          className={`rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
            isActive('/trust-and-safety')
              ? 'bg-zinc-950 text-white font-semibold shadow-xs'
              : 'hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trust & Safety</span>
        </Link>
      </nav>

      {/* Utility Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Saved Jobs Icon */}
        <Link
          href="/candidate/saved-jobs"
          className="relative p-2 rounded-full border border-zinc-200/90 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 transition-colors"
          title="Saved Jobs"
        >
          <Bookmark className="w-4 h-4" />
          {savedJobIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-zinc-950 text-white text-3xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {savedJobIds.length}
            </span>
          )}
        </Link>

        {/* Authentication Controls */}
        {user ? (
          /* User is Signed In */
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-3xs font-black flex items-center justify-center uppercase">
                {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-neutral-900 block leading-tight max-w-[120px] truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="text-3xs uppercase font-extrabold text-amber-700 block leading-none">
                  {activeWorkspace?.name || activeRole}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 text-xs">
                {/* User info header */}
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="font-extrabold text-neutral-950 truncate">
                    {profile?.full_name || 'Industrial User'}
                  </p>
                  <p className="text-3xs text-neutral-500 truncate">{user.email}</p>
                </div>

                {/* Direct Dashboard Link */}
                <div className="p-1">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-50 font-bold text-neutral-900 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <span>Open My Workspace</span>
                  </Link>
                </div>

                {/* Workspace Switcher if user has organizations */}
                {workspaces.length > 1 && (
                  <div className="border-t border-neutral-100 pt-1.5 p-1">
                    <div className="px-3 py-1 text-3xs font-extrabold uppercase tracking-wider text-neutral-400">
                      Switch Organization
                    </div>
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          switchActiveWorkspace(ws.id);
                          setUserDropdownOpen(false);
                          if (ws.type === 'company') router.push('/employer/dashboard');
                          else if (ws.type === 'agency') router.push('/agency/dashboard');
                          else if (ws.type === 'admin') router.push('/admin/dashboard');
                          else router.push('/candidate/dashboard');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl font-medium flex items-center justify-between ${
                          activeWorkspace?.id === ws.id ? 'bg-neutral-100 font-bold text-neutral-950' : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {ws.type === 'company' && <Building className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                          {ws.type === 'agency' && <Users2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                          {ws.type === 'candidate' && <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          {ws.type === 'admin' && <Lock className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                          <span className="truncate">{ws.name}</span>
                        </div>
                        {activeWorkspace?.id === ws.id && (
                          <span className="text-3xs bg-neutral-900 text-white px-1.5 py-0.2 rounded font-bold">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Sign Out */}
                <div className="border-t border-neutral-100 pt-1 p-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* User is NOT Signed In - Mobbin Pill Actions */
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/signin"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/signup"
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Register</span>
            </Link>
          </div>
        )}

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white shadow-xl px-5 py-4 space-y-3">
          {user && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-950">{profile?.full_name || user.email}</p>
                <p className="text-3xs uppercase font-extrabold text-amber-700">{activeWorkspace?.name || activeRole}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-1 text-sm font-semibold text-neutral-700">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                isActive('/jobs') ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find Jobs</span>
            </Link>
            <Link
              href="/walk-ins"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                isActive('/walk-ins') ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4 text-amber-600" />
              <span>Walk-in Drives</span>
            </Link>
            <Link
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                isActive('/companies') ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Companies</span>
            </Link>
            <Link
              href="/locations"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                isActive('/locations') ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Industrial Clusters</span>
            </Link>
            <Link
              href="/trust-and-safety"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                isActive('/trust-and-safety') ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Trust & Safety</span>
            </Link>

            {user ? (
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center gap-2 mt-2"
              >
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>Go to My Workspace</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
