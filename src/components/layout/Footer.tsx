import React from 'react';
import Link from 'next/link';
import { Factory, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200/80 bg-zinc-50/70 text-zinc-600 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/logo.png"
                alt="Rozzy • Industrial Employment Network"
                className="h-6 sm:h-7 w-auto object-contain block"
              />
              <span className="bg-zinc-200/80 text-zinc-800 text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider self-center">
                CHAKAN
              </span>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Hyperlocal industrial employment network connecting verified factories across Chakan MIDC (Phases 1–4),
              Khed City, and Pune belt with skilled shopfloor workers, ITI technicians, and production engineers.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-2xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>₹0 Fee Guarantee: 100% Free Forever for Job Seekers</span>
            </div>
          </div>

          {/* Column 1: Candidates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">For Job Seekers</h4>
            <ul className="space-y-2 text-zinc-500 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-zinc-950 transition-colors">Find Industrial Jobs</Link>
              </li>
              <li>
                <Link href="/walk-ins" className="hover:text-zinc-950 transition-colors">Plant Gate Walk-ins</Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-zinc-950 transition-colors">12 Industrial Belts</Link>
              </li>
              <li>
                <Link href="/candidate/assistant" className="hover:text-zinc-950 transition-colors">WhatsApp Job Alerts</Link>
              </li>
              <li>
                <Link href="/trust-and-safety" className="hover:text-zinc-950 transition-colors">Fee Scam Protection</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Employers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">For Plant HR & MSMEs</h4>
            <ul className="space-y-2 text-zinc-500 text-xs">
              <li>
                <Link href="/employer/post-job" className="hover:text-zinc-950 transition-colors">Post a Factory Vacancy</Link>
              </li>
              <li>
                <Link href="/employer/signup" className="hover:text-zinc-950 transition-colors">Register Manufacturing Unit</Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-zinc-950 transition-colors">Verified Plant Directory</Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-zinc-950 transition-colors">Employer Workspace</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Governance & Trust</h4>
            <ul className="space-y-2 text-zinc-500 text-xs">
              <li>
                <Link href="/about" className="hover:text-zinc-950 transition-colors">About Rozzy</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-zinc-950 transition-colors">Report Illegal Placement Agency</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Statutory Service</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-3xs text-zinc-400">
          <p>© 2026 Rozzy. All rights reserved. Direct shopfloor industrial recruitment platform.</p>
          <p className="flex items-center gap-1.5 text-zinc-500">
            <span>Built for Chakan MIDC, Khed City, Mahalunge, Kuruli & Pune Industrial Belt</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
