// CENTRALIZED DEMO DATASET — PHASE 1 FRONTEND DEMONSTRATION
// All records are fictional demonstration data engineered for Pune's industrial belt
// (Chakan MIDC, Khed City, Kuruli, Nighoje, Mahalunge, Khalumbre, Vasuli, etc.)

export interface IndustrialCluster {
  id: string;
  name: string;
  pincode: string;
  zone: string;
  landmark: string;
  transitAccess: string;
  activeCompaniesCount: number;
  openJobsCount: number;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  clusterId: string;
  clusterName: string;
  specificAddress: string;
  industry: 'Automotive OEM' | 'Auto Components Tier-1' | 'Heavy Engineering' | 'Precision Machining' | 'Press & Stamping' | 'Logistics & Warehousing' | 'Packaging & Polymer' | 'Electronics & Electricals';
  employeeBand: '50-200' | '200-500' | '500-1500' | '1500+';
  directEmployer: boolean; // true = Factory direct HR, false = Recruitment Contractor / Agency
  verificationStatus: 'verified' | 'pending' | 'rejected';
  udyamRegistrationNo?: string;
  gstin?: string;
  factoryLicenseNo?: string;
  verificationAuditDate?: string;
  establishedYear: number;
  description: string;
  facilities: string[]; // e.g. "Subsidized Canteen", "Bus Pick & Drop (Pune-Chakan)", "ESI Hospital tie-up"
  logoPlaceholderBg: string;
  logoLetter: string;
  contactEmail: string;
  contactPhone: string;
  openVacanciesCount: number;
}

export interface SalaryBreakdown {
  inHandMonthly: number;
  grossMonthly: number;
  pfDeductionMonthly: number;
  esicCovered: boolean;
  otHourlyRate?: number; // Overtime rate per hour
  attendanceBonusMonthly?: number;
  canteenDeductionMonthly?: number;
}

export interface JobVacancy {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  clusterName: string;
  specificLocation: string;
  industry: string;
  category: 'Machining & CNC' | 'Assembly & Line' | 'Welding & Fabrication' | 'Quality Control & CMM' | 'Maintenance & Electrical' | 'Tool & Die' | 'Warehouse & Logistics' | 'Production & Planning' | 'Industrial Safety & EHS';
  employmentType: 'Permanent / On-Roll' | 'Contractual (Fixed Term)' | 'NEEM / NAPS Trainee' | 'Apprentice';
  qualificationRequired: '10th / 12th' | 'ITI (Fitter/Machinist/Turner/Welder/Electrician)' | 'Diploma (Mechanical/Auto/Electrical)' | 'B.E. / B.Tech (Mechanical/Prod)' | 'Any Graduate';
  experienceRequired: 'Freshers Welcome' | '6m - 1 Year' | '1 - 3 Years' | '3 - 5 Years' | '5+ Years';
  shiftType: 'Rotational 3-Shifts (A/B/C)' | 'Day Shift Only' | 'General Shift (8:30 AM - 5:00 PM)' | '12-Hour Continuous';
  openingsCount: number;
  salary: SalaryBreakdown;
  busFacilityProvided: boolean;
  busRoutes?: string[]; // e.g. ["Bhosari - Moshi - Chakan", "Nigdi - Talwade - Mahalunge"]
  canteenProvided: boolean;
  accommodationHelp: boolean;
  walkInAvailable: boolean;
  walkInDetails?: {
    interviewDates: string;
    reportingTime: string;
    venue: string;
    contactPerson: string;
    documentsToCarry: string[];
  };
  recruitmentTier: 'verified_direct' | 'verified_agency' | 'verification_pending';
  agencyName?: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  genderPreference: 'All Eligible' | 'Male' | 'Female' | 'Female Preferred for Assembly';
  postedDaysAgo: number;
  lastConfirmedDate: string;
  deadlineDate: string;
  status: 'active' | 'under_moderation' | 'closed';
}

export interface WalkInEvent {
  id: string;
  jobId: string;
  companyName: string;
  jobTitle: string;
  clusterName: string;
  venueAddress: string;
  eventDates: string;
  reportingTime: string;
  openingsCount: number;
  eligibility: string;
  salaryDisplay: string;
  contactPerson: string;
  contactPhone: string;
  verifiedDrive: boolean;
  documents: string[];
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  currentResidence: string; // e.g. "Chakan Ambethan Chowk", "Bhosari Gaon", "Rajgurunagar"
  highestQualification: string;
  tradeSpecialization?: string;
  totalExperienceMonths: number;
  currentDesignation: string;
  preferredShifts: string[];
  preferredClusters: string[];
  expectedSalaryInHand: number;
  resumeFileName?: string;
  profileCompletionPercentage: number;
  readyToJoinDays: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  clusterName: string;
  appliedDate: string;
  currentStatus: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Joined' | 'Rejected';
  interviewScheduledDate?: string;
  interviewVenue?: string;
  interviewerNotes?: string;
  salaryOffered?: string;
  candidateNotes?: string;
}

export interface ModerationReport {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  reportedBy: string;
  reason: 'Fake Salary' | 'Demanded Money for Job' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location';
  reportedDate: string;
  status: 'pending' | 'resolved' | 'dismissed';
  details: string;
}

export interface EmployerVerificationRequest {
  id: string;
  companyId: string;
  companyName: string;
  clusterName: string;
  submittedDate: string;
  documentsSubmitted: {
    gstinCert: string;
    udyamCert: string;
    midcAllotmentLetter: string;
    factoryLicense: string;
  };
  contactPerson: string;
  contactPhone: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}

// ----------------------------------------------------
// 1. INDUSTRIAL CLUSTERS (8 Key Pune/Chakan Hubs)
// ----------------------------------------------------
export const INDUSTRIAL_CLUSTERS: IndustrialCluster[] = [
  {
    id: 'chakan-phase-1',
    name: 'Chakan MIDC Phase 1',
    pincode: '410501',
    zone: 'Talegaon-Chakan Expressway',
    landmark: 'Near Volkswagen India & Bajaj Auto Plant',
    transitAccess: 'Direct PMPML Bus from Bhosari / Nigdi depot',
    activeCompaniesCount: 142,
    openJobsCount: 480,
    description: 'Premier automotive manufacturing corridor housing global OEMs, robotic body shops, and Tier-1 press units.',
  },
  {
    id: 'chakan-phase-2',
    name: 'Chakan MIDC Phase 2',
    pincode: '410501',
    zone: 'Sawaswadi / Bhamboli Sector',
    landmark: 'Near Hyundai Construction & Mahindra Plant',
    transitAccess: 'Frequent shared transit from Ambethan Chowk',
    activeCompaniesCount: 98,
    openJobsCount: 310,
    description: 'Specialized in precision CNC turning, powder coating, heavy fabrication, and industrial stamping plants.',
  },
  {
    id: 'chakan-phase-3',
    name: 'Chakan MIDC Phase 3',
    pincode: '410501',
    zone: 'Kharabwadi Hub',
    landmark: 'Behind Mercedes-Benz Industrial Complex',
    transitAccess: 'Connecting Chakan-Talegaon Link Road',
    activeCompaniesCount: 115,
    openJobsCount: 395,
    description: 'Home to luxury auto component sub-assemblies, tool & die rooms, and automated warehouse parks.',
  },
  {
    id: 'chakan-phase-4',
    name: 'Chakan MIDC Phase 4',
    pincode: '410501',
    zone: 'Nighoje Expansion Sector',
    landmark: 'Near Bridgestone & Minda Corp',
    transitAccess: 'Shuttle buses via Talwade & Dehu Road',
    activeCompaniesCount: 76,
    openJobsCount: 240,
    description: 'High-growth sector featuring EV powertrain fabrication, tire manufacturing, and high-volume press lines.',
  },
  {
    id: 'khed-city',
    name: 'Kanersar / Khed City SEZ',
    pincode: '410505',
    zone: 'Khed-Rajgurunagar Corridor',
    landmark: 'Bharat Forge Khed City Industrial Zone',
    transitAccess: 'Dedicated factory shuttles from Pune Station & Chakan',
    activeCompaniesCount: 64,
    openJobsCount: 220,
    description: 'State-of-the-art integrated industrial city with European MNC machinery units and aerospace grade fabrication.',
  },
  {
    id: 'mahalunge-ingale',
    name: 'Mahalunge Ingale',
    pincode: '410501',
    zone: 'Chakan-Talegaon MIDC Border',
    landmark: 'Near IndoSpace Industrial Logistics Park',
    transitAccess: 'Accessible via Chakan-Talegaon State Highway',
    activeCompaniesCount: 88,
    openJobsCount: 290,
    description: 'Critical hub for modern supply-chain warehousing, third-party logistics (3PL), and auto suspension units.',
  },
  {
    id: 'kuruli',
    name: 'Kuruli Industrial Belt',
    pincode: '412105',
    zone: 'Alandi-Chakan Road',
    landmark: 'Near Kuruli Toll Plaza & Alandi Phata',
    transitAccess: 'PMPML Route from Pune Swargate & Bhosari',
    activeCompaniesCount: 52,
    openJobsCount: 175,
    description: 'Predominantly small-to-medium precision machine shops, heat treatment facilities, and wire harness assembly.',
  },
  {
    id: 'khalumbre-vasuli',
    name: 'Khalumbre - Vasuli Belt',
    pincode: '410501',
    zone: 'Chakan Outer Industrial Ring',
    landmark: 'Near Lumax Industries & Varroc Complex',
    transitAccess: 'Shared transport from Chakan Manchar junction',
    activeCompaniesCount: 45,
    openJobsCount: 160,
    description: 'Fast-expanding clusters specialized in injection molding, automotive plastic trims, and press tools.',
  },
];

