import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldX, ArrowLeft, ArrowRight, Lock, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccessDeniedPage() {
  const router = useRouter();
  const { user, roles, activeRole, signOut } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/signin';
    if (roles.includes('admin')) return '/admin/dashboard';
    if (roles.includes('agency')) return '/agency/dashboard';
    if (roles.includes('employer')) return '/employer/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <>
      <Head>
        <title>Access Denied (403) • Rozzy</title>
      </Head>

      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-industrial-200 p-7 sm:p-9 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-3xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded">
              HTTP 403 Forbidden
            </span>
            <h1 className="text-2xl font-black text-industrial-950 tracking-tight">
              Access Restricted
            </h1>
            <p className="text-xs text-industrial-600 leading-relaxed">
              You do not have the required role or organization membership permissions to access this workspace.
            </p>
          </div>

          <div className="p-4 bg-industrial-50 rounded-2xl border border-industrial-200 text-xs text-industrial-700 text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-industrial-900">
              <Lock className="w-4 h-4 text-industrial-500" />
              <span>Session Authorization</span>
            </div>
            <div className="space-y-1 text-3xs text-industrial-600">
              <p>Signed In As: <strong>{user?.email || 'Anonymous Visitor'}</strong></p>
              <p>Active Role: <span className="capitalize font-bold text-industrial-900">{activeRole || 'Public'}</span></p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={getHomeRoute()}
              className="w-full py-3 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Your Authorized Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={() => signOut()}
              className="w-full py-2.5 px-4 rounded-xl border border-industrial-200 text-industrial-700 hover:bg-industrial-50 font-bold text-xs transition-colors"
            >
              Sign Out & Switch Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
