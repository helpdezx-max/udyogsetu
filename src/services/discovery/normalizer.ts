import { RawDiscoveredJob, NormalizedDiscoveredJob } from './types';

interface TradeDefinition {
  standardTrade: string;
  category: string;
  keywords: string[];
}

const INDUSTRIAL_TRADES: TradeDefinition[] = [
  {
    standardTrade: 'VMC Machine Operator',
    category: 'Machine Operations & CNC',
    keywords: ['vmc', 'vmc operator', 'व्हीएमसी', 'vertical machining']
  },
  {
    standardTrade: 'CNC Machine Operator',
    category: 'Machine Operations & CNC',
    keywords: ['cnc', 'cnc operator', 'सीएनसी', 'cnc lathe', 'turning', 'turner']
  },
  {
    standardTrade: 'MIG / CO2 Welder',
    category: 'Welding & Fabrication',
    keywords: ['mig', 'co2 welder', 'वेल्डर', 'विल्डर', 'welder', 'arc welder', 'tig welder', 'fabricator']
  },
  {
    standardTrade: 'Maintenance Electrician',
    category: 'Electrical & Maintenance',
    keywords: ['electrician', 'wireman', 'इलेक्ट्रीशियन', 'electrical maintenance', 'plc maintenance']
  },
  {
    standardTrade: 'Mechanical Fitter',
    category: 'Assembly & Mechanical',
    keywords: ['fitter', 'फिटर', 'bench fitter', 'assembly fitter', 'maintenance fitter']
  },
  {
    standardTrade: 'Quality Inspector',
    category: 'Quality Assurance & Metrology',
    keywords: ['quality inspector', 'qc inspector', 'qa inspector', 'cmm', 'vernier', 'micrometer', 'तपासणीस', 'quality control']
  },
  {
    standardTrade: 'Production Assembly Operator',
    category: 'Production & Assembly',
    keywords: ['assembly operator', 'production operator', 'line operator', 'ऑपरेटर', 'assembly', 'असेंब्ली']
  },
  {
    standardTrade: 'Tool & Die Maker',
    category: 'Tool Room & Press Shop',
    keywords: ['tool and die', 'tool & die', 'press tool', 'mold maker', 'मूस']
  },
  {
    standardTrade: 'Warehouse & Forklift Operator',
    category: 'Logistics & Warehousing',
    keywords: ['forklift', 'store keeper', 'warehouse', 'स्टोअर', 'गोदाम', 'material handler', 'dispatch']
  },
  {
    standardTrade: 'Industrial Trainee / Apprentice',
    category: 'Fresher & Apprenticeship',
    keywords: ['apprentice', 'trainee', 'प्रशिक्षणार्थी', 'fresher', 'neem', 'nats']
  }
];

interface ClusterDefinition {
  name: string;
  keywords: string[];
}

const CHAKAN_CLUSTERS: ClusterDefinition[] = [
  {
    name: 'Chakan MIDC Phase 2',
    keywords: ['phase 2', 'phase ii', 'फेज २', 'phase-2', 'tathawade-chakan']
  },
  {
    name: 'Chakan MIDC Phase 1',
    keywords: ['phase 1', 'phase i', 'फेज १', 'phase-1']
  },
  {
    name: 'Chakan MIDC Phase 3',
    keywords: ['phase 3', 'phase iii', 'फेज ३', 'phase-3']
  },
  {
    name: 'Chakan MIDC Phase 4',
    keywords: ['phase 4', 'phase iv', 'फेज ४', 'phase-4']
  },
  {
    name: 'Khed City & SEZ',
    keywords: ['khed city', 'khed', 'खेड', 'sez', 'special economic zone']
  },
  {
    name: 'Kuruli & Industrial Belt',
    keywords: ['kuruli', 'कुरुळी', 'kuruli midc']
  },
  {
    name: 'Mahalunge & Nighoje Belt',
    keywords: ['mahalunge', 'म्हाळुंगे', 'nighoje', 'निघोजे']
  },
  {
    name: 'Khalumbre & Vasuli',
    keywords: ['khalumbre', 'खळुंब्रे', 'vasuli', 'वासुली']
  }
];

