import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  MapPin,
  Building2,
  Bus,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Navigation,
  CheckCircle2,
  ChevronLeft,
  Info,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import { CHAKAN_PILOT_LOCATIONS, getPilotLocationBySlug } from '../../data/pilot-locations';
import { useApp } from '../../context/AppContext';

export default function LocationDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { jobs, companies } = useApp();

  const location = typeof slug === 'string' ? getPilotLocationBySlug(slug) : undefined;

  if (!location) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
        <MapPin className="w-12 h-12 text-neutral-300" />
        <h1 className="text-xl font-bold text-neutral-900">Industrial Location Not Found</h1>
        <p className="text-xs text-neutral-500 max-w-md">
          The requested industrial cluster is not currently part of the active Chakan–Khed pilot launch.
        </p>
        <Link href="/locations">
          <button className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Return to All Locations
          </button>
        </Link>
      </div>
    );
  }

  // Filter jobs and companies related to this cluster
  const clusterJobs = jobs.filter(
    (j) =>
      j.clusterName.toLowerCase().includes(location.name.toLowerCase()) ||
      j.clusterName.toLowerCase().includes(location.id.toLowerCase()) ||
      location.name.toLowerCase().includes(j.clusterName.toLowerCase())
  );

  const clusterCompanies = companies.filter(
    (c) =>
      c.clusterName.toLowerCase().includes(location.name.toLowerCase()) ||
      c.clusterId === location.id ||
      location.name.toLowerCase().includes(c.clusterName.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>{`${location.name} (${location.marathiName}) • Industrial Jobs & Manufacturing Hub • UdyogSetu`}</title>
        <meta
          name="description"
          content={`Explore verified industrial vacancies, machine shop roles, plant transit routes, and manufacturing units in ${location.name}, Pune.`}
        />
      </Head>

      <div className="flex-1 p-4 sm:p-7 space-y-6">
        {/* Back Link */}
        <Link
          href="/locations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Chakan–Khed Industrial Belts</span>
        </Link>

        {/* Hero Header */}
        <div className="bg-[#F7F8FA] border border-[#E4E6EB] rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-3xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-2xs">
                PIN {location.pincode} • {location.zone}
              </span>
              <span className="text-3xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active Pilot Cluster
              </span>
            </div>
            <div className="text-xs font-semibold text-neutral-600">
              <span className="font-bold text-neutral-900">{location.activeCompaniesCount}</span> Plants •{' '}
              <span className="font-bold text-neutral-900">{location.openJobsCount}</span> Estimated Openings
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              {location.name}
            </h1>
            <p className="text-sm font-semibold text-neutral-500 mt-0.5">{location.marathiName}</p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
            {location.description}
          </p>

          {/* Key Industries Tags */}
          <div className="pt-2 flex flex-wrap gap-2">
            {location.keyIndustries.map((ind) => (
              <span
                key={ind}
                className="text-3xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-neutral-200/80 text-neutral-700"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Trust & Network Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Pilot Expansion Transparency Notice:</span>
            <p className="text-2xs text-amber-800/90 leading-relaxed">{location.disclaimer}</p>
          </div>
        </div>

        {/* Grid: Transit & Landmark Intel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Transit & Commute Guide */}
          <div className="bg-[#F2F6FD] border border-[#D8E6FA] rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-blue-900">
              <Bus className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold">Public Transit & Shift Commute</h2>
            </div>
            <p className="text-xs text-blue-950/80 leading-relaxed">{location.transitAccess}</p>

            <div className="space-y-3 pt-2">
              <div>
                <span className="text-3xs font-bold uppercase tracking-wider text-blue-700">PMPML Bus Routes:</span>
                <ul className="mt-1 space-y-1">
                  {location.pmpmlBusRoutes.map((route) => (
                    <li key={route} className="text-xs text-neutral-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>{route}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-3xs font-bold uppercase tracking-wider text-blue-700">
                  Shared Auto & Tempo Stands:
                </span>
                <ul className="mt-1 space-y-1">
                  {location.sharedTransitHubs.map((hub) => (
                    <li key={hub} className="text-xs text-neutral-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>{hub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key Industrial Landmarks & Gate Pass Info */}
          <div className="bg-[#F1F8F4] border border-[#D5ECE0] rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900">
              <Navigation className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold">Primary Landmarks & Security Gate Norms</h2>
            </div>

            <div className="p-3.5 bg-white/80 rounded-2xl border border-emerald-200/60 text-xs space-y-2">
              <div className="text-3xs uppercase tracking-wider font-bold text-emerald-800">
                Key Industrial Reference:
              </div>
              <div className="font-semibold text-neutral-900 text-xs">{location.landmark}</div>
            </div>

            <div className="space-y-2 text-xs text-neutral-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Gate Pass Requirement:</strong> Technicians reporting for interviews must carry Aadhaar card,
                  ITI/Diploma certificates, and safety shoes for shopfloor assessment.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Fee Guarantee:</strong> No security deposit, uniform charge, or registration fee is ever
                  permitted. Report any extortion to plant management or platform admin.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Verified Vacancies in this Cluster */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-950">Active Vacancies in {location.name}</h2>
              <p className="text-xs text-neutral-500">Verified factory roles matching local MIDC requirements.</p>
            </div>
            <Link href={`/jobs?cluster=${encodeURIComponent(location.name)}`}>
              <button className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1">
                <span>View Full Filtered List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {clusterJobs.length === 0 ? (
            <div className="bg-[#F7F8FA] border border-[#E4E6EB] rounded-3xl p-8 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-900">
                New Vacancies Being Onboarded for {location.name}
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Our local operations team is actively verifying direct plant vacancies in this sector. Set up WhatsApp
                job alerts to receive instantaneous notifications.
              </p>
              <Link href="/candidate/assistant">
                <button className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl">
                  Ask Career Assistant About This Area
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clusterJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E4E6EB] rounded-3xl p-5 hover:border-neutral-400 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-3xs font-bold text-neutral-500 uppercase tracking-wider">
                          {job.category}
                        </span>
                        <h3 className="text-base font-bold text-neutral-950 mt-0.5">{job.title}</h3>
                        <p className="text-xs font-semibold text-neutral-600">{job.companyName}</p>
                      </div>
                      <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Direct Plant
                      </span>
                    </div>

                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-3 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {job.specificLocation}
                      </span>
                      <span className="font-bold text-neutral-900">
                        ₹{job.salary.inHandMonthly.toLocaleString()}/mo in-hand
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-3xs text-neutral-500">Min. Exp: {job.experienceRequired}</span>
                    <Link href={`/jobs/${job.id}`}>
                      <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
                        View &amp; Apply
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Participating Verified Employers */}
        {clusterCompanies.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-neutral-950">Participating Units in {location.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clusterCompanies.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#F7F8FA] border border-[#E4E6EB] rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-neutral-900">{c.name}</h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-3xs text-neutral-500">{c.industry}</p>
                  </div>
                  <Link href={`/companies/${c.slug || c.id}`}>
                    <button className="text-2xs font-semibold text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1 rounded-lg hover:border-black">
                      Profile
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
