-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 04: SEED DATA & GEOGRAPHIC REFERENCE DATA
-- Geography: Maharashtra, Pune District, Chakan & Pune Industrial Belt
-- =====================================================================

-- 1. STATES, DISTRICTS & CITIES
INSERT INTO states (id, name, code)
VALUES ('state-mh', 'Maharashtra', 'MH')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, state_id, name)
VALUES ('dist-pune', 'state-mh', 'Pune')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cities (id, district_id, name)
VALUES 
    ('city-chakan', 'dist-pune', 'Chakan'),
    ('city-khed', 'dist-pune', 'Khed / Rajgurunagar'),
    ('city-pimpri', 'dist-pune', 'Pimpri-Chinchwad'),
    ('city-talegaon', 'dist-pune', 'Talegaon Dabhade')
ON CONFLICT (id) DO NOTHING;

-- 2. INDUSTRIAL CLUSTERS (8 Key Pune/Chakan Manufacturing Hubs)
INSERT INTO industrial_clusters (id, city_id, name, pincode, zone, landmark, transit_access, description)
VALUES 
    (
        'chakan-phase-1',
        'city-chakan',
        'Chakan MIDC Phase 1',
        '410501',
        'Talegaon-Chakan Expressway',
        'Near Bajaj Auto & Minda Industries Gate',
        'Direct PMPML Route 348 from Bhosari & Nigdi. Shared 6-seater tempos from Chakan Ambethan Chowk every 5 mins.',
        'Primary heavy automotive stamping, machining, and component manufacturing hub in north Pune.'
    ),
    (
        'chakan-phase-2',
        'city-chakan',
        'Chakan MIDC Phase 2 (Sawardari / Vasuli)',
        '410501',
        'Vasuli-Sawardari Corridor',
        'Near Hyundai Construction & Bridgestone Plant',
        'Company staff buses operate heavily on this belt; PMPML buses up to Sawardari Phata.',
        'Major tire manufacturing, heavy equipment, and European engineering facilities.'
    ),
    (
        'chakan-phase-3',
        'city-chakan',
        'Chakan MIDC Phase 3 (Nighoje / Kuruli)',
        '410501',
        'Nighoje-Kuruli Rural Corridor',
        'Near Mercedes-Benz India & Mahindra Vehicle Gate',
        'Connected directly to Spine Road & Moshi via Nighoje Bridge. Regular auto-rickshaw shuttles.',
        'Premium OEM assembly cluster, automotive electronics, and precision prototyping.'
    ),
    (
        'chakan-phase-4',
        'city-chakan',
        'Chakan MIDC Phase 4 (Mahalunge Ingale)',
        '410501',
        'Mahalunge-Khalumbre Sector',
        'Opposite Endurance Technologies Unit 2',
        'Accessible via Talegaon-Chakan Highway and Kharabwadi Link Road.',
        'Fast-growing tier-1 stamping, aluminum die-casting, and automotive plastic polymer hub.'
    ),
    (
        'khed-city',
        'city-khed',
        'Khed City Industrial SEZ (Khed)',
        '410505',
        'Pune-Nashik Highway Corridor',
        'Near Bharat Forge SEZ & Khed City Administrative Block',
        'State transport (ST) buses from Rajgurunagar; dedicated factory commuter vans from Bhosari and Narayangaon.',
        'Integrated industrial smart city hosting MNC engineering, clean manufacturing, and pharma engineering.'
    ),
    (
        'talegaon-floriculture',
        'city-talegaon',
        'Talegaon MIDC / Floriculture Park',
        '410507',
        'Old Mumbai-Pune Highway / Expressway Junction',
        'Near General Motors / JLR Corridor & Urse Toll',
        'Talegaon Local Railway Station (connecting to Pune Junction & Lonavala) + PMPML feeders.',
        'Key automotive, logistics warehouse, and heavy press tool tooling cluster.'
    ),
    (
        'bhosari-auto',
        'city-pimpri',
        'Bhosari MIDC / Pimpri-Chinchwad Belt',
        '411026',
        'Pimpri-Chinchwad Industrial Belt',
        'Near Tata Motors Pimpri Gate & Telco Road',
        'Metro Line 1 (Pimpri-Swargate) connectivity + comprehensive PMPML hub at Bhosari Depot.',
        'Historic precision manufacturing, machining shops, CMM inspection, and tool-and-die epicenter.'
    ),
    (
        'markal-alandi',
        'city-chakan',
        'Markal & Alandi Industrial Belt',
        '412105',
        'Indrayani River Industrial Belt',
        'Near Alandi Markal Road & River Bridge',
        'Accessible from Pune Airport road, Wagholi, and Alandi Phata.',
        'Fabrication, heavy structural welding, industrial gas plants, and warehousing.'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    pincode = EXCLUDED.pincode,
    zone = EXCLUDED.zone,
    landmark = EXCLUDED.landmark,
    transit_access = EXCLUDED.transit_access,
    description = EXCLUDED.description;

-- 3. JOB CATEGORIES
INSERT INTO job_categories (id, name, slug, description, display_order)
VALUES 
    ('cat-cnc', 'Machining & CNC', 'machining-cnc', 'VMC, HMC, CNC Turning, Lathe, Milling operations', 1),
    ('cat-assembly', 'Assembly & Line', 'assembly-line', 'Automotive engine, chassis, BIW, harness line assembly', 2),
    ('cat-welding', 'Welding & Fabrication', 'welding-fabrication', 'MIG, CO2, TIG, Arc welding, and laser cutting', 3),
    ('cat-quality', 'Quality Control & CMM', 'quality-cmm', 'CMM operators, line quality inspectors, standard room technicians', 4),
    ('cat-maintenance', 'Maintenance & Electrical', 'maintenance-electrical', 'Plant electricians, hydraulic & pneumatic mechanics, automation', 5),
    ('cat-tooldie', 'Tool & Die', 'tool-die', 'Press tool makers, mold maintenance, die repair machinists', 6),
    ('cat-logistics', 'Warehouse & Logistics', 'warehouse-logistics', 'Forklift drivers, dispatch coordinators, storekeepers', 7),
    ('cat-production', 'Production & Planning', 'production-planning', 'Shift supervisors, line leaders, SAP/ERP store planners', 8),
    ('cat-safety', 'Industrial Safety & EHS', 'safety-ehs', 'Safety officers, shopfloor fire marshals, EHS executives', 9)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order;

-- 4. PLATFORM SETTINGS
INSERT INTO platform_settings (key, value, description)
VALUES 
    ('platform_version', '"2.0.0"'::jsonb, 'Current UdyogSetu schema version'),
    ('moderation_auto_flag', '{"thresholdReports": 3, "notifyAdmin": true}'::jsonb, 'Automatic job unlisting threshold'),
    ('allowed_trade_qualifications', '["10th / 12th", "ITI (Fitter/Machinist/Turner/Welder/Electrician)", "Diploma (Mechanical/Auto/Electrical)", "B.E. / B.Tech (Mechanical/Prod)", "Any Graduate"]'::jsonb, 'Standard manufacturing education options')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description;
