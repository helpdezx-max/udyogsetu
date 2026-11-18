import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 text-3xs text-zinc-400 px-1">
      <div className="flex flex-wrap items-center gap-2">
        <span>
          © 2026 <strong className="text-zinc-100 font-semibold">UdyogSetu</strong> • Hyperlocal Industrial Employment Network
        </span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span className="hidden sm:inline text-zinc-500">
          Chakan MIDC (Phases 1–4), Khed City, Mahalunge & Pune Belt
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/jobs" className="hover:text-white transition-colors">Find Jobs</Link>
        <Link href="/walk-ins" className="hover:text-white transition-colors">Walk-ins</Link>
        <Link href="/companies" className="hover:text-white transition-colors">Companies</Link>
        <Link href="/locations" className="hover:text-white transition-colors">Clusters</Link>
        <Link href="/trust-and-safety" className="hover:text-white transition-colors">Trust & Safety</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
      </div>
    </footer>
  );
};
