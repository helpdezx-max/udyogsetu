// CHAKAN–KHED PILOT MARKET: 12 INDUSTRIAL LOCATIONS & TRANSIT DIRECTORY
// Standardized geographical master for Pune industrial corridor

export interface PilotLocation {
  id: string; // Slug (e.g. 'chakan-phase-1')
  name: string;
  marathiName: string;
  pincode: string;
  zone: string;
  keyIndustries: string[];
  landmark: string;
  transitAccess: string;
  pmpmlBusRoutes: string[];
  sharedTransitHubs: string[];
  activeCompaniesCount: number;
  openJobsCount: number;
  description: string;
  pilotPriority: 'high' | 'medium' | 'expansion';
  disclaimer: string;
}

export const CHAKAN_PILOT_LOCATIONS: PilotLocation[] = [
  {
    id: 'chakan-midc-main',
    name: 'Chakan MIDC Central',
    marathiName: 'चाकण एमआयडीसी मुख्य केंद्र',
    pincode: '410501',
    zone: 'Central Industrial Corridor',
    keyIndustries: ['Automotive OEM', 'Heavy Engineering', 'Auto Components', 'Industrial Electronics'],
    landmark: 'Opp. MIDC Administrative Building, Ambethan Chowk',
    transitAccess: 'Direct PMPML Bus Terminus & Central Shared Auto Hub',
    pmpmlBusRoutes: ['Route 357 (Swargate - Chakan)', 'Route 121 (Bhosari - Chakan)', 'Route 341 (Nigdi - Chakan)'],
    sharedTransitHubs: ['Ambethan Chowk Tempo Stand', 'Talegaon Chowk Chakan'],
    activeCompaniesCount: 165,
    openJobsCount: 520,
    description:
      'The administrative, commercial, and logistics nerve centre of Chakan MIDC connecting Phase 1 through Phase 4, housing core plant suppliers and banking institutions.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'chakan-phase-1',
    name: 'Chakan MIDC Phase 1',
    marathiName: 'चाकण एमआयडीसी टप्पा १',
    pincode: '410501',
    zone: 'Talegaon-Chakan Expressway',
    keyIndustries: ['Automotive OEM', 'Robotic Body Press', 'Tier-1 Ancillaries', 'Powertrain Machining'],
    landmark: 'Near Volkswagen India & Bajaj Auto Plant Gate 3',
    transitAccess: 'Direct PMPML Bus from Bhosari / Nigdi depot with plant-gate stops',
    pmpmlBusRoutes: ['Route 357A (Bhosari - Phase 1)', 'Route 341B (Nigdi - Bajaj Gate)'],
    sharedTransitHubs: ['Ambethan Phata Shared Six-Seater Stand', 'Bajaj Gate 2 Auto Stop'],
    activeCompaniesCount: 142,
    openJobsCount: 480,
    description:
      'Premier automotive manufacturing corridor featuring global OEM anchor plants, robotic stamping lines, and high-precision powertrain fabrication facilities.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'chakan-phase-2',
    name: 'Chakan MIDC Phase 2',
    marathiName: 'चाकण एमआयडीसी टप्पा २',
    pincode: '410501',
    zone: 'Sawaswadi / Bhamboli Sector',
    keyIndustries: ['Precision CNC Turning', 'Powder Coating', 'Heavy Fabrication', 'Stamping Tooling'],
    landmark: 'Near Hyundai Construction & Mahindra Plant Gate 4',
    transitAccess: 'Frequent shared transit from Ambethan Chowk & Bhamboli Phata',
    pmpmlBusRoutes: ['Route 358 (Bhosari - Bhamboli)', 'Route 121 (Chakan - Sawaswadi Phata)'],
    sharedTransitHubs: ['Bhamboli Phata Shared Jeep Stand', 'Sawaswadi Chowk'],
    activeCompaniesCount: 98,
    openJobsCount: 310,
    description:
      'Specialized in precision CNC turning, powder coating, heavy fabrication, hydraulic cylinders, and Tier-2 auto stamping plants.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'chakan-phase-3',
    name: 'Chakan MIDC Phase 3',
    marathiName: 'चाकण एमआयडीसी टप्पा ३',
    pincode: '410501',
    zone: 'Kharabwadi Hub',
    keyIndustries: ['Luxury Auto Components', 'Tool & Die Rooms', 'Automated Warehouse Parks', 'Paint Shops'],
    landmark: 'Behind Mercedes-Benz Industrial Complex',
    transitAccess: 'Connecting Chakan-Talegaon Link Road via Kharabwadi Phata',
    pmpmlBusRoutes: ['Route 357 (Swargate - Talegaon via Chakan)', 'Route 342 (Nigdi - Kharabwadi)'],
    sharedTransitHubs: ['Kharabwadi Phata Shared Cruiser Stand', 'Mercedes-Benz Gate 1 Chowk'],
    activeCompaniesCount: 115,
    openJobsCount: 395,
    description:
      'Home to luxury automotive sub-assembly plants, advanced tool & die rooms, automated paint lines, and modern Grade-A logistics warehouses.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'chakan-phase-4',
    name: 'Chakan MIDC Phase 4',
    marathiName: 'चाकण एमआयडीसी टप्पा ४',
    pincode: '410501',
    zone: 'Nighoje Expansion Sector',
    keyIndustries: ['EV Powertrain & Battery', 'Tire Manufacturing', 'High-Volume Stamping', 'Die Casting'],
    landmark: 'Near Bridgestone India & Minda Corp Plant',
    transitAccess: 'Shuttle buses via Talwade IT Park & Dehu Road connector',
    pmpmlBusRoutes: ['Route 304 (Nigdi - Dehu - Nighoje)', 'Route 344 (Bhosari - Phase 4)'],
    sharedTransitHubs: ['Nighoje Bridge Auto Stand', 'Talwade Software Park Crossing'],
    activeCompaniesCount: 76,
    openJobsCount: 240,
    description:
      'Fast-growing industrial sector featuring next-generation EV powertrain plants, tire manufacturing, high-pressure die casting, and wire harness assemblies.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'khed-city',
    name: 'Khed City SEZ',
    marathiName: 'खेड सिटी सेझ',
    pincode: '410505',
    zone: 'Khed-Rajgurunagar Corridor',
    keyIndustries: ['European MNC Engineering', 'Aerospace Grade Machining', 'Heavy Machinery', 'Export Units'],
    landmark: 'Bharat Forge Khed City Industrial Zone Gate 1',
    transitAccess: 'Dedicated factory company shuttles from Pune Station, Bhosari & Chakan',
    pmpmlBusRoutes: ['Route 365 (Pune Station - Rajgurunagar via Khed City)', 'Route 120 (Chakan - Khed)'],
    sharedTransitHubs: ['Rajgurunagar Bus Stand', 'Khed City Main Toll Plaza'],
    activeCompaniesCount: 64,
    openJobsCount: 220,
    description:
      'Integrated smart industrial city housing European multinational manufacturers, export-oriented precision engineering, and aerospace grade machining units.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'kanersar',
    name: 'Kanersar Industrial Zone',
    marathiName: 'कानेसर औद्योगिक क्षेत्र',
    pincode: '410505',
    zone: 'Northern Khed Extension',
    keyIndustries: ['Structural Fabrication', 'Sheet Metal Support', 'Industrial Gases', 'Equipment Overhaul'],
    landmark: 'Near Kanersar Phata on Pune-Nashik Highway Bypass',
    transitAccess: 'MSRTC State Transport buses and shared jeeps from Rajgurunagar',
    pmpmlBusRoutes: ['MSRTC Rajgurunagar - Kanersar Line', 'Local Khed Shuttle'],
    sharedTransitHubs: ['Kanersar Phata Stop', 'Nimgaon Phata'],
    activeCompaniesCount: 38,
    openJobsCount: 125,
    description:
      'Developing manufacturing pocket focused on heavy structural welding, industrial gas distribution, sheet metal components, and plant engineering support.',
    pilotPriority: 'medium',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'mahalunge',
    name: 'Mahalunge Ingale',
    marathiName: 'म्हाळुंगे इंगळे',
    pincode: '410501',
    zone: 'Chakan-Talegaon MIDC Border',
    keyIndustries: ['3PL Logistics & Warehousing', 'Automotive Suspension', 'Rubber Components', 'Cold Storage'],
    landmark: 'Near IndoSpace Industrial Logistics Park Gate 2',
    transitAccess: 'Direct access via Chakan-Talegaon State Highway',
    pmpmlBusRoutes: ['Route 357 (Swargate - Talegaon via Mahalunge)', 'Route 341 (Nigdi - IndoSpace)'],
    sharedTransitHubs: ['Mahalunge Phata Auto Stand', 'HPCL Petrol Pump Crossing'],
    activeCompaniesCount: 88,
    openJobsCount: 290,
    description:
      'Crucial transit and warehousing anchor between Chakan and Talegaon MIDC, housing automated distribution centres, tier-1 shock absorber and rubber molding plants.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'kuruli',
    name: 'Kuruli Industrial Belt',
    marathiName: 'कुरुळी औद्योगिक पट्टा',
    pincode: '412105',
    zone: 'Alandi-Chakan Road',
    keyIndustries: ['Precision Job Work', 'Commercial Heat Treatment', 'Wire Harness', 'Fasteners'],
    landmark: 'Near Kuruli Toll Plaza & Alandi Phata',
    transitAccess: 'PMPML Route from Pune Swargate, Bhosari, and Alandi Devachi',
    pmpmlBusRoutes: ['Route 354 (Swargate - Alandi - Chakan)', 'Route 105 (Bhosari - Kuruli)'],
    sharedTransitHubs: ['Kuruli Toll Plaza Stand', 'Moi Phata Crossing'],
    activeCompaniesCount: 52,
    openJobsCount: 175,
    description:
      'High-density corridor of small and medium enterprises specializing in CNC/VMC job-work, metallurgical heat treatment, specialized fasteners, and electrical harnesses.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'nighoje',
    name: 'Nighoje Manufacturing Hub',
    marathiName: 'निघोजे मॅन्युफॅक्चरिंग हब',
    pincode: '410501',
    zone: 'Talwade-Chakan Link',
    keyIndustries: ['EV Battery Packaging', 'Light Stamping', 'Electrical Sub-components', 'Packaging'],
    landmark: 'Near Nighoje River Bridge & Talwade Boundary',
    transitAccess: 'Direct road connection to Talwade IT Park and Chakan Outer Ring',
    pmpmlBusRoutes: ['Route 304 (Nigdi - Talwade - Nighoje)', 'Route 308 (Pimpri - Nighoje)'],
    sharedTransitHubs: ['Nighoje Bridge Auto Stand', 'Talwade Octroi Post'],
    activeCompaniesCount: 46,
    openJobsCount: 150,
    description:
      'Strategic connector corridor linking PCMC industrial belt to Chakan Phase 4, housing EV battery packaging units, electronic sub-assemblies, and corrugated packaging plants.',
    pilotPriority: 'high',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'khalumbre',
    name: 'Khalumbre Industrial Corridor',
    marathiName: 'खळुंब्रे औद्योगिक पट्टा',
    pincode: '410501',
    zone: 'Chakan Outer Industrial Ring',
    keyIndustries: ['Automotive Plastic Injection Trims', 'Tooling & Fixtures', 'Lighting Assemblies'],
    landmark: 'Near Lumax Industries Complex & Khalumbre Gram Panchayat',
    transitAccess: 'Shared transport from Chakan Manchar junction and local shared tempos',
    pmpmlBusRoutes: ['Route 359 (Chakan - Khalumbre Local)', 'Route 121 (Bhosari - Manchar Bypass)'],
    sharedTransitHubs: ['Khalumbre Phata Tempo Stand', 'Varroc Outer Gate Stop'],
    activeCompaniesCount: 42,
    openJobsCount: 135,
    description:
      'Specialized manufacturing hub for plastic polymer compounding, precision injection molding, automotive headlights/taillights, and inspection fixtures.',
    pilotPriority: 'medium',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
  {
    id: 'vasuli',
    name: 'Vasuli Logistics & Stamping Park',
    marathiName: 'वासुली लॉजिस्टिक व स्टॅम्पिंग पार्क',
    pincode: '410501',
    zone: 'Outer Talegaon-Chakan Sector',
    keyIndustries: ['Heavy Contract Stamping', 'Logistics Freight Parks', 'Commercial Vehicle Trailers'],
    landmark: 'Near Varroc Engineering Plant 2 & Vasuli Hill Phata',
    transitAccess: 'Local transit via Dehu-Chakan connector and Talegaon MIDC link road',
    pmpmlBusRoutes: ['Route 347 (Talegaon Station - Vasuli)', 'Route 304 (Dehu - Vasuli Phata)'],
    sharedTransitHubs: ['Vasuli Phata Six-Seater Stand', 'Dehu Road Bypass Crossing'],
    activeCompaniesCount: 39,
    openJobsCount: 115,
    description:
      'Rapidly industrializing sector featuring large-span contract stamping facilities, trailer fabrication yards, and regional freight transport terminals.',
    pilotPriority: 'medium',
    disclaimer:
      'Rozzy is an expanding local employment network in Pune District. Listings represent verified participating plants and authorized partners, not the totality of all manufacturing units.',
  },
];

export function getPilotLocationBySlug(slug: string): PilotLocation | undefined {
  return CHAKAN_PILOT_LOCATIONS.find((loc) => loc.id === slug);
}
