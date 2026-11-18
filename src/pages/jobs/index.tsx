import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Search,
  MapPin,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  ArrowUpDown,
  X,
  Factory,
  ChevronDown,
  Clock,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp, UserRole, Locale } from '../../context/AppContext';
import { useLocale } from '../../hooks/useLocale';
import { JobVacancy } from '../../data/demo-data';
import { CHAKAN_PILOT_LOCATIONS } from '../../data/pilot-locations';
import { JobCard } from '../../components/common/JobCard';

export default function FindJobsPage() {
  const router = useRouter();
  const {
    jobs,
    isJobSaved,
    toggleSaveJob,
    openApplyModal,
    applications,
    activeRole,
    setActiveRole,
    resetDemoData,
    savedJobIds,
  } = useApp();
  const { locale, setLocale, t } = useLocale();

  // Search & Filter State
  const [keyword, setKeyword] = useState<string>((router.query.q as string) || '');
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    router.query.cluster ? [router.query.cluster as string] : []
  );
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>(
    router.query.qualification ? [router.query.qualification as string] : []
  );
  const [fresherOnly, setFresherOnly] = useState<boolean>(false);
  const [walkinOnly, setWalkinOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'fresh' | 'salary' | 'openings'>('fresh');

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  // Sync incoming router query
  React.useEffect(() => {
    if (router.query.q) setKeyword(router.query.q as string);
    if (router.query.cluster && !selectedLocations.includes(router.query.cluster as string)) {
      setSelectedLocations([router.query.cluster as string]);
    }
  }, [router.query]);

  // Checkbox toggle helpers
  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const toggleShift = (shift: string) => {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const toggleEmploymentType = (type: string) => {
    setSelectedEmploymentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleQualification = (qual: string) => {
    setSelectedQualifications((prev) =>
      prev.includes(qual) ? prev.filter((q) => q !== qual) : [...prev, qual]
    );
  };

  const resetAllFilters = () => {
    setKeyword('');
    setSelectedLocations([]);
    setSelectedShifts([]);
    setMinSalaryFilter(0);
    setSelectedEmploymentTypes([]);
    setSelectedQualifications([]);
    setFresherOnly(false);
    setWalkinOnly(false);
    setVerifiedOnly(false);
    setSortBy('fresh');
    router.push('/jobs', undefined, { shallow: true });
  };

  // Active filter count
  const activeFiltersCount =
    (keyword ? 1 : 0) +
    selectedLocations.length +
    selectedShifts.length +
    (minSalaryFilter > 0 ? 1 : 0) +
    selectedEmploymentTypes.length +
    selectedQualifications.length +
    (fresherOnly ? 1 : 0) +
    (walkinOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Keyword
        if (
          keyword &&
          !job.title.toLowerCase().includes(keyword.toLowerCase()) &&
          !job.companyName.toLowerCase().includes(keyword.toLowerCase()) &&
          !job.requiredSkills.some((s) => s.toLowerCase().includes(keyword.toLowerCase()))
        ) {
          return false;
        }

        // Location Checkboxes
        if (
          selectedLocations.length > 0 &&
          !selectedLocations.some((loc) => job.clusterName.toLowerCase().includes(loc.toLowerCase()))
        ) {
          return false;
        }

        // Shift Checkboxes
        if (
          selectedShifts.length > 0 &&
          !selectedShifts.some((s) => job.shiftType.toLowerCase().includes(s.toLowerCase()))
        ) {
          return false;
        }

        // Salary Min
        if (minSalaryFilter > 0 && job.salary.inHandMonthly < minSalaryFilter) {
          return false;
        }

        // Employment Type
        if (
          selectedEmploymentTypes.length > 0 &&
          !selectedEmploymentTypes.some((t) => job.employmentType.toLowerCase().includes(t.toLowerCase()))
        ) {
          return false;
        }

        // Qualification
        if (
          selectedQualifications.length > 0 &&
          !selectedQualifications.some((q) => job.qualificationRequired.toLowerCase().includes(q.toLowerCase()))
        ) {
          return false;
        }

        // Fresher
        if (fresherOnly && job.experienceRequired !== 'Freshers Welcome') {
          return false;
        }

        // Walkin
        if (walkinOnly && !job.walkInAvailable) {
          return false;
        }

        // Verified
        if (verifiedOnly && job.recruitmentTier !== 'verified_direct') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') return b.salary.inHandMonthly - a.salary.inHandMonthly;
        if (sortBy === 'openings') return b.openingsCount - a.openingsCount;
        return a.postedDaysAgo - b.postedDaysAgo;
      });
  }, [
    jobs,
    keyword,
    selectedLocations,
    selectedShifts,
    minSalaryFilter,
    selectedEmploymentTypes,
    selectedQualifications,
    fresherOnly,
    walkinOnly,
    verifiedOnly,
    sortBy,
  ]);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setPortalDropdownOpen(false);
    if (role === 'candidate') router.push('/candidate/dashboard');
    else if (role === 'employer') router.push('/employer/dashboard');
    else if (role === 'agency') router.push('/agency/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
  };

  return (
    <>
      <Head>
        <title>Discover Industrial Jobs • UdyogSetu Chakan MIDC</title>
      </Head>

      {/* MAIN DISCOVERY INTERFACE (Left Filter Panel + Results Area) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
            
            {/* 3. LEFT FILTER PANEL */}
            <aside
              className={`lg:col-span-3 border-r border-neutral-100 bg-[#FAFAFA]/50 p-6 space-y-7 ${
                mobileFilterOpen
                  ? 'fixed inset-0 z-50 bg-white overflow-y-auto block p-6'
                  : 'hidden lg:block'
              }`}
            >
              {/* Mobile Close Button */}
              {mobileFilterOpen && (
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 lg:hidden">
                  <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                    <Filter className="w-4 h-4 text-neutral-700" />
                    <span>Filter Industrial Jobs</span>
                  </div>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-neutral-500 hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Header with Clear Option */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/80">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Filter Jobs
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-3xs font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-2xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Section 1: Industrial Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-900">Industrial Location</h4>
                <div className="space-y-2 text-xs text-neutral-700 max-h-60 overflow-y-auto pr-1">
                  {CHAKAN_PILOT_LOCATIONS.map((cl) => {
                    const checked = selectedLocations.includes(cl.name);
                    return (
                      <label
                        key={cl.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleLocation(cl.name)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                        />
                        <span className={`truncate ${checked ? 'font-bold text-neutral-950' : ''}`}>
                          {cl.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Work Schedule / Shift */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h4 className="text-xs font-bold text-neutral-900">Work Schedule / Shift</h4>
                <div className="space-y-2 text-xs text-neutral-700">
                  {[
                    'Rotational 3-Shifts (A/B/C)',
                    'Day Shift Only',
                    'General Shift (8:30 AM - 5:00 PM)',
                  ].map((s) => {
                    const checked = selectedShifts.includes(s);
                    return (
                      <label
                        key={s}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleShift(s)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                        />
                        <span className={`truncate ${checked ? 'font-bold text-neutral-950' : ''}`}>
                          {s}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Monthly Salary */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h4 className="text-xs font-bold text-neutral-900">Monthly In-Hand Salary</h4>
                <div className="space-y-2 text-xs text-neutral-700">
                  {[
                    { label: 'All Salaries', val: 0 },
                    { label: '₹18,000+ per month', val: 18000 },
                    { label: '₹22,000+ per month', val: 22000 },
                    { label: '₹28,000+ per month', val: 28000 },
                    { label: '₹35,000+ per month', val: 35000 },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none"
                    >
                      <input
                        type="radio"
                        name="salaryGroup"
                        checked={minSalaryFilter === item.val}
                        onChange={() => setMinSalaryFilter(item.val)}
                        className="text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                      />
                      <span className={minSalaryFilter === item.val ? 'font-bold text-neutral-950' : ''}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: Employment Type */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h4 className="text-xs font-bold text-neutral-900">Employment Type</h4>
                <div className="space-y-2 text-xs text-neutral-700">
                  {[
                    'Permanent / On-Roll',
                    'Contractual (Fixed Term)',
                    'NEEM / NAPS Trainee',
                    'Apprentice',
                  ].map((t) => {
                    const checked = selectedEmploymentTypes.includes(t);
                    return (
                      <label
                        key={t}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEmploymentType(t)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                        />
                        <span className={`truncate ${checked ? 'font-bold text-neutral-950' : ''}`}>
                          {t}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 5: Qualification */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h4 className="text-xs font-bold text-neutral-900">Minimum Qualification</h4>
                <div className="space-y-2 text-xs text-neutral-700">
                  {[
                    '10th / 12th',
                    'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
                    'Diploma (Mechanical/Auto/Electrical)',
                    'B.E. / B.Tech (Mechanical/Prod)',
                  ].map((q) => {
                    const checked = selectedQualifications.includes(q);
                    return (
                      <label
                        key={q}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleQualification(q)}
                          className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                        />
                        <span className={`truncate ${checked ? 'font-bold text-neutral-950' : ''}`}>
                          {q.split('(')[0].trim()}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 6: Trust & Verification Checkboxes */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/60">
                <h4 className="text-xs font-bold text-neutral-900">Trust & Opportunities</h4>
                <div className="space-y-2 text-xs text-neutral-700">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                    />
                    <span className={verifiedOnly ? 'font-bold text-neutral-950' : ''}>
                      Direct Plant Verified Only
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none">
                    <input
                      type="checkbox"
                      checked={walkinOnly}
                      onChange={(e) => setWalkinOnly(e.target.checked)}
                      className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                    />
                    <span className={walkinOnly ? 'font-bold text-neutral-950' : ''}>
                      Walk-in Interviews Available
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-neutral-950 select-none">
                    <input
                      type="checkbox"
                      checked={fresherOnly}
                      onChange={(e) => setFresherOnly(e.target.checked)}
                      className="rounded text-neutral-900 focus:ring-neutral-900 w-3.5 h-3.5 accent-neutral-900"
                    />
                    <span className={fresherOnly ? 'font-bold text-neutral-950' : ''}>
                      Freshers Welcome
                    </span>
                  </label>
                </div>
              </div>

              {mobileFilterOpen && (
                <div className="pt-4 lg:hidden">
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-full bg-neutral-900 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    View {filteredJobs.length} Results
                  </button>
                </div>
              )}
            </aside>

            {/* 4. SPACIOUS RESULTS AREA */}
            <main className="lg:col-span-9 p-5 sm:p-7 space-y-6">
              
              {/* Prominent Search Field + Mobile Filter Trigger */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search jobs by title, company, machine, or skills (e.g. VMC Operator, Welder, Electrician)..."
                    className="w-full text-sm pl-11 pr-24 py-3 rounded-2xl bg-[#FAFAFA] border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5 transition-all shadow-2xs"
                  />
                  {keyword && (
                    <button
                      onClick={() => setKeyword('')}
                      className="absolute right-20 top-3 text-neutral-400 hover:text-neutral-600 text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="absolute right-2.5 top-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-colors"
                  >
                    Search
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3.5 py-3 rounded-2xl border border-neutral-200 bg-[#FAFAFA] hover:bg-white text-neutral-700 flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-2xs"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-neutral-900 text-white text-3xs flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Status Header: Count + Sorting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-500">
                <div>
                  Showing <span className="font-bold text-neutral-900">{filteredJobs.length}</span> verified industrial jobs in Chakan & Pune
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'fresh' | 'salary' | 'openings')}
                    className="bg-transparent font-bold text-neutral-900 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="fresh">Newest First</option>
                    <option value="salary">In-Hand Salary (High to Low)</option>
                    <option value="openings">Openings Count</option>
                  </select>
                </div>
              </div>

              {/* Removable Active-Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                  <span className="text-3xs font-bold uppercase tracking-wider text-neutral-400">
                    Active Filters:
                  </span>

                  {keyword && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                      <span>"{keyword}"</span>
                      <button onClick={() => setKeyword('')} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedLocations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                    >
                      <span>{loc}</span>
                      <button onClick={() => toggleLocation(loc)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedShifts.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                    >
                      <span>{s.split(' ')[0]}</span>
                      <button onClick={() => toggleShift(s)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {minSalaryFilter > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                      <span>₹{minSalaryFilter.toLocaleString('en-IN')}+ in-hand</span>
                      <button onClick={() => setMinSalaryFilter(0)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedEmploymentTypes.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                    >
                      <span>{t.split(' ')[0]}</span>
                      <button onClick={() => toggleEmploymentType(t)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedQualifications.map((q) => (
                    <span
                      key={q}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                    >
                      <span>{q.split('(')[0].trim()}</span>
                      <button onClick={() => toggleQualification(q)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {verifiedOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span>Direct Plants</span>
                      <button onClick={() => setVerifiedOnly(false)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {walkinOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                      <span>Walk-ins Only</span>
                      <button onClick={() => setWalkinOnly(false)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {fresherOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200">
                      <span>Freshers</span>
                      <button onClick={() => setFresherOnly(false)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-neutral-500 hover:text-black underline ml-1"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* 5. THREE-COLUMN JOB CARD GRID ON DESKTOP (1 per row on mobile) */}
              {filteredJobs.length === 0 ? (
                jobs.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-[#FAFAFA] rounded-3xl border border-dashed border-neutral-200 p-8">
                    <Factory className="w-10 h-10 text-neutral-400 mx-auto" />
                    <h3 className="text-base font-bold text-neutral-900">
                      New Industrial Vacancies Coming Soon
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Employers in Chakan MIDC, Bhosari, Talegaon, and Khed City are currently onboarding and publishing verified openings. Check back shortly or register for alerts.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <Link
                        href="/alerts"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Get Free WhatsApp Job Alerts</span>
                      </Link>
                      <Link
                        href="/employer/post-job"
                        className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Post an Industrial Vacancy</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3 bg-[#FAFAFA] rounded-3xl border border-dashed border-neutral-200">
                    <Search className="w-8 h-8 text-neutral-400 mx-auto" />
                    <h3 className="text-base font-bold text-neutral-900">
                      No Matching Industrial Vacancies
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Try removing some of your selected location or shift filters to see more results across Chakan.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 hover:bg-black transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredJobs.map((job, idx) => (
                    <JobCard key={job.id} job={job} index={idx} />
                  ))}
                </div>
              )}

              {/* Production Trust Footer Note */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-3xs text-neutral-500">
                <span>UdyogSetu verifies participating employers across Chakan, Bhosari, Talegaon, and Khed City. 100% free for candidates.</span>
                <span className="font-semibold text-emerald-700">Zero Candidate Fee Guaranteed</span>
              </div>
            </main>
          </div>
    </>
  );
}