// ----------------------------------------------------
// 2. SAMPLE COMPANIES (16 Industrial Units)
// ----------------------------------------------------
export const SAMPLE_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Sahyadri Precision Auto-Tech Ltd.',
    slug: 'sahyadri-precision-autotech',
    clusterId: 'chakan-phase-1',
    clusterName: 'Chakan MIDC Phase 1',
    specificAddress: 'Plot No. C-14, Phase 1, MIDC Chakan, Opp. Bajaj Auto Gate 3',
    industry: 'Auto Components Tier-1',
    employeeBand: '500-1500',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0048192',
    gstin: '27AABCS8891J1ZP',
    factoryLicenseNo: 'PUN-IND-FAC-88912',
    verificationAuditDate: '12-Oct-2026',
    establishedYear: 2008,
    description: 'Tier-1 manufacturer of engine transmission shafts, gears, and precision machined housings for commercial vehicles.',
    facilities: ['Subsidized Canteen (₹15/thali)', 'Company Bus (Bhosari, Nigdi, Moshi)', 'ESI & Mediclaim Insurance', 'Overtime Double Rate'],
    logoPlaceholderBg: 'bg-blue-700',
    logoLetter: 'S',
    contactEmail: 'hr@sahyadripolymers.demo',
    contactPhone: '+91 2135 278100',
    openVacanciesCount: 6,
  },
  {
    id: 'comp-2',
    name: 'MahaForging & Heavy Engineering Pvt. Ltd.',
    slug: 'mahaforging-heavy-eng',
    clusterId: 'khed-city',
    clusterName: 'Kanersar / Khed City SEZ',
    specificAddress: 'Plot E-21, Khed City Industrial Park, Kanersar, Pune',
    industry: 'Heavy Engineering',
    employeeBand: '200-500',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0031120',
    gstin: '27AABCM4512K1ZQ',
    factoryLicenseNo: 'PUN-IND-FAC-45129',
    verificationAuditDate: '28-Sep-2026',
    establishedYear: 2012,
    description: 'Specializes in open-die and closed-die steel forgings for agricultural machinery and rail freight transport.',
    facilities: ['Free Canteen for 12hr shifts', 'Staff Bus from Chakan Ambethan', 'Safety Kit & Boots provided', 'Attendance Award (₹1500)'],
    logoPlaceholderBg: 'bg-amber-700',
    logoLetter: 'M',
    contactEmail: 'careers@mahaforging.demo',
    contactPhone: '+91 2135 291400',
    openVacanciesCount: 4,
  },
  {
    id: 'comp-3',
    name: 'Indo-German Tool & Pressings Corp.',
    slug: 'indo-german-tool-pressings',
    clusterId: 'chakan-phase-2',
    clusterName: 'Chakan MIDC Phase 2',
    specificAddress: 'Plot B-45, Sawaswadi Road, MIDC Phase 2, Chakan',
    industry: 'Press & Stamping',
    employeeBand: '200-500',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0091823',
    gstin: '27AABCI9921M1ZX',
    factoryLicenseNo: 'PUN-IND-FAC-99210',
    verificationAuditDate: '04-Nov-2026',
    establishedYear: 2015,
    description: 'High-speed automated 400T to 1200T press lines producing chassis sheet metal parts and automotive pillars.',
    facilities: ['PF & ESIC On-time deposit', 'Subsidized Canteen', 'Free Locker & Shower facility', 'Yearly Safety Bonus'],
    logoPlaceholderBg: 'bg-emerald-700',
    logoLetter: 'I',
    contactEmail: 'recruitment@indogermantools.demo',
    contactPhone: '+91 2135 289911',
    openVacanciesCount: 5,
  },
  {
    id: 'comp-4',
    name: 'Khed Dynamics Powertrain Assemblies',
    slug: 'khed-dynamics-powertrain',
    clusterId: 'khed-city',
    clusterName: 'Kanersar / Khed City SEZ',
    specificAddress: 'Zone B, Sector 3, Khed City SEZ, Nimgaon, Pune',
    industry: 'Automotive OEM',
    employeeBand: '1500+',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0012984',
    gstin: '27AABCK1123P1ZL',
    factoryLicenseNo: 'PUN-IND-FAC-11234',
    verificationAuditDate: '15-Oct-2026',
    establishedYear: 2017,
    description: 'Pioneering electric two-wheeler and commercial EV battery pack and motor assembly plant.',
    facilities: ['Air-Conditioned Assembly Line', 'Double OT Payments', 'Comprehensive Medical Insurance', 'Pick-up from Bhosari & Chakan'],
    logoPlaceholderBg: 'bg-cyan-700',
    logoLetter: 'K',
    contactEmail: 'talent@kheddynamics.demo',
    contactPhone: '+91 2135 299000',
    openVacanciesCount: 7,
  },
  {
    id: 'comp-5',
    name: 'Pragati Manpower Services & Contractors',
    slug: 'pragati-manpower-services',
    clusterId: 'chakan-phase-1',
    clusterName: 'Chakan MIDC Phase 1',
    specificAddress: 'Talegaon Chowk, Opp. State Bank, Chakan 410501',
    industry: 'Logistics & Warehousing',
    employeeBand: '500-1500',
    directEmployer: false, // RECRUITMENT AGENCY / CONTRACTOR
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0067412',
    gstin: '27AABCP3314L1ZS',
    factoryLicenseNo: 'LAB-CON-REG-2024-81',
    verificationAuditDate: '01-Nov-2026',
    establishedYear: 2011,
    description: 'Licensed industrial labor contractor and workforce vendor supplying ITI technicians, loading crews, and machine operators across 20+ plants.',
    facilities: ['PF/ESIC passbook guarantee', 'Weekly cash advances permitted', 'Free accommodation assistance in Chakan'],
    logoPlaceholderBg: 'bg-indigo-700',
    logoLetter: 'P',
    contactEmail: 'chakan@pragatimanpower.demo',
    contactPhone: '+91 98220 11920',
    openVacanciesCount: 8,
  },
  {
    id: 'comp-6',
    name: 'Nighoje Precision CNC Machining Works',
    slug: 'nighoje-precision-cnc',
    clusterId: 'chakan-phase-4',
    clusterName: 'Chakan MIDC Phase 4',
    specificAddress: 'Gat No. 182, Nighoje Road, Tal. Khed, Dist. Pune',
    industry: 'Precision Machining',
    employeeBand: '50-200',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0081290',
    gstin: '27AABCN8812D1ZR',
    factoryLicenseNo: 'PUN-IND-FAC-88124',
    verificationAuditDate: '20-Oct-2026',
    establishedYear: 2019,
    description: 'Equipped with 24 CNC and VMC Fanuc-controlled machining centres supplying hydraulic valve blocks.',
    facilities: ['Clean Workshop Floor', 'Performance Incentive up to ₹3,000/mo', 'Canteen Tea & Snacks'],
    logoPlaceholderBg: 'bg-slate-700',
    logoLetter: 'N',
    contactEmail: 'works@nighojecnc.demo',
    contactPhone: '+91 2135 251122',
    openVacanciesCount: 3,
  },
  {
    id: 'comp-7',
    name: 'Mahalunge Warehousing & Freight Logistics',
    slug: 'mahalunge-logistics-park',
    clusterId: 'mahalunge-ingale',
    clusterName: 'Mahalunge Ingale',
    specificAddress: 'IndoSpace Logistics Park, Shed 4B, Mahalunge',
    industry: 'Logistics & Warehousing',
    employeeBand: '200-500',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0054819',
    gstin: '27AABCM6721R1ZW',
    factoryLicenseNo: 'PUN-IND-FAC-67215',
    verificationAuditDate: '05-Nov-2026',
    establishedYear: 2020,
    description: '300,000 sq.ft Grade-A fulfillment facility managing automotive spare distribution across Western India.',
    facilities: ['Battery Forklift operations only', 'Subsidized Food', 'Night Shift Allowance (₹100/night)', 'Safety Boots Free'],
    logoPlaceholderBg: 'bg-violet-700',
    logoLetter: 'M',
    contactEmail: 'operations@mahalungelogistics.demo',
    contactPhone: '+91 2135 277450',
    openVacanciesCount: 4,
  },
  {
    id: 'comp-8',
    name: 'Kuruli Electrical Harness & Controls',
    slug: 'kuruli-electrical-harness',
    clusterId: 'kuruli',
    clusterName: 'Kuruli Industrial Belt',
    specificAddress: 'Gat No. 89, Kuruli Phata, Alandi-Chakan Road',
    industry: 'Electronics & Electricals',
    employeeBand: '200-500',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0023419',
    gstin: '27AABCK4490T1ZY',
    factoryLicenseNo: 'PUN-IND-FAC-44901',
    verificationAuditDate: '18-Oct-2026',
    establishedYear: 2016,
    description: 'Manufacturing wiring harnesses, fuse boxes, and sensor relays for passenger vehicle instrument panels.',
    facilities: ['Female-friendly day shift lines', 'Clean ESD Controlled Floor', 'Subsidized Lunch & Breakfast', 'Maternity Benefits'],
    logoPlaceholderBg: 'bg-teal-700',
    logoLetter: 'K',
    contactEmail: 'hr@kurulielectricals.demo',
    contactPhone: '+91 2135 266120',
    openVacanciesCount: 4,
  },
  {
    id: 'comp-9',
    name: 'Vasuli Polymer & Injection Molding Ltd.',
    slug: 'vasuli-polymer-injection',
    clusterId: 'khalumbre-vasuli',
    clusterName: 'Khalumbre - Vasuli Belt',
    specificAddress: 'Plot 12, Vasuli Phata, Chakan-Talegaon Outer Road',
    industry: 'Packaging & Polymer',
    employeeBand: '50-200',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0077810',
    gstin: '27AABCV5512E1ZU',
    factoryLicenseNo: 'PUN-IND-FAC-55122',
    verificationAuditDate: '29-Oct-2026',
    establishedYear: 2014,
    description: 'Specialists in thermoplastic injection molding for automotive bumpers, dashboard trims, and industrial crates.',
    facilities: ['Free Uniform (2 sets)', 'Canteen (₹12/meal)', 'ESI cover from Day 1'],
    logoPlaceholderBg: 'bg-rose-700',
    logoLetter: 'V',
    contactEmail: 'admin@vasulipolymer.demo',
    contactPhone: '+91 2135 244510',
    openVacanciesCount: 3,
  },
  {
    id: 'comp-10',
    name: 'Apex Industrial Manpower Solutions',
    slug: 'apex-industrial-manpower',
    clusterId: 'chakan-phase-2',
    clusterName: 'Chakan MIDC Phase 2',
    specificAddress: 'Shree Complex, 2nd Floor, Ambethan Road, Chakan',
    industry: 'Automotive OEM',
    employeeBand: '500-1500',
    directEmployer: false, // CONTRACTOR
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0044199',
    gstin: '27AABCA7712Q1ZV',
    factoryLicenseNo: 'LAB-CON-REG-2023-44',
    verificationAuditDate: '10-Oct-2026',
    establishedYear: 2018,
    description: 'Staffing agency specializing in supplying welders, fitters, and line helpers to auto tier-1 units.',
    facilities: ['On-time monthly salary on 7th', 'ESIC registration assistance', 'Hostel accommodation available'],
    logoPlaceholderBg: 'bg-sky-700',
    logoLetter: 'A',
    contactEmail: 'desk@apexmanpower.demo',
    contactPhone: '+91 97654 33211',
    openVacanciesCount: 5,
  },
  {
    id: 'comp-11',
    name: 'Shivshambhu Heavy Fabricators',
    slug: 'shivshambhu-heavy-fabricators',
    clusterId: 'chakan-phase-3',
    clusterName: 'Chakan MIDC Phase 3',
    specificAddress: 'Plot D-19, Kharabwadi, Chakan Phase 3',
    industry: 'Heavy Engineering',
    employeeBand: '50-200',
    directEmployer: true,
    verificationStatus: 'pending', // PENDING VERIFICATION DEMO RECORD
    udyamRegistrationNo: 'UDYAM-MH-26-0099881',
    gstin: '27AABCS1900W1ZT',
    establishedYear: 2021,
    description: 'Structural steel fabrication and heavy crane boom welding. (Verification documents undergoing MIDC inspection).',
    facilities: ['Daily Tea & Snacks', 'Double OT'],
    logoPlaceholderBg: 'bg-orange-700',
    logoLetter: 'S',
    contactEmail: 'contact@shivshambhueng.demo',
    contactPhone: '+91 2135 233910',
    openVacanciesCount: 2,
  },
  {
    id: 'comp-12',
    name: 'Khalumbre Stamping Dies & Tooling',
    slug: 'khalumbre-stamping-dies',
    clusterId: 'khalumbre-vasuli',
    clusterName: 'Khalumbre - Vasuli Belt',
    specificAddress: 'Survey 44, Khalumbre Industrial Area',
    industry: 'Precision Machining',
    employeeBand: '50-200',
    directEmployer: true,
    verificationStatus: 'verified',
    udyamRegistrationNo: 'UDYAM-MH-26-0018821',
    gstin: '27AABCK8823J1ZX',
    factoryLicenseNo: 'PUN-IND-FAC-88231',
    verificationAuditDate: '22-Oct-2026',
    establishedYear: 2017,
    description: 'Precision tool & die design and manufacturing, wire EDM cutting, and surface grinding shop.',
    facilities: ['Subsidized Canteen', 'Yearly Skill Upgrade Course', 'Accident Insurance'],
    logoPlaceholderBg: 'bg-stone-700',
    logoLetter: 'K',
    contactEmail: 'hr@khalumbredies.demo',
    contactPhone: '+91 2135 288340',
    openVacanciesCount: 3,
  },
];

