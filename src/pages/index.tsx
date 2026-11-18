import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Search,
  MapPin,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Factory,
  Wrench,
  Cpu,
  Layers,
  Clock,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../hooks/useLocale';
import { JobCard } from '../components/common/JobCard';
import { CHAKAN_PILOT_LOCATIONS } from '../data/pilot-locations';

const POPULAR_SEARCHES = [
  'VMC Operator',
  'CNC Lathe',
  'MIG Welder',
  'Quality Inspector',
  'ITI Fitter',
  '10th Pass Helper',
  'Tool & Die',
  'Assembly Line',
];

export default function HomePage() {
  const router = useRouter();
  const { jobs, companies, walkIns, isLoading } = useApp();
  const { t } = useLocale();

  const [keyword, setKeyword] = useState('');
  const [cluster, setCluster] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push({
      pathname: '/jobs',
      query: {
        ...(keyword ? { q: keyword } : {}),
        ...(cluster ? { cluster } : {}),
      },
    });
  };

  const handleQuickSearch = (term: string) => {
    router.push({
      pathname: '/jobs',
      query: { q: term },
    });
  };

  const getCategoryCount = (catName: string) => jobs.filter((j) => j.category === catName).length;

  const categories = [
    {
      name: 'Machining & CNC',
      count: getCategoryCount('Machining & CNC'),
      icon: <Cpu className="w-5 h-5 text-zinc-900" />,
    },
    {
      name: 'Welding & Fabrication',
      count: getCategoryCount('Welding & Fabrication'),
      icon: <Layers className="w-5 h-5 text-zinc-900" />,
    },
    {
      name: 'Assembly & Line',
      count: getCategoryCount('Assembly & Line'),
      icon: <Wrench className="w-5 h-5 text-zinc-900" />,
    },
    {
      name: 'Quality Control & CMM',
      count: getCategoryCount('Quality Control & CMM'),
      icon: <CheckCircle className="w-5 h-5 text-zinc-900" />,
    },
    {
      name: 'Maintenance & Electrical',
      count: getCategoryCount('Maintenance & Electrical'),
      icon: <Factory className="w-5 h-5 text-zinc-900" />,
    },
    {
      name: 'Warehouse & Logistics',
      count: getCategoryCount('Warehouse & Logistics'),
      icon: <Building2 className="w-5 h-5 text-zinc-900" />,
    },
  ];

  const getQualCount = (qualPrefix: string) =>
    jobs.filter((j) => j.qualificationRequired && j.qualificationRequired.includes(qualPrefix)).length;

  const qualifications = [
    {
      title: '10th / 12th Pass',
      prefix: '10th',
      desc: 'Assembly Helper, Press Feeder, Store Assistant',
      count: getQualCount('10th'),
    },
    {
      title: 'ITI Certificate Holders',
      prefix: 'ITI',
      desc: 'VMC Operator, CNC Lathe, Die Setter, Maintenance',
      count: getQualCount('ITI'),
    },
    {
      title: 'Diploma (Mechanical / Auto)',
      prefix: 'Diploma',
      desc: 'Junior Engineer, CMM Quality Inspector, Toolmaker',
      count: getQualCount('Diploma'),
    },
    {
      title: 'B.E. / B.Tech Engineers',
      prefix: 'B.E.',
      desc: 'Production Shift Incharge, EHS Safety Officer',
      count: getQualCount('B.E.'),
    },
  ];

  const featuredJobs = jobs.filter((j) => j.status === 'active').slice(0, 6);
  const todayWalkIns = walkIns.slice(0, 3);
  const verifiedCompanies = companies.filter((c) => c.verificationStatus === 'verified').slice(0, 6);

  return (
    <>
      <Head>
        <title>UdyogSetu • Genuine Industrial Jobs in Chakan MIDC &amp; Pune Belt</title>
        <meta
          name="description"
          content="Find verified direct factory jobs, CNC machining, welding, assembly, and ITI apprenticeship positions across Chakan MIDC and Pune."
        />
      </Head>

      <div className="w-full space-y-16 pb-20">
        {/* 1. HERO SECTION (Mobbin Style) */}
        <section className="relative border-b border-zinc-200/80 bg-gradient-to-b from-zinc-50/70 via-white to-white pt-12 sm:pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-semibold tracking-tight shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Factory Recruitment • Chakan MIDC &amp; Pune Belt</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.08] max-w-4xl mx-auto">
              Find Verified Factory Jobs, <br className="hidden sm:inline" />
              <span className="text-zinc-500">Without Middlemen.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subheadline') ||
                'Direct manufacturing vacancies across Chakan Phases 1–4, Khed City, Kuruli & Pune. Confirmed in-hand wages, transparent plant gate walk-ins, and zero candidate fees.'}
            </p>

            {/* Mobbin-style Floating Search Bar */}
            <div className="max-w-3xl mx-auto pt-2">
              <form
                onSubmit={handleHeroSearch}
                className="p-2 rounded-2xl sm:rounded-full bg-white border border-zinc-200/90 shadow-subtle hover:border-zinc-300 hover:shadow-mobbin transition-all text-zinc-900 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex-1 w-full relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t('hero.searchPlaceholder') || 'Job title, machine, skill (e.g. VMC Operator, Welder)...'}
                    className="w-full text-xs sm:text-sm pl-11 pr-3 py-2.5 rounded-xl sm:rounded-full bg-transparent border-none focus:outline-none placeholder:text-zinc-400"
                  />
                </div>

                <div className="hidden sm:block h-6 w-px bg-zinc-200" />

                <div className="w-full sm:w-56 relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
                  <select
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl sm:rounded-full bg-transparent border-none focus:outline-none text-zinc-800 cursor-pointer"
                  >
                    <option value="">{t('hero.locationPlaceholder') || 'All Industrial Clusters'}</option>
                    {CHAKAN_PILOT_LOCATIONS.map((cl) => (
                      <option key={cl.id} value={cl.name}>
                        {cl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl sm:rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('hero.ctaButton') || 'Search Vacancies'}</span>
                </button>
              </form>

              {/* Popular Searches Pill Chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="text-zinc-400 text-2xs uppercase tracking-wider font-semibold mr-1">Popular:</span>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 text-2xs font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/jobs">
                <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse All Jobs</span>
                </button>
              </Link>
              <Link href="/walk-ins">
                <button className="bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Plant Gate Walk-ins</span>
                </button>
              </Link>
              <Link href="/employer/post-job">
                <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-2xs">
                  <span>Post a Job (Plant HR)</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. FEATURED INDUSTRIAL VACANCIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Verified Vacancies
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Featured Factory Positions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Authentic direct manufacturing vacancies with confirmed in-hand monthly salaries.
              </p>
            </div>

            <Link
              href="/jobs"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>Explore all vacancies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredJobs.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 shadow-2xs flex items-center justify-center mx-auto text-zinc-500">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900">
                  New Industrial Vacancies Coming Soon
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
                  Direct manufacturing units in Chakan Phase 1–4 and Khed City are currently onboarding positions. Check
                  back for verified factory roles or set up instant WhatsApp alerts.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link href="/candidate/assistant">
                  <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors">
                    Set Up Job Alert on WhatsApp
                  </button>
                </Link>
                <Link href="/locations">
                  <button className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors">
                    Explore 12 Industrial Belts
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} index={idx} />
              ))}
            </div>
          )}
        </section>

        {/* 3. TODAY'S WALK-IN SPOTLIGHT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                Gate Walk-in Calendar
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Spot Hiring Drives in Chakan
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Report directly to verified factory gates with original certificates and safety shoes.
              </p>
            </div>

            <Link
              href="/walk-ins"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>View Full Calendar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {todayWalkIns.length === 0 ? (
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-8 text-center space-y-2 max-w-2xl mx-auto shadow-subtle">
              <CalendarCheck2 className="w-7 h-7 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-900">No Spot Gate Drives Scheduled Today</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Verified walk-in drives are typically conducted on Mondays and Saturdays. Browse regular vacancies or
                check back for upcoming plant gate drives.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {todayWalkIns.map((walkin) => (
                <div
                  key={walkin.id}
                  className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-300 hover:shadow-mobbin-hover transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 uppercase tracking-wide">
                        {walkin.eventDates}
                      </span>
                      <span className="text-xs font-bold text-zinc-900">
                        {walkin.openingsCount} Vacancies
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-zinc-950 text-sm">{walkin.jobTitle}</h3>
                      <p className="text-xs font-medium text-zinc-500">{walkin.companyName}</p>
                    </div>

                    <div className="text-xs space-y-1.5 py-2.5 border-y border-zinc-100 text-zinc-600">
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{walkin.reportingTime}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{walkin.venueAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-zinc-950">
                      {walkin.salaryDisplay.split('+')[0]}
                    </span>
                    <Link href={`/jobs/${walkin.jobId}`}>
                      <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-2xs transition-colors flex items-center gap-1">
                        <span>View Venue</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. EXPLORE BY TRADE (Mobbin Minimalist Cards) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Industrial Trades
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Browse by Machine &amp; Skill
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Positions mapped specifically to technical trade certifications and shop-floor experience.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-white border border-zinc-200/90 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2 group transition-all hover:border-zinc-300 hover:shadow-mobbin-hover"
              >
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-950 group-hover:underline">
                    {cat.name}
                  </div>
                  <div className="text-2xs text-zinc-400 mt-0.5">
                    {cat.count > 0 ? `${cat.count} Vacancies` : 'Explore Sector'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. JOBS BY QUALIFICATION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Targeted Eligibility
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Jobs by Educational Qualification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {qualifications.map((q) => (
              <div
                key={q.title}
                className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-3 transition-all hover:border-zinc-300 hover:shadow-mobbin-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="w-5 h-5 text-zinc-700" />
                    <span className="text-2xs font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/60">
                      {q.count > 0 ? `${q.count} Openings` : 'Explore'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-950 mb-1">{q.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{q.desc}</p>
                </div>

                <Link
                  href={`/jobs?qualification=${encodeURIComponent(q.title.split(' ')[0])}`}
                  className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1 pt-2"
                >
                  <span>Browse Vacancies</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. VERIFIED COMPANIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Employer Network
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Verified Industrial Plants Hiring in Pune
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Every listed plant has a verified physical footprint and authenticated Udyam credentials.
              </p>
            </div>

            <Link
              href="/companies"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>View All Plants</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {verifiedCompanies.length === 0 ? (
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-3 max-w-2xl mx-auto shadow-subtle">
              <Building2 className="w-8 h-8 text-zinc-400 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-900">Expanding Manufacturing Employer Network</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Industrial plants in Chakan MIDC are currently undergoing statutory Udyam and GSTIN verification audit.
                Verified manufacturing units will appear here once audited.
              </p>
              <Link href="/employer/signup">
                <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                  Register Your Manufacturing Plant
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {verifiedCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white border border-zinc-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-300 hover:shadow-mobbin-hover transition-all"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${comp.logoPlaceholderBg} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}
                      >
                        {comp.logoLetter}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-zinc-950 text-sm truncate">{comp.name}</h3>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-2xs text-zinc-500">{comp.industry}</p>
                        <p className="text-2xs text-zinc-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {comp.clusterName}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-700 text-2xs bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200/60">
                      {comp.openVacanciesCount} Vacancies
                    </span>
                    <Link href={`/companies/${comp.slug || comp.id}`}>
                      <button className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1">
                        <span>Plant Profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. INDUSTRIAL CLUSTERS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Hyperlocal Geography
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              12 Industrial Hubs Across Chakan &amp; North Pune
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Target vacancies situated within direct commuting distance of your residence or bus routes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CHAKAN_PILOT_LOCATIONS.map((cl) => {
              const plantOpenings = jobs.filter(
                (j) =>
                  j.clusterName.toLowerCase().includes(cl.name.toLowerCase()) ||
                  cl.name.toLowerCase().includes(j.clusterName.toLowerCase())
              ).length;

              return (
                <Link
                  key={cl.id}
                  href={`/locations/${cl.id}`}
                  className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-300 hover:shadow-mobbin-hover transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xs font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/60">
                        PIN {cl.pincode}
                      </span>
                      <span className="text-xs font-semibold text-zinc-950">
                        {plantOpenings > 0 ? `${plantOpenings} Openings` : 'Explore Hub'}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-950 text-sm group-hover:underline">
                      {cl.name}
                    </h3>
                    <p className="text-2xs text-zinc-500 mt-1 line-clamp-1">{cl.landmark}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-zinc-100 text-2xs text-zinc-500 flex items-center justify-between">
                    <span>{cl.zone}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 8. CANDIDATE SAFETY GUARANTEE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-emerald-700 rounded-xl border border-emerald-200/60 shadow-2xs shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-950">
                  Candidate Safety &amp; Anti-Fraud Guarantee
                </h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-2xl leading-relaxed">
                  UdyogSetu strictly prohibits any recruitment charges. No legitimate factory or contractor will ask for
                  registration fees, uniform security deposits, or file charges. If anyone asks for money, report them
                  immediately.
                </p>
              </div>
            </div>

            <Link href="/trust-and-safety">
              <button className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full whitespace-nowrap shadow-xs transition-colors shrink-0">
                Read Trust Guidelines
              </button>
            </Link>
          </div>
        </section>

        {/* 9. FACTORY HR RECRUITMENT CTA (Mobbin Dark Card) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white text-center space-y-4 border border-zinc-900 shadow-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-2xs font-semibold uppercase tracking-wider border border-zinc-700">
              Factory HR &amp; Plant Managers
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto">
              Hire Skilled Machine Operators, Fitters &amp; Line Workers Faster
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Connect directly with verified ITI certificate holders, diploma engineers, and manufacturing technicians
              residing along direct Chakan transit corridors.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/employer/post-job">
                <button className="bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-colors">
                  Post Vacancy Now
                </button>
              </Link>
              <Link href="/employer/signup">
                <button className="border border-zinc-700 text-zinc-200 hover:bg-zinc-900 text-xs font-semibold px-5 py-2.5 rounded-full transition-colors">
                  Create Factory Account
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
