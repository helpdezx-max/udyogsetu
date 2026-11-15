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
  RotateCcw,
} from 'lucide-react';
import { useApp, UserRole, Locale } from '../../context/AppContext';
import { useLocale } from '../../hooks/useLocale';

export const Header: React.FC = () => {
  const router = useRouter();
  const { savedJobIds, activeRole, setActiveRole, resetDemoData, isSupabaseConnected } = useApp();
  const { locale, setLocale, t } = useLocale();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'candidate') router.push('/candidate/dashboard');
    else if (role === 'employer') router.push('/employer/dashboard');
    else if (role === 'agency') router.push('/agency/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
    else router.push('/');
  };

  return (
    <header className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-neutral-800/10 px-4 sm:px-7 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 relative z-40">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 group shrink-0">
        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs group-hover:bg-neutral-800 transition-colors">
          <Factory className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-neutral-900">
              {t('brandName') || 'UdyogSetu'}
            </span>
            <span className="bg-amber-100 text-amber-900 text-3xs font-black uppercase px-1.5 py-0.5 rounded tracking-wider">
              CHAKAN
            </span>
          </div>
          <p className="text-3xs text-neutral-400 font-medium -mt-0.5 hidden sm:block">
            Industrial Employment Network
          </p>
        </div>
      </Link>

      {/* Main Navigation Links (Desktop) */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
        <Link
          href="/jobs"
          className={`rounded-full px-3.5 py-1.5 transition-colors flex items-center gap-1.5 ${
            isActive('/jobs')
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Jobs</span>
        </Link>

        <Link
          href="/walk-ins"
          className={`rounded-full px-3.5 py-1.5 transition-colors flex items-center gap-1.5 ${
            isActive('/walk-ins')
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
          <span>Walk-in Drives</span>
        </Link>

        <Link
          href="/companies"
          className={`rounded-full px-3.5 py-1.5 transition-colors flex items-center gap-1.5 ${
            isActive('/companies')
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Companies</span>
        </Link>

        <Link
          href="/locations"
          className={`rounded-full px-3.5 py-1.5 transition-colors flex items-center gap-1.5 ${
            isActive('/locations')
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Industrial Clusters</span>
        </Link>

        <Link
          href="/trust-and-safety"
          className={`rounded-full px-3.5 py-1.5 transition-colors flex items-center gap-1.5 ${
            isActive('/trust-and-safety')
              ? 'bg-neutral-900 text-white font-bold shadow-xs'
              : 'hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trust & Safety</span>
        </Link>
      </nav>

      {/* Compact Utility & Account Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Pill */}
        <div className="flex items-center border border-neutral-200 rounded-full p-0.5 text-3xs font-bold uppercase bg-neutral-50">
          {(['en', 'mr', 'hi'] as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                locale === loc
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Saved Jobs Icon */}
        <Link
          href="/candidate/saved-jobs"
          className="relative p-2 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
          title="Saved Jobs"
        >
          <Bookmark className="w-4 h-4" />
          {savedJobIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-3xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {savedJobIds.length}
            </span>
          )}
        </Link>

        {/* Backend Connection Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-3xs font-bold border border-neutral-200 bg-neutral-50 text-neutral-700" title={isSupabaseConnected ? 'Connected to live Supabase database' : 'Running in local interactive mode'}>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isSupabaseConnected ? 'Supabase Live' : 'Demo State'}</span>
        </div>

        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <span className="capitalize">{activeRole}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {portalDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs">
              <div className="px-3 py-1 text-3xs font-bold uppercase tracking-wider text-neutral-400">
                Switch Portal Persona
              </div>
              <button
                onClick={() => handleRoleChange('public')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800 flex items-center gap-2"
              >
                <Search className="w-3.5 h-3.5 text-neutral-500" />
                <span>Public Visitor</span>
              </button>
              <button
                onClick={() => handleRoleChange('candidate')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Candidate (Mahesh)</span>
              </button>
              <button
                onClick={() => handleRoleChange('employer')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800 flex items-center gap-2"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Plant HR (Sahyadri)</span>
              </button>
              <button
                onClick={() => handleRoleChange('agency')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800 flex items-center gap-2"
              >
                <Users2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Agency (Pragati)</span>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 font-medium text-neutral-800 border-t border-neutral-100 flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin Moderation</span>
              </button>

              <div className="border-t border-neutral-100 mt-1 pt-1 px-3">
                <button
                  onClick={() => {
                    if (confirm('Reset all demo state to factory default?')) {
                      resetDemoData();
                      router.reload();
                    }
                  }}
                  className="w-full text-left py-1 text-3xs font-semibold text-neutral-400 hover:text-amber-600 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Post Job CTA */}
        <Link href="/employer/post-job" className="hidden sm:inline-block">
          <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs transition-colors">
            Post a Job
          </button>
        </Link>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral-200 shadow-xl px-5 py-4 space-y-3 z-50">
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
              <span>Companies Directory</span>
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
          </nav>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <Link
              href="/employer/post-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-neutral-900 text-white font-semibold text-xs py-2 rounded-xl"
            >
              Post an Industrial Job
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
