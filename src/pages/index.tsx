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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../hooks/useLocale';
import { JobCard } from '../components/common/JobCard';
import { INDUSTRIAL_CLUSTERS } from '../data/demo-data';

export default function HomePage() {
  const router = useRouter();
  const { jobs, companies, walkIns } = useApp();
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

  const categories = [
    { name: 'Machining & CNC', count: '14 Vacancies', icon: <Cpu className="w-5 h-5 text-indigo-700" />, bg: 'bg-[#F2F6FD]', border: 'border-[#D8E6FA]' },
    { name: 'Welding & Fabrication', count: '16 Vacancies', icon: <Layers className="w-5 h-5 text-amber-700" />, bg: 'bg-[#FFF9EE]', border: 'border-[#FAECBF]' },
    { name: 'Assembly & Line', count: '45 Vacancies', icon: <Wrench className="w-5 h-5 text-emerald-700" />, bg: 'bg-[#F1F8F4]', border: 'border-[#D5ECE0]' },
    { name: 'Quality Control & CMM', count: '8 Vacancies', icon: <CheckCircle className="w-5 h-5 text-purple-700" />, bg: 'bg-[#F7F4FC]', border: 'border-[#E8E0F5]' },
    { name: 'Maintenance & Electrical', count: '7 Vacancies', icon: <Factory className="w-5 h-5 text-rose-700" />, bg: 'bg-[#FAF4F0]', border: 'border-[#F4E3DA]' },
    { name: 'Warehouse & Logistics', count: '12 Vacancies', icon: <Building2 className="w-5 h-5 text-slate-700" />, bg: 'bg-[#F7F8FA]', border: 'border-[#E4E6EB]' },
  ];

  const qualifications = [
    { title: '10th / 12th Pass', desc: 'Assembly Helper, Press Feeder, Store Assistant', count: '38 Openings', bg: 'bg-[#F7F8FA]', border: 'border-[#E4E6EB]' },
    { title: 'ITI Certificate Holders', desc: 'VMC Operator, CNC Lathe, Die Setter, Maintenance', count: '42 Openings', bg: 'bg-[#F1F8F4]', border: 'border-[#D5ECE0]' },
    { title: 'Diploma (Mechanical / Auto)', desc: 'Junior Engineer, CMM Quality Inspector, Toolmaker', count: '24 Openings', bg: 'bg-[#F2F6FD]', border: 'border-[#D8E6FA]' },
    { title: 'B.E. / B.Tech Engineers', desc: 'Production Shift Incharge, EHS Safety Officer', count: '12 Openings', bg: 'bg-[#F7F4FC]', border: 'border-[#E8E0F5]' },
  ];

  const featuredJobs = jobs.slice(0, 6);
  const todayWalkIns = walkIns.slice(0, 3);
  const verifiedCompanies = companies.filter((c) => c.verificationStatus === 'verified').slice(0, 6);

  return (
    <>
      <Head>
        <title>UdyogSetu • Genuine Industrial Jobs in Chakan MIDC & Pune Belt</title>
      </Head>

      <div className="space-y-12 pb-16">
        {/* 1. HERO SECTION (Clean, Modern, Approachable) */}
        <section className="px-5 sm:px-10 lg:px-14 pt-10 sm:pt-14 pb-10 border-b border-neutral-100 bg-gradient-to-b from-[#FAFAFA] to-white">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 text-3xs sm:text-2xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Factory Recruitment • Chakan MIDC & Pune Belt</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
              {t('hero.headline') || 'Find Your Next Job Closer to Home.'}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {t('hero.subheadline') ||
                'Discover genuine factory, manufacturing and industrial job opportunities across Chakan and surrounding industrial areas.'}
            </p>

            {/* Prominent Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-6 p-2 rounded-2xl bg-white border border-neutral-200/90 shadow-lg text-neutral-900 grid grid-cols-1 md:grid-cols-12 gap-2 text-left"
            >
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t('hero.searchPlaceholder') || 'Job title, machine, skill (e.g. VMC Operator, Welder)...'}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl bg-neutral-50/70 border border-transparent focus:bg-white focus:border-neutral-300 focus:outline-none"
                />
              </div>

              <div className="md:col-span-4 relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={cluster}
                  onChange={(e) => setCluster(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl bg-neutral-50/70 border border-transparent focus:bg-white focus:border-neutral-300 focus:outline-none text-neutral-800 cursor-pointer"
                >
                  <option value="">{t('hero.locationPlaceholder') || 'All Industrial Clusters'}</option>
                  {INDUSTRIAL_CLUSTERS.map((cl) => (
                    <option key={cl.id} value={cl.name}>
                      {cl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full min-h-[42px] bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('hero.searchButton') || 'Search Jobs'}</span>
                </button>
              </div>
            </form>

            {/* Popular Search Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-500">
              <span className="text-3xs font-bold uppercase tracking-wider text-neutral-400">Popular:</span>
              {['VMC Operator', 'MIG Welder', 'CNC Lathe', 'Assembly Freshers', 'Electrician'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeyword(tag);
                    router.push(`/jobs?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-3xs font-medium border border-neutral-200/60 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link href="/jobs">
                <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs transition-colors">
                  Browse All Jobs
                </button>
              </Link>
              <Link href="/walk-ins">
                <button className="bg-[#FFF9EE] hover:bg-[#FAEDC8] text-[#7C5104] border border-[#FAECBF] text-xs font-semibold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5">
                  <CalendarCheck2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Today's Walk-in Drives</span>
                </button>
              </Link>
              <Link href="/employer/post-job">
                <button className="border border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors">
                  Post a Job (Plant HR)
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. FEATURED INDUSTRIAL VACANCIES (Pastel Card Grid) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Verified Vacancies
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Featured Factory Positions
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Authentic direct manufacturing vacancies with confirmed in-hand monthly salaries.
              </p>
            </div>

            <Link
              href="/jobs"
              className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>Explore all vacancies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {featuredJobs.map((job, idx) => (
              <JobCard key={job.id} job={job} index={idx} />
            ))}
          </div>
        </section>

        {/* 3. TODAY'S WALK-IN SPOTLIGHT (Pastel Warm Cards) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                Gate Walk-in Calendar
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Spot Hiring Drives in Chakan
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Report directly to verified factory gates with original certificates and safety shoes.
              </p>
            </div>

            <Link
              href="/walk-ins"
              className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>View full calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {todayWalkIns.map((walkin) => (
              <div
                key={walkin.id}
                className="bg-[#FFF9EE] border border-[#FAECBF] rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-card transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAEDC8] text-[#7C5104] uppercase tracking-wide">
                      {walkin.eventDates}
                    </span>
                    <span className="text-xs font-bold text-[#7C5104]">
                      {walkin.openingsCount} Vacancies
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{walkin.jobTitle}</h3>
                    <p className="text-xs font-medium text-neutral-600">{walkin.companyName}</p>
                  </div>

                  <div className="text-xs space-y-1.5 py-2.5 border-y border-amber-200/50 text-neutral-600">
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{walkin.reportingTime}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{walkin.venueAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-neutral-900">
                    {walkin.salaryDisplay.split('+')[0]}
                  </span>
                  <Link href={`/jobs/${walkin.jobId}`}>
                    <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors">
                      View Venue
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. EXPLORE BY TRADE (Pastel Card Grid) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Industrial Trades
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Browse by Machine & Skill
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Positions mapped specifically to technical trade certifications and shop-floor experience.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className={`${cat.bg} ${cat.border} border rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2 group transition-all hover:-translate-y-0.5 hover:shadow-card`}
              >
                <div className="p-2.5 rounded-xl bg-white shadow-2xs group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:underline">
                    {cat.name}
                  </div>
                  <div className="text-3xs text-neutral-500 mt-0.5">{cat.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. JOBS BY QUALIFICATION (Pastel Card Grid) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Targeted Eligibility
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Jobs by Educational Qualification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {qualifications.map((q) => (
              <div
                key={q.title}
                className={`${q.bg} ${q.border} border rounded-3xl p-5 flex flex-col justify-between space-y-3 transition-all hover:shadow-card`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <GraduationCap className="w-5 h-5 text-neutral-700" />
                    <span className="text-3xs font-bold text-neutral-700 bg-white/90 px-2 py-0.5 rounded-full border border-neutral-200">
                      {q.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">{q.title}</h3>
                  <p className="text-xs text-neutral-600">{q.desc}</p>
                </div>

                <Link
                  href={`/jobs?qualification=${encodeURIComponent(q.title.split(' ')[0])}`}
                  className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1 pt-2"
                >
                  <span>Browse Vacancies</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 6. VERIFIED COMPANIES (Pastel Card Grid) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="text-3xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                Employer Network
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Verified Industrial Plants Hiring in Pune
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every listed plant has a verified physical footprint and authenticated Udyam credentials.
              </p>
            </div>

            <Link
              href="/companies"
              className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
            >
              <span>View All Plants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedCompanies.map((comp) => (
              <div
                key={comp.id}
                className="bg-[#F7F8FA] border border-[#E4E6EB] rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-card transition-all"
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
                        <h3 className="font-bold text-neutral-900 text-sm truncate">{comp.name}</h3>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-3xs text-neutral-500">{comp.industry}</p>
                      <p className="text-3xs text-neutral-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {comp.clusterName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 text-3xs bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                    {comp.openVacanciesCount} Vacancies
                  </span>
                  <Link href={`/companies/${comp.slug || comp.id}`}>
                    <button className="text-xs font-semibold text-neutral-900 hover:underline">
                      Plant Profile →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. INDUSTRIAL CLUSTERS (Pastel Grid) */}
        <section className="px-5 sm:px-10 lg:px-14 space-y-6">
          <div>
            <div className="text-3xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Hyperlocal Geography
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Industrial Hubs Across Chakan & North Pune
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Target vacancies situated within direct commuting distance of your residence or bus routes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIAL_CLUSTERS.map((cl) => (
              <Link
                key={cl.id}
                href={`/jobs?cluster=${encodeURIComponent(cl.name)}`}
                className="p-5 rounded-3xl bg-[#F7F8FA] border border-[#E4E6EB] hover:bg-white hover:shadow-card transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xs font-bold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      PIN {cl.pincode}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">
                      {cl.openJobsCount} Openings
                    </span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm group-hover:underline">
                    {cl.name}
                  </h3>
                  <p className="text-3xs text-neutral-500 mt-1 line-clamp-1">{cl.landmark}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-neutral-200/60 text-3xs text-neutral-500 flex items-center justify-between">
                  <span>{cl.transitAccess.split('from')[0]}</span>
                  <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 8. CANDIDATE SAFETY GUARANTEE (Pale Mint Card) */}
        <section className="px-5 sm:px-10 lg:px-14">
          <div className="p-6 rounded-3xl bg-[#F1F8F4] border border-[#D5ECE0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white text-emerald-700 rounded-2xl shadow-2xs shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-950">
                  Candidate Safety & Anti-Fraud Guarantee
                </h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                  UdyogSetu strictly prohibits any recruitment charges. No legitimate factory or contractor will ask for
                  registration fees, uniform security deposits, or file charges. If anyone asks for money, report them immediately.
                </p>
              </div>
            </div>

            <Link href="/trust-and-safety">
              <button className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-xs transition-colors">
                Read Trust Guidelines
              </button>
            </Link>
          </div>
        </section>

        {/* 9. FACTORY HR RECRUITMENT CTA */}
        <section className="px-5 sm:px-10 lg:px-14">
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white text-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-3xs font-bold uppercase tracking-wider">
              Factory HR & Plant Managers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight max-w-xl mx-auto">
              Hire Skilled Machine Operators, Fitters & Line Workers Faster
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Reach 15,000+ local ITI certificate holders, diploma engineers, and manufacturing technicians residing in the Chakan industrial corridor.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/employer/post-job">
                <button className="bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors">
                  Post Vacancy Now
                </button>
              </Link>
              <Link href="/employer/register">
                <button className="border border-neutral-700 text-white hover:bg-neutral-800 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
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