// ----------------------------------------------------
// 3. SAMPLE VACANCIES (32+ Detailed Industrial Jobs)
// ----------------------------------------------------
export const SAMPLE_JOBS: JobVacancy[] = [
  {
    id: 'job-101',
    title: 'VMC Machine Operator (Fanuc / Siemens Controls)',
    companyId: 'comp-1',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    clusterName: 'Chakan MIDC Phase 1',
    specificLocation: 'Plot No. C-14, Phase 1, Chakan',
    industry: 'Auto Components Tier-1',
    category: 'Machining & CNC',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    experienceRequired: '1 - 3 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 8,
    salary: {
      inHandMonthly: 19500,
      grossMonthly: 23200,
      pfDeductionMonthly: 1800,
      esicCovered: true,
      otHourlyRate: 110,
      attendanceBonusMonthly: 1500,
      canteenDeductionMonthly: 300,
    },
    busFacilityProvided: true,
    busRoutes: ['Bhosari - Dighi - Moshi - Chakan', 'Nigdi - Spine Road - Chakan'],
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Every Monday & Wednesday (16-Nov to 25-Nov 2026)',
      reportingTime: '09:30 AM to 01:00 PM',
      venue: 'Gate No. 2 HR Desk, Sahyadri Precision, C-14 Chakan Phase 1',
      contactPerson: 'Mr. Sunil Patil (HR Manager)',
      documentsToCarry: ['Updated Resume', 'ITI Marksheet (Original + Xerox)', 'Aadhar Card', '2 Passport Photos', 'Bank Passbook copy'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Looking for disciplined VMC operators to run 4-axis Vertical Machining Centres for engine casing components. Clean plant with automated coolant mist collection.',
    responsibilities: [
      'Operating VMC machines (Fanuc Oi-MD series) per production schedule',
      'Performing workpiece loading, hydraulic clamping, and tool offset check',
      'Periodic inspection using Vernier caliper, Micrometer, and Bore Gauge',
      'Maintaining daily production log and first-piece approval records',
    ],
    requiredSkills: ['Fanuc / Siemens CNC Controller', 'Precision Measurement (Micrometer/Dial)', 'Tool Offset Adjustment', 'Engineering Drawing Reading'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 1,
    lastConfirmedDate: '15-Nov-2026',
    deadlineDate: '30-Nov-2026',
    status: 'active',
  },
  {
    id: 'job-102',
    title: 'MIG / CO2 Welder (Automotive Chassis & Exhaust)',
    companyId: 'comp-3',
    companyName: 'Indo-German Tool & Pressings Corp.',
    clusterName: 'Chakan MIDC Phase 2',
    specificLocation: 'Plot B-45, Sawaswadi Road, MIDC Phase 2, Chakan',
    industry: 'Press & Stamping',
    category: 'Welding & Fabrication',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    experienceRequired: '1 - 3 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 12,
    salary: {
      inHandMonthly: 21000,
      grossMonthly: 24800,
      pfDeductionMonthly: 1950,
      esicCovered: true,
      otHourlyRate: 120,
      attendanceBonusMonthly: 2000,
      canteenDeductionMonthly: 250,
    },
    busFacilityProvided: true,
    busRoutes: ['Talegaon Station - Chakan Phata - MIDC Phase 2', 'Chakan Ambethan Chowk'],
    canteenProvided: true,
    accommodationHelp: true,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Daily (Mon to Fri)',
      reportingTime: '10:00 AM to 02:00 PM',
      venue: 'Indo-German Tool Plant B-45, Phase 2, Chakan',
      contactPerson: 'Mr. Rakesh Shinde (Plant HR)',
      documentsToCarry: ['ITI Welder Certificate', 'Aadhar Card', 'Safety Shoes (Mandatory for weld test)', 'Previous Company Relieving Letter'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Requires qualified MIG/MAG welders for automotive subframe welding jigs. Practical welding test on 3mm & 4mm MS sheet will be conducted on the day of walk-in.',
    responsibilities: [
      'Operating semi-automatic MIG/MAG welding machines on fixtures',
      'Ensuring continuous penetration without spatter or undercut',
      'Visual inspection of welded joints and weld bead uniformity',
      'Maintaining 5S at welding booth and adhering to heat safety protocols',
    ],
    requiredSkills: ['MIG / CO2 Welding 2G/3G', 'Fixturing & Clamping', 'Weld Bead Dressing', 'Industrial Safety'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 2,
    lastConfirmedDate: '14-Nov-2026',
    deadlineDate: '28-Nov-2026',
    status: 'active',
  },
  {
    id: 'job-103',
    title: 'Quality Inspector — Incoming & In-Process (CMM Knowledge)',
    companyId: 'comp-1',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    clusterName: 'Chakan MIDC Phase 1',
    specificLocation: 'Plot C-14, Phase 1, Chakan',
    industry: 'Auto Components Tier-1',
    category: 'Quality Control & CMM',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'Diploma (Mechanical/Auto/Electrical)',
    experienceRequired: '1 - 3 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 4,
    salary: {
      inHandMonthly: 23500,
      grossMonthly: 27500,
      pfDeductionMonthly: 2100,
      esicCovered: true,
      otHourlyRate: 130,
      attendanceBonusMonthly: 1500,
      canteenDeductionMonthly: 300,
    },
    busFacilityProvided: true,
    busRoutes: ['Bhosari - Dighi - Moshi - Chakan'],
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: false,
    recruitmentTier: 'verified_direct',
    description: 'Quality assurance team expansion for machined automotive castings. Candidate will operate Height Masters, Surface Roughness Testers, and prepare inspection reports.',
    responsibilities: [
      'Dimensional checking of machined casings against CAD drawings',
      'Conducting hourly in-process inspection and SPC chart recording',
      'Managing red bin rejection scrap and tagging rework items',
      'Assisting Quality Head in internal audit preparations',
    ],
    requiredSkills: ['CMM Basic Operation', 'Vernier & Height Master', 'GD&T Drawing Symbols', 'PPAP / SPC Basics'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 3,
    lastConfirmedDate: '13-Nov-2026',
    deadlineDate: '05-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-104',
    title: 'Electric Two-Wheeler Assembly Technician',
    companyId: 'comp-4',
    companyName: 'Khed Dynamics Powertrain Assemblies',
    clusterName: 'Kanersar / Khed City SEZ',
    specificLocation: 'Zone B, Sector 3, Khed City SEZ',
    industry: 'Automotive OEM',
    category: 'Assembly & Line',
    employmentType: 'Contractual (Fixed Term)',
    qualificationRequired: '10th / 12th',
    experienceRequired: 'Freshers Welcome',
    shiftType: 'Day Shift Only',
    openingsCount: 25,
    salary: {
      inHandMonthly: 17200,
      grossMonthly: 20100,
      pfDeductionMonthly: 1600,
      esicCovered: true,
      otHourlyRate: 95,
      attendanceBonusMonthly: 1200,
      canteenDeductionMonthly: 200,
    },
    busFacilityProvided: true,
    busRoutes: ['Chakan Ambethan - Rajgurunagar - Khed City', 'Bhosari - Alandi - Khed City'],
    canteenProvided: true,
    accommodationHelp: true,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Thursday & Friday (19-Nov & 20-Nov 2026)',
      reportingTime: '08:30 AM to 11:30 AM',
      venue: 'Main Security Block, Khed Dynamics, Khed City SEZ',
      contactPerson: 'Mr. Vishal Jadhav',
      documentsToCarry: ['10th/12th Passing Certificate', 'Aadhar Card', 'Police Verification clearance slip if available'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Great opportunity for energetic freshers to join a modern EV assembly line. Hands-on training provided with pneumatic torque wrenches and wire harness routing.',
    responsibilities: [
      'Assembling mechanical chassis, wheel hubs, and brake lines',
      'Routing electrical wiring harnesses with specified torque limits',
      'Pre-dispatch visual inspection on rolling test bench',
      'Keeping work station tidy in accordance with 5S standards',
    ],
    requiredSkills: ['Pneumatic Torque Tools', 'Attention to Detail', 'Physical Stamina', 'Team Player'],
    genderPreference: 'Female Preferred for Assembly',
    postedDaysAgo: 1,
    lastConfirmedDate: '15-Nov-2026',
    deadlineDate: '26-Nov-2026',
    status: 'active',
  },
  {
    id: 'job-105',
    title: 'Forklift Operator (Reach Truck / Counterbalance)',
    companyId: 'comp-7',
    companyName: 'Mahalunge Warehousing & Freight Logistics',
    clusterName: 'Mahalunge Ingale',
    specificLocation: 'IndoSpace Logistics Park, Shed 4B, Mahalunge',
    industry: 'Logistics & Warehousing',
    category: 'Warehouse & Logistics',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: '10th / 12th',
    experienceRequired: '1 - 3 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 6,
    salary: {
      inHandMonthly: 18500,
      grossMonthly: 22000,
      pfDeductionMonthly: 1750,
      esicCovered: true,
      otHourlyRate: 105,
      attendanceBonusMonthly: 1500,
      canteenDeductionMonthly: 250,
    },
    busFacilityProvided: false,
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Saturday 21-Nov 2026',
      reportingTime: '10:00 AM to 03:00 PM',
      venue: 'IndoSpace Gate 4, Mahalunge Ingale',
      contactPerson: 'Mr. Arvind Gaikwad (Warehouse Incharge)',
      documentsToCarry: ['Valid Driving License (Heavy / Transport / Forklift certified)', 'Aadhar Card', 'Resume'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Requires certified and skilled forklift drivers to handle palletized auto cargo up to 9-meter racking heights safely in an ambient warehouse.',
    responsibilities: [
      'Operating electric reach trucks and 3-ton counterbalance forklifts',
      'Stacking and retrieving pallets from heavy-duty pallet racks',
      'Loading and unloading container trucks safely without pallet damage',
      'Performing daily pre-operational forklift checklist (hydraulic & battery)',
    ],
    requiredSkills: ['Valid Forklift Driving License', 'High-Rack Pallet Stacking', 'Warehouse Safety', 'Barcode Scanner Operation'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 2,
    lastConfirmedDate: '14-Nov-2026',
    deadlineDate: '01-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-106',
    title: 'Plant Maintenance Electrician & PLC Troubleshooter',
    companyId: 'comp-2',
    companyName: 'MahaForging & Heavy Engineering Pvt. Ltd.',
    clusterName: 'Kanersar / Khed City SEZ',
    specificLocation: 'Plot E-21, Khed City Industrial Park, Kanersar',
    industry: 'Heavy Engineering',
    category: 'Maintenance & Electrical',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'Diploma (Mechanical/Auto/Electrical)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 3,
    salary: {
      inHandMonthly: 28000,
      grossMonthly: 33500,
      pfDeductionMonthly: 2600,
      esicCovered: true,
      otHourlyRate: 160,
      attendanceBonusMonthly: 2000,
      canteenDeductionMonthly: 300,
    },
    busFacilityProvided: true,
    busRoutes: ['Chakan Ambethan - Khed City'],
    canteenProvided: true,
    accommodationHelp: true,
    walkInAvailable: false,
    recruitmentTier: 'verified_direct',
    description: 'Senior electrical role to support forging induction heaters, hydraulic power packs, and PLC electrical control panels. Wireman license preferred.',
    responsibilities: [
      'Preventive and breakdown maintenance of heavy forging induction furnaces',
      'Troubleshooting Siemens / Delta PLC ladder logic and AC/DC drive trips',
      'Overhauling 3-phase induction motors, contactors, and switchgear panels',
      'Ensuring compliance with statutory factory electrical safety guidelines',
    ],
    requiredSkills: ['PLC Ladder Logic Diagnostic', 'Industrial Electrical Wiring', 'AC/DC Drive Parameterization', 'High Voltage Safety'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 4,
    lastConfirmedDate: '12-Nov-2026',
    deadlineDate: '10-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-107',
    title: 'Press Shop Line Feeder & Die Clamper',
    companyId: 'comp-5', // Recruited via Pragati Manpower Contractor
    companyName: 'Pragati Manpower Services & Contractors',
    clusterName: 'Chakan MIDC Phase 1',
    specificLocation: 'Deploying at Tier-1 Plant in Chakan Phase 1',
    industry: 'Press & Stamping',
    category: 'Assembly & Line',
    employmentType: 'Contractual (Fixed Term)',
    qualificationRequired: '10th / 12th',
    experienceRequired: 'Freshers Welcome',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 20,
    salary: {
      inHandMonthly: 16800,
      grossMonthly: 19800,
      pfDeductionMonthly: 1600,
      esicCovered: true,
      otHourlyRate: 90,
      attendanceBonusMonthly: 1200,
      canteenDeductionMonthly: 250,
    },
    busFacilityProvided: true,
    busRoutes: ['Chakan Market - Phase 1 MIDC shuttle'],
    canteenProvided: true,
    accommodationHelp: true,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Open Every Day (Mon to Sat)',
      reportingTime: '09:00 AM to 05:00 PM',
      venue: 'Pragati Manpower Office, Talegaon Chowk, Opp SBI Chakan',
      contactPerson: 'Mr. Balasaheb Thorat',
      documentsToCarry: ['Aadhar Card', 'Bank Passbook (SBI/BOI/HDFC)', '4 Passport size photos'],
    },
    recruitmentTier: 'verified_agency',
    agencyName: 'Pragati Manpower Services (Govt. License Holder)',
    description: 'Contractual job opening for press shop helpers and line loaders. Immediate spot joining after safety induction. PF and ESIC deposited on 10th of every month.',
    responsibilities: [
      'Feeding blank steel sheets into pneumatic feeder guides',
      'Stacking stamped automotive parts onto dispatch trolleys',
      'Assisting die-makers in die setup and mechanical clamping',
      'Wearing mandatory PPE (Kevlar cut-resistant gloves and safety shoes)',
    ],
    requiredSkills: ['Physical Agility', 'Willingness for 3-Shift Rotation', 'Disciplined Attendance'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 1,
    lastConfirmedDate: '15-Nov-2026',
    deadlineDate: '25-Nov-2026',
    status: 'active',
  },
  {
    id: 'job-108',
    title: 'Plastic Injection Molding Machine Setter',
    companyId: 'comp-9',
    companyName: 'Vasuli Polymer & Injection Molding Ltd.',
    clusterName: 'Khalumbre - Vasuli Belt',
    specificLocation: 'Plot 12, Vasuli Phata, Chakan',
    industry: 'Packaging & Polymer',
    category: 'Machining & CNC',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 4,
    salary: {
      inHandMonthly: 24000,
      grossMonthly: 28500,
      pfDeductionMonthly: 2200,
      esicCovered: true,
      otHourlyRate: 135,
      attendanceBonusMonthly: 1800,
      canteenDeductionMonthly: 200,
    },
    busFacilityProvided: false,
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Tuesday & Thursday',
      reportingTime: '11:00 AM to 03:00 PM',
      venue: 'Vasuli Polymer Plant, Plot 12, Vasuli',
      contactPerson: 'Mr. Dilip Deshmukh',
      documentsToCarry: ['Experience Certificate from previous plastic plant', 'Aadhar Card', 'Resume'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Experienced molding setter needed for Engel & Toshiba 150T - 650T machines. Must understand mold temperature controllers, barrel heating zones, and defect troubleshooting (flash, short shot).',
    responsibilities: [
      'Mold changing, clamping, water line connection, and hot runner setup',
      'Setting injection pressure, holding time, and cooling cycles',
      'Analyzing and rectifying molding defects on automotive interior trim',
      'Supervising hopper loading and masterbatch blending ratio',
    ],
    requiredSkills: ['Injection Molding Parameter Setting', 'Mold Clamping & Water Lines', 'Defect Analysis', 'Raw Material (PP, ABS, Nylon) Knowledge'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 2,
    lastConfirmedDate: '14-Nov-2026',
    deadlineDate: '02-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-109',
    title: 'Tool & Die Maker (Press Tools & Progressive Dies)',
    companyId: 'comp-12',
    companyName: 'Khalumbre Stamping Dies & Tooling',
    clusterName: 'Khalumbre - Vasuli Belt',
    specificLocation: 'Survey 44, Khalumbre Industrial Area',
    industry: 'Precision Machining',
    category: 'Tool & Die',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'Diploma (Mechanical/Auto/Electrical)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'Day Shift Only',
    openingsCount: 2,
    salary: {
      inHandMonthly: 30000,
      grossMonthly: 36000,
      pfDeductionMonthly: 2800,
      esicCovered: false,
      otHourlyRate: 175,
      attendanceBonusMonthly: 2000,
      canteenDeductionMonthly: 300,
    },
    busFacilityProvided: false,
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: false,
    recruitmentTier: 'verified_direct',
    description: 'Precision toolroom opening for assembling and maintaining progressive stamping dies up to 2.5 meters. Surface grinding and bench fitting expertise mandatory.',
    responsibilities: [
      'Assembling, spotting, and tryout of progressive automotive stamping dies',
      'Conducting scheduled preventive die servicing and punch sharpening',
      'Operating precision surface grinders, radial drills, and hand lap stones',
      'Collaborating with design engineers on tool modification markups',
    ],
    requiredSkills: ['Progressive Die Assembly', 'Precision Surface Grinding', 'Die Spotting & Fitting', 'Die Clearance Calculation'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 3,
    lastConfirmedDate: '13-Nov-2026',
    deadlineDate: '15-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-110',
    title: 'Wire Harness Assembly Line Operator (Day Shift)',
    companyId: 'comp-8',
    companyName: 'Kuruli Electrical Harness & Controls',
    clusterName: 'Kuruli Industrial Belt',
    specificLocation: 'Gat No. 89, Kuruli Phata, Alandi-Chakan Road',
    industry: 'Electronics & Electricals',
    category: 'Assembly & Line',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: '10th / 12th',
    experienceRequired: 'Freshers Welcome',
    shiftType: 'Day Shift Only',
    openingsCount: 15,
    salary: {
      inHandMonthly: 16500,
      grossMonthly: 19500,
      pfDeductionMonthly: 1550,
      esicCovered: true,
      otHourlyRate: 90,
      attendanceBonusMonthly: 1000,
      canteenDeductionMonthly: 150,
    },
    busFacilityProvided: true,
    busRoutes: ['Alandi - Dighi - Kuruli', 'Chakan Ambethan - Kuruli'],
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Monday to Friday (10:00 AM - 01:00 PM)',
      reportingTime: '10:00 AM Sharp',
      venue: 'Kuruli Electrical Works, Gate 1, Kuruli Phata',
      contactPerson: 'Ms. Anita Bhosale (HR Executive)',
      documentsToCarry: ['10th/12th Marksheet', 'Aadhar Card', '2 Photos'],
    },
    recruitmentTier: 'verified_direct',
    description: 'Clean, light-duty bench assembly work assembling color-coded automotive wire harnesses on form boards. Female candidates encouraged to apply.',
    responsibilities: [
      'Routing wires per color chart on pegboards',
      'Inserting terminals into multi-pin plastic connectors until click lock',
      'Applying heat-shrink sleeves and protective corrugated conduit',
      'Testing electrical continuity using automated buzzer test fixtures',
    ],
    requiredSkills: ['Color Blindness Test Pass', 'Finger Dexterity', 'Patience & Quality Focus'],
    genderPreference: 'Female Preferred for Assembly',
    postedDaysAgo: 1,
    lastConfirmedDate: '15-Nov-2026',
    deadlineDate: '30-Nov-2026',
    status: 'active',
  },
  {
    id: 'job-111',
    title: 'Industrial Safety Officer (EHS & Factory Compliance)',
    companyId: 'comp-2',
    companyName: 'MahaForging & Heavy Engineering Pvt. Ltd.',
    clusterName: 'Kanersar / Khed City SEZ',
    specificLocation: 'Plot E-21, Khed City Industrial Park, Kanersar',
    industry: 'Heavy Engineering',
    category: 'Industrial Safety & EHS',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'Diploma (Mechanical/Auto/Electrical)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'General Shift (8:30 AM - 5:00 PM)',
    openingsCount: 1,
    salary: {
      inHandMonthly: 34000,
      grossMonthly: 41000,
      pfDeductionMonthly: 3200,
      esicCovered: false,
      attendanceBonusMonthly: 2500,
    },
    busFacilityProvided: true,
    busRoutes: ['Chakan - Khed City'],
    canteenProvided: true,
    accommodationHelp: true,
    walkInAvailable: false,
    recruitmentTier: 'verified_direct',
    description: 'Responsible for zero-incident safety management across forging hammer lines, heat treatment furnaces, and overhead crane operations.',
    responsibilities: [
      'Conducting daily plant safety toolbox talks and PPE audits',
      'Investigating near-miss incidents and deploying corrective CAPA measures',
      'Managing fire hydrant system inspections and mock drill schedules',
      'Ensuring statutory adherence to Maharashtra Factories Rules and DISH standards',
    ],
    requiredSkills: ['ADIS (Advanced Diploma in Industrial Safety)', 'Hazard Identification (HIRA)', 'Factory Act Compliance', 'First Aid Certification'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 4,
    lastConfirmedDate: '12-Nov-2026',
    deadlineDate: '15-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-112',
    title: 'CNC Turning Operator (2-Axis Fanuc Lathe)',
    companyId: 'comp-6',
    companyName: 'Nighoje Precision CNC Machining Works',
    clusterName: 'Chakan MIDC Phase 4',
    specificLocation: 'Gat No. 182, Nighoje Road, Tal. Khed',
    industry: 'Precision Machining',
    category: 'Machining & CNC',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    experienceRequired: '1 - 3 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 5,
    salary: {
      inHandMonthly: 19000,
      grossMonthly: 22600,
      pfDeductionMonthly: 1750,
      esicCovered: true,
      otHourlyRate: 110,
      attendanceBonusMonthly: 1500,
      canteenDeductionMonthly: 200,
    },
    busFacilityProvided: false,
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Every Wednesday & Friday',
      reportingTime: '10:00 AM to 02:00 PM',
      venue: 'Nighoje Precision Plant, Gat 182, Nighoje Road',
      contactPerson: 'Mr. Santosh Kadam',
      documentsToCarry: ['ITI Turner/Machinist Certificate', 'Aadhar Card', 'Previous salary slip or passbook'],
    },
    recruitmentTier: 'verified_direct',
    description: 'High-precision turning of hydraulic spool valves with tolerance of +/- 10 microns. Machine tool insert indexation and daily maintenance required.',
    responsibilities: [
      'Operating CNC Lathes (Lokesh & ACE Micromatic)',
      'Checking inner diameter and outer diameter with bore dials and micrometer',
      'Indexing carbide inserts and adjusting wear offsets',
      'Cleaning swarf chip conveyor and maintaining coolant concentration',
    ],
    requiredSkills: ['Fanuc CNC Turning', 'Precision Measuring Instruments', 'Insert Changing & Offsets', 'Blueprint Reading'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 2,
    lastConfirmedDate: '14-Nov-2026',
    deadlineDate: '01-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-113',
    title: 'Production Shift Incharge (Chassis Welding & Stamping)',
    companyId: 'comp-3',
    companyName: 'Indo-German Tool & Pressings Corp.',
    clusterName: 'Chakan MIDC Phase 2',
    specificLocation: 'Plot B-45, MIDC Phase 2, Chakan',
    industry: 'Press & Stamping',
    category: 'Production & Planning',
    employmentType: 'Permanent / On-Roll',
    qualificationRequired: 'B.E. / B.Tech (Mechanical/Prod)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'Rotational 3-Shifts (A/B/C)',
    openingsCount: 2,
    salary: {
      inHandMonthly: 38000,
      grossMonthly: 46000,
      pfDeductionMonthly: 3600,
      esicCovered: false,
      attendanceBonusMonthly: 3000,
    },
    busFacilityProvided: true,
    busRoutes: ['Talegaon - Chakan'],
    canteenProvided: true,
    accommodationHelp: false,
    walkInAvailable: false,
    recruitmentTier: 'verified_direct',
    description: 'Leading a shift of 35 operators and welders to hit daily production targets while minimizing OEE downtime and scrap generation.',
    responsibilities: [
      'Shift line balancing and manpower allocation at start of shift',
      'Resolving fixture jams and weld quality defects in real time',
      'Monitoring hourly production board against SAP targets',
      'Conducting shift handover meetings and logging machine downtime',
    ],
    requiredSkills: ['Shift Leadership', 'OEE & Downtime Tracking', '5S & Kaizen', 'ERP / SAP Production Entry'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 5,
    lastConfirmedDate: '11-Nov-2026',
    deadlineDate: '10-Dec-2026',
    status: 'active',
  },
  {
    id: 'job-114',
    title: 'Heavy Crane & Boiler Fabricator (TIG + ARC)',
    companyId: 'comp-11',
    companyName: 'Shivshambhu Heavy Fabricators',
    clusterName: 'Chakan MIDC Phase 3',
    specificLocation: 'Plot D-19, Kharabwadi, Chakan Phase 3',
    industry: 'Heavy Engineering',
    category: 'Welding & Fabrication',
    employmentType: 'Contractual (Fixed Term)',
    qualificationRequired: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    experienceRequired: '3 - 5 Years',
    shiftType: 'Day Shift Only',
    openingsCount: 4,
    salary: {
      inHandMonthly: 23000,
      grossMonthly: 26500,
      pfDeductionMonthly: 1900,
      esicCovered: true,
      otHourlyRate: 130,
      attendanceBonusMonthly: 1500,
    },
    busFacilityProvided: false,
    canteenProvided: false,
    accommodationHelp: true,
    walkInAvailable: true,
    walkInDetails: {
      interviewDates: 'Saturday 21-Nov 2026',
      reportingTime: '11:00 AM to 04:00 PM',
      venue: 'Shivshambhu Fabrication Yard, D-19 Kharabwadi',
      contactPerson: 'Mr. Pandurang More',
      documentsToCarry: ['ITI Certificate', 'Aadhar Card', 'Safety Shoes'],
    },
    recruitmentTier: 'verification_pending',
    description: 'Heavy plate cutting and submerged arc welding for crane beams and industrial pressure vessels. Company verification documents currently in review with MIDC authorities.',
    responsibilities: [
      'Fitting heavy plates from 12mm to 40mm thickness with bevel preparations',
      'Root pass TIG welding followed by ARC fill pass on structural steel',
      'Radiographic quality weld standard compliance',
      'Safe slinging and rigging with EOT overhead cranes',
    ],
    requiredSkills: ['Heavy Plate Fabrication', 'TIG / ARC 6G Qualified', 'Gas Cutting & Grinding', 'EOT Crane Rigging'],
    genderPreference: 'All Eligible',
    postedDaysAgo: 2,
    lastConfirmedDate: '14-Nov-2026',
    deadlineDate: '05-Dec-2026',
    status: 'active',
  },
];

// ----------------------------------------------------
// 4. WALK-IN INTERVIEW EVENTS (Today, Tomorrow, Weekend)
// ----------------------------------------------------
export const SAMPLE_WALKINS: WalkInEvent[] = [
  {
    id: 'walkin-1',
    jobId: 'job-101',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    jobTitle: 'VMC Machine Operator (Fanuc / Siemens Controls)',
    clusterName: 'Chakan MIDC Phase 1',
    venueAddress: 'Gate No. 2 HR Desk, Plot C-14, Phase 1, MIDC Chakan (Opp. Bajaj Auto Gate 3)',
    eventDates: 'Today & Tomorrow (16-Nov & 17-Nov 2026)',
    reportingTime: '09:30 AM – 01:00 PM',
    openingsCount: 8,
    eligibility: 'ITI Machinist / Turner with 1-3 yr shop experience. Freshers with good measurement skill considered.',
    salaryDisplay: '₹19,500 In-hand + OT + Bus Facility',
    contactPerson: 'Mr. Sunil Patil (HR Manager)',
    contactPhone: '+91 2135 278100',
    verifiedDrive: true,
    documents: ['Updated Resume', 'ITI Original + 2 Xerox', 'Aadhar Card', '2 Passport Photos', 'Bank Passbook copy'],
  },
  {
    id: 'walkin-2',
    jobId: 'job-102',
    companyName: 'Indo-German Tool & Pressings Corp.',
    jobTitle: 'MIG / CO2 Welder (Automotive Chassis)',
    clusterName: 'Chakan MIDC Phase 2',
    venueAddress: 'Plant Gate, Plot B-45, Sawaswadi Road, MIDC Phase 2, Chakan',
    eventDates: 'Tomorrow (17-Nov 2026)',
    reportingTime: '10:00 AM – 02:00 PM',
    openingsCount: 12,
    eligibility: 'ITI Welder. Live practical test on CO2 weld booth mandatory during interview.',
    salaryDisplay: '₹21,000 In-hand + Attendance Bonus ₹2000',
    contactPerson: 'Mr. Rakesh Shinde (Plant HR)',
    contactPhone: '+91 2135 289911',
    verifiedDrive: true,
    documents: ['ITI Certificate', 'Aadhar Card', 'Safety Shoes (Mandatory for entry)', 'Previous Service Letter'],
  },
  {
    id: 'walkin-3',
    jobId: 'job-104',
    companyName: 'Khed Dynamics Powertrain Assemblies',
    jobTitle: 'Electric Two-Wheeler Assembly Technician',
    clusterName: 'Kanersar / Khed City SEZ',
    venueAddress: 'Main Security Block, Zone B, Sector 3, Khed City SEZ, Nimgaon, Pune',
    eventDates: 'Upcoming Thursday (19-Nov 2026)',
    reportingTime: '08:30 AM – 11:30 AM',
    openingsCount: 25,
    eligibility: '10th / 12th / ITI. Freshers welcome. Age 18-28. Female candidates preferred for precision line.',
    salaryDisplay: '₹17,200 In-hand + Double OT + Subsidized Bus',
    contactPerson: 'Mr. Vishal Jadhav',
    contactPhone: '+91 2135 299000',
    verifiedDrive: true,
    documents: ['10th/12th Marksheet', 'Aadhar Card', 'Police Verification slip if available'],
  },
  {
    id: 'walkin-4',
    jobId: 'job-105',
    companyName: 'Mahalunge Warehousing & Freight Logistics',
    jobTitle: 'Forklift Operator (Reach Truck / Counterbalance)',
    clusterName: 'Mahalunge Ingale',
    venueAddress: 'IndoSpace Gate 4 Security, Mahalunge Ingale, Chakan-Talegaon Road',
    eventDates: 'Saturday Special Drive (21-Nov 2026)',
    reportingTime: '10:00 AM – 03:00 PM',
    openingsCount: 6,
    eligibility: 'Valid Forklift Driving License with 1+ year reach truck experience.',
    salaryDisplay: '₹18,500 In-hand + Night Allowance + Canteen',
    contactPerson: 'Mr. Arvind Gaikwad (Warehouse Incharge)',
    contactPhone: '+91 2135 277450',
    verifiedDrive: true,
    documents: ['Heavy / Forklift Driving License', 'Aadhar Card', 'Resume'],
  },
  {
    id: 'walkin-5',
    jobId: 'job-107',
    companyName: 'Pragati Manpower Services & Contractors',
    jobTitle: 'Press Shop Line Feeder & Die Clamper',
    clusterName: 'Chakan MIDC Phase 1',
    venueAddress: 'Pragati Manpower Recruitment Office, Talegaon Chowk, Opp SBI Chakan',
    eventDates: 'Ongoing Daily Drive (Mon to Sat)',
    reportingTime: '09:00 AM – 05:00 PM',
    openingsCount: 20,
    eligibility: '10th Pass. Spot joining for fit and energetic youth willing to work 3 shifts.',
    salaryDisplay: '₹16,800 In-hand + PF/ESIC + Room assistance',
    contactPerson: 'Mr. Balasaheb Thorat',
    contactPhone: '+91 98220 11920',
    verifiedDrive: true,
    documents: ['Aadhar Card', 'Bank Passbook', '4 Photos'],
  },
  {
    id: 'walkin-6',
    jobId: 'job-110',
    companyName: 'Kuruli Electrical Harness & Controls',
    jobTitle: 'Wire Harness Assembly Line Operator',
    clusterName: 'Kuruli Industrial Belt',
    venueAddress: 'Kuruli Electrical Works, Gate 1, Kuruli Phata, Alandi-Chakan Road',
    eventDates: 'Daily (Monday to Friday)',
    reportingTime: '10:00 AM – 01:00 PM',
    openingsCount: 15,
    eligibility: '10th/12th. Day shifts only. Female candidates encouraged.',
    salaryDisplay: '₹16,500 In-hand + Subsidized Meals + Free Uniform',
    contactPerson: 'Ms. Anita Bhosale',
    contactPhone: '+91 2135 266120',
    verifiedDrive: true,
    documents: ['10th/12th Marksheet', 'Aadhar Card', '2 Photos'],
  },
];

// ----------------------------------------------------
// 5. SAMPLE CANDIDATE PROFILE & APPLICATIONS
// ----------------------------------------------------
export const SAMPLE_CANDIDATE: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Mahesh Santosh Shinde',
  phone: '+91 98901 44521',
  email: 'mahesh.shinde98@demo.com',
  currentResidence: 'Ambethan Road, Chakan, Pune 410501',
  highestQualification: 'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
  tradeSpecialization: 'ITI Machinist (NCTV Passed 2022)',
  totalExperienceMonths: 28,
  currentDesignation: 'Junior VMC Machine Operator',
  preferredShifts: ['Rotational 3-Shifts (A/B/C)', 'Day Shift Only'],
  preferredClusters: ['Chakan MIDC Phase 1', 'Chakan MIDC Phase 2', 'Mahalunge Ingale'],
  expectedSalaryInHand: 22000,
  resumeFileName: 'Mahesh_Shinde_ITI_Machinist_Resume.pdf',
  profileCompletionPercentage: 85,
  readyToJoinDays: 7,
};

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-501',
    jobId: 'job-101',
    jobTitle: 'VMC Machine Operator (Fanuc / Siemens Controls)',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    clusterName: 'Chakan MIDC Phase 1',
    appliedDate: '12-Nov-2026',
    currentStatus: 'Interview Scheduled',
    interviewScheduledDate: '17-Nov-2026, 10:30 AM',
    interviewVenue: 'Plant HR Conference Hall, C-14 Chakan Phase 1',
    interviewerNotes: 'Profile matched experience requirement. Practical offset test on Fanuc scheduled.',
    salaryOffered: '₹19,500 In-hand + OT',
  },
  {
    id: 'app-502',
    jobId: 'job-112',
    jobTitle: 'CNC Turning Operator (2-Axis Fanuc Lathe)',
    companyName: 'Nighoje Precision CNC Machining Works',
    clusterName: 'Chakan MIDC Phase 4',
    appliedDate: '08-Nov-2026',
    currentStatus: 'Shortlisted',
    interviewerNotes: 'Shortlisted by production engineer. Waiting for batch interview scheduling.',
  },
  {
    id: 'app-503',
    jobId: 'job-103',
    jobTitle: 'Quality Inspector — Incoming & In-Process',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    clusterName: 'Chakan MIDC Phase 1',
    appliedDate: '02-Nov-2026',
    currentStatus: 'Under Review',
  },
];

// ----------------------------------------------------
// 6. EMPLOYER VERIFICATION QUEUE (Admin Moderation)
// ----------------------------------------------------
export const INITIAL_VERIFICATIONS: EmployerVerificationRequest[] = [
  {
    id: 'verif-901',
    companyId: 'comp-11',
    companyName: 'Shivshambhu Heavy Fabricators',
    clusterName: 'Chakan MIDC Phase 3',
    submittedDate: '10-Nov-2026',
    documentsSubmitted: {
      gstinCert: 'GSTIN_27AABCS1900W1ZT.pdf',
      udyamCert: 'UDYAM_MH_26_0099881.pdf',
      midcAllotmentLetter: 'MIDC_Plot_D19_Allotment.pdf',
      factoryLicense: 'Factory_License_Pending_Receipt.pdf',
    },
    contactPerson: 'Mr. Pandurang More (Proprietor)',
    contactPhone: '+91 2135 233910',
    status: 'pending',
  },
  {
    id: 'verif-902',
    companyId: 'comp-1',
    companyName: 'Sahyadri Precision Auto-Tech Ltd.',
    clusterName: 'Chakan MIDC Phase 1',
    submittedDate: '10-Oct-2026',
    documentsSubmitted: {
      gstinCert: 'GSTIN_Verified.pdf',
      udyamCert: 'Udyam_Verified.pdf',
      midcAllotmentLetter: 'Plot_C14_Registered.pdf',
      factoryLicense: 'DISH_License_2026.pdf',
    },
    contactPerson: 'Mr. Sunil Patil',
    contactPhone: '+91 2135 278100',
    status: 'verified',
  },
];

// ----------------------------------------------------
// 7. COMPLAINTS & JOB MODERATION REPORTS
// ----------------------------------------------------
export const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 'rep-301',
    jobId: 'job-114',
    jobTitle: 'Heavy Crane & Boiler Fabricator',
    companyName: 'Shivshambhu Heavy Fabricators',
    reportedBy: 'Kailash Jadhav (Job Seeker)',
    reason: 'Incorrect Location',
    reportedDate: '14-Nov-2026',
    status: 'pending',
    details: 'Candidate reported the shed is located 2 km deeper into Kharabwadi village than the road pin shows.',
  },
  {
    id: 'rep-302',
    jobId: 'job-107',
    jobTitle: 'Press Shop Line Feeder',
    companyName: 'Pragati Manpower Services',
    reportedBy: 'Ramesh Pawar (Job Seeker)',
    reason: 'Fake Salary',
    reportedDate: '09-Nov-2026',
    status: 'resolved',
    details: 'Clarification issued: Base in-hand is ₹16,800. ₹19,800 figure is gross inclusive of attendance incentive.',
  },
];