export function normalizeDiscoveredJob(raw: RawDiscoveredJob): NormalizedDiscoveredJob {
  const combinedText = `${raw.title} ${raw.description} ${raw.rawLocation || ''}`.toLowerCase();

  // 1. Identify Standard Trade & Industry Category
  let standardTrade = 'Production Assembly Operator';
  let industryCategory = 'Production & Assembly';

  for (const trade of INDUSTRIAL_TRADES) {
    if (trade.keywords.some(kw => combinedText.includes(kw))) {
      standardTrade = trade.standardTrade;
      industryCategory = trade.category;
      break;
    }
  }

  // 2. Identify Industrial Cluster
  let cluster = 'Chakan MIDC Phase 1';
  for (const cl of CHAKAN_CLUSTERS) {
    if (cl.keywords.some(kw => combinedText.includes(kw))) {
      cluster = cl.name;
      break;
    }
  }

  // 3. Parse Salary
  let monthlySalaryMin: number | undefined;
  let monthlySalaryMax: number | undefined;

  const rawSalaryStr = (raw.rawSalary || combinedText).replace(/,/g, '');

  // Case A: Check for LPA (e.g. 2.4 LPA - 3.6 LPA)
  const lpaMatch = /(\d+(?:\.\d+)?)\s*(?:lpa|lac|lakh)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*(?:lpa|lac|lakh)?/i.exec(rawSalaryStr);
  if (lpaMatch && lpaMatch[1]) {
    const minLpa = parseFloat(lpaMatch[1]);
    const maxLpa = lpaMatch[2] ? parseFloat(lpaMatch[2]) : minLpa;
    monthlySalaryMin = Math.round((minLpa * 100000) / 12);
    monthlySalaryMax = Math.round((maxLpa * 100000) / 12);
  } else {
    // Case B: Monthly salary range (e.g. 18000 - 24000)
    const rangeMatch = /(?:rs\.?|inr)?\s*(\d{4,6})\s*(?:-|to|\/)\s*(\d{4,6})/i.exec(rawSalaryStr);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      monthlySalaryMin = parseInt(rangeMatch[1], 10);
      monthlySalaryMax = parseInt(rangeMatch[2], 10);
    } else {
      const singleMatch = /(?:rs\.?|inr)?\s*(\d{4,6})/i.exec(rawSalaryStr);
      if (singleMatch && singleMatch[1]) {
        monthlySalaryMin = parseInt(singleMatch[1], 10);
        monthlySalaryMax = monthlySalaryMin;
      }
    }
  }

  // 4. Identify Facilities & Shift
  const busProvided = /bus|pick\s*and\s*drop|pickup|वाहतूक|transport/i.test(combinedText);
  const canteenProvided = /canteen|कैन्टीन|food|जेवण|lunch|subsidized/i.test(combinedText);
  const overtimeOffered = /overtime|ot|ओव्हरटाईम/i.test(combinedText);
  const pfEsiIncluded = /pf|esi|पीएफ|ईएसआय|provident\s*fund/i.test(combinedText);

  let shiftType: 'morning' | 'evening' | 'night' | 'rotational' | 'general' = 'rotational';
  if (/rotational|रोटेशनल|day\/night/i.test(combinedText)) shiftType = 'rotational';
  else if (/general|जनरल/i.test(combinedText)) shiftType = 'general';
  else if (/night|नाईट/i.test(combinedText)) shiftType = 'night';
  else if (/morning|मॉर्निंग/i.test(combinedText)) shiftType = 'morning';

  // 5. Identify Minimum Education
  let educationMin: 'none' | '10th_pass' | '12th_pass' | 'iti' | 'diploma' | 'degree' = 'none';
  if (/be\b|b\.tech|degree|पदवी|engineer/i.test(combinedText)) educationMin = 'degree';
  else if (/diploma|डिप्लोमा/i.test(combinedText)) educationMin = 'diploma';
  else if (/iti\b|आयटीआय|machinist|fitter|welder/i.test(combinedText)) educationMin = 'iti';
  else if (/12th|बारावी|hsc/i.test(combinedText)) educationMin = '12th_pass';
  else if (/10th|दहावी|ssc/i.test(combinedText)) educationMin = '10th_pass';

  return {
    sourceId: raw.sourceId,
    sourceName: raw.sourceName,
    title: raw.title,
    standardTrade,
    companyName: raw.companyName,
    industryCategory,
    cluster,
    city: 'Pune',
    state: 'Maharashtra',
    monthlySalaryMin,
    monthlySalaryMax,
    inHandMonthlyEstimate: monthlySalaryMin,
    shiftType,
    experienceYearsMin: 0,
    educationMin,
    facilities: {
      busProvided,
      canteenProvided,
      overtimeOffered,
      pfEsiIncluded
    },
    openingsCount: 5,
    originalSourceUrl: raw.originalUrl,
    discoveredAt: new Date().toISOString(),
    description: raw.description
  };
}
