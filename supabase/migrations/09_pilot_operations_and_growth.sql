-- ============================================================================
-- UDYOGSETU PLATFORM — MIGRATION 09: PILOT LAUNCH, REAL-WORLD OPERATIONS & GROWTH
-- Chakan–Khed Industrial Ecosystem (Pune District, Maharashtra)
-- ============================================================================

-- 1. EMPLOYER PROSPECT DATABASE & 11-STAGE PIPELINE
CREATE TABLE IF NOT EXISTS employer_prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    industrial_location TEXT NOT NULL,
    official_website TEXT,
    public_business_contact TEXT,
    contact_person TEXT,
    contact_source TEXT,
    outreach_date DATE,
    outreach_method TEXT CHECK (outreach_method IN ('email', 'phone', 'linkedin', 'in_person', 'referral', 'other')),
    response_status TEXT NOT NULL DEFAULT 'no_response' CHECK (response_status IN ('no_response', 'responsive', 'interested', 'not_interested', 'follow_up_needed')),
    meeting_status TEXT NOT NULL DEFAULT 'none' CHECK (meeting_status IN ('none', 'scheduled', 'completed', 'rescheduled', 'cancelled')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'in_progress', 'verified', 'rejected')),
    vacancy_availability TEXT NOT NULL DEFAULT 'unknown' CHECK (vacancy_availability IN ('immediate', 'upcoming', 'none', 'unknown')),
    next_followup_date DATE,
    pipeline_stage TEXT NOT NULL DEFAULT 'prospect_identified' CHECK (pipeline_stage IN (
        'prospect_identified',
        'research_completed',
        'contacted',
        'interested',
        'meeting_scheduled',
        'verification_started',
        'employer_verified',
        'first_vacancy_submitted',
        'first_vacancy_published',
        'active_employer',
        'inactive_employer'
    )),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. INDUSTRIAL PILOT LOCATIONS (12 Key Manufacturing Hubs)
CREATE TABLE IF NOT EXISTS industrial_pilot_locations (
    id TEXT PRIMARY KEY, -- Slug format (e.g. 'chakan-phase-1')
    name TEXT NOT NULL,
    marathi_name TEXT NOT NULL,
    pincode TEXT NOT NULL,
    zone TEXT NOT NULL,
    key_industries TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    landmark TEXT NOT NULL,
    transit_access TEXT NOT NULL,
    active_companies_count INT NOT NULL DEFAULT 0,
    open_jobs_count INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    pilot_priority TEXT NOT NULL DEFAULT 'high' CHECK (pilot_priority IN ('high', 'medium', 'expansion')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. RECRUITMENT AGENCY CLIENT AUTHORIZATIONS & COMPLIANCE
CREATE TABLE IF NOT EXISTS agency_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_company_name TEXT NOT NULL,
    client_contact_person TEXT,
    authorization_scope TEXT NOT NULL, -- e.g. 'Machine Operators & CNC Turners'
    contract_labor_license_no TEXT, -- Form V/VI registration under CLRA
    mandate_valid_until DATE NOT NULL,
    is_direct_employer_representation_barred BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'pending_audit')),
    internal_audit_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. VERIFIED PLACEMENT RECORDS & RETENTION TRACKING
CREATE TABLE IF NOT EXISTS placement_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    candidate_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    offered_salary_monthly INT NOT NULL,
    joining_date DATE NOT NULL,
    candidate_confirmation_status TEXT NOT NULL DEFAULT 'pending' CHECK (candidate_confirmation_status IN ('pending', 'confirmed', 'declined', 'disputed')),
    employer_confirmation_status TEXT NOT NULL DEFAULT 'pending' CHECK (employer_confirmation_status IN ('pending', 'confirmed', 'no_show', 'disputed')),
    placement_status TEXT NOT NULL DEFAULT 'offered' CHECK (placement_status IN ('offered', 'accepted', 'joined', 'disputed', 'cancelled')),
    dispute_reason TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INDEXES FOR PERFORMANCE & AUDITING
CREATE INDEX IF NOT EXISTS idx_employer_prospects_stage ON employer_prospects(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_employer_prospects_location ON employer_prospects(industrial_location);
CREATE INDEX IF NOT EXISTS idx_placement_records_company ON placement_records(company_id);
CREATE INDEX IF NOT EXISTS idx_placement_records_candidate ON placement_records(candidate_id);
CREATE INDEX IF NOT EXISTS idx_placement_records_status ON placement_records(placement_status);
CREATE INDEX IF NOT EXISTS idx_agency_auth_agency ON agency_authorizations(agency_id);

-- 6. ENABLE ROW LEVEL SECURITY
ALTER TABLE employer_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_pilot_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_records ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES
-- Admin can manage all prospects
CREATE POLICY admin_manage_prospects ON employer_prospects
    FOR ALL USING (is_platform_admin());

-- Locations are publicly readable
CREATE POLICY public_read_locations ON industrial_pilot_locations
    FOR SELECT USING (true);

CREATE POLICY admin_manage_locations ON industrial_pilot_locations
    FOR ALL USING (is_platform_admin());

-- Agency authorizations visible to admin and owning agency
CREATE POLICY agency_view_authorizations ON agency_authorizations
    FOR SELECT USING (
        is_platform_admin() OR 
        agency_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())
    );

CREATE POLICY admin_manage_authorizations ON agency_authorizations
    FOR ALL USING (is_platform_admin());

-- Placement records: Candidate views own, employer views own, admin manages all
CREATE POLICY candidate_view_placements ON placement_records
    FOR SELECT USING (candidate_id = auth.uid() OR is_platform_admin());

CREATE POLICY employer_view_placements ON placement_records
    FOR SELECT USING (
        company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()) OR
        is_platform_admin()
    );

CREATE POLICY admin_manage_placements ON placement_records
    FOR ALL USING (is_platform_admin());

-- 8. SEED DATA: 12 CHAKAN-KHED INDUSTRIAL PILOT LOCATIONS
INSERT INTO industrial_pilot_locations (id, name, marathi_name, pincode, zone, key_industries, landmark, transit_access, active_companies_count, open_jobs_count, description, pilot_priority)
VALUES
    ('chakan-midc-main', 'Chakan MIDC Central', 'चाकण एमआयडीसी मुख्य केंद्र', '410501', 'Central Industrial Corridor', ARRAY['Automotive OEM', 'Heavy Engineering', 'Auto Components'], 'Opp. MIDC Administrative Building, Ambethan Chowk', 'Direct PMPML Bus Terminus & Shared Auto Hub', 165, 520, 'The administrative and logistics nerve centre of Chakan MIDC connecting Phase 1 through 4.', 'high'),
    ('chakan-phase-1', 'Chakan MIDC Phase 1', 'चाकण एमआयडीसी टप्पा १', '410501', 'Talegaon-Chakan Expressway', ARRAY['Automotive OEM', 'Robotic Press', 'Tier-1 Ancillary'], 'Near Volkswagen India & Bajaj Auto Plant Gate 3', 'Direct PMPML Bus from Bhosari / Nigdi Depot', 142, 480, 'Premier automotive manufacturing corridor housing global OEMs, robotic body shops, and Tier-1 press units.', 'high'),
    ('chakan-phase-2', 'Chakan MIDC Phase 2', 'चाकण एमआयडीसी टप्पा २', '410501', 'Sawaswadi / Bhamboli Sector', ARRAY['Precision CNC Turning', 'Powder Coating', 'Heavy Fabrication'], 'Near Hyundai Construction & Mahindra Plant', 'Frequent shared transit from Ambethan Chowk', 98, 310, 'Specialized in precision CNC turning, powder coating, heavy fabrication, and industrial stamping plants.', 'high'),
    ('chakan-phase-3', 'Chakan MIDC Phase 3', 'चाकण एमआयडीसी टप्पा ३', '410501', 'Kharabwadi Hub', ARRAY['Luxury Auto Components', 'Tool & Die Rooms', 'Automated Warehouses'], 'Behind Mercedes-Benz Industrial Complex', 'Connecting Chakan-Talegaon Link Road', 115, 395, 'Home to luxury auto component sub-assemblies, tool & die rooms, and automated warehouse parks.', 'high'),
    ('chakan-phase-4', 'Chakan MIDC Phase 4', 'चाकण एमआयडीसी टप्पा ४', '410501', 'Nighoje Expansion Sector', ARRAY['EV Powertrain', 'Tire Manufacturing', 'High-Volume Press Lines'], 'Near Bridgestone & Minda Corp', 'Shuttle buses via Talwade & Dehu Road', 76, 240, 'High-growth sector featuring EV powertrain fabrication, tire manufacturing, and high-volume press lines.', 'high'),
    ('khed-city', 'Khed City SEZ', 'खेड सिटी सेझ', '410505', 'Khed-Rajgurunagar Corridor', ARRAY['Aerospace Fabrication', 'European Engineering MNCs', 'Precision Machining'], 'Bharat Forge Khed City Industrial Zone', 'Dedicated factory shuttles from Pune Station & Chakan', 64, 220, 'Integrated industrial city featuring European MNC engineering machinery, export units, and aerospace grade fabrication.', 'high'),
    ('kanersar', 'Kanersar Industrial Zone', 'कानेसर औद्योगिक क्षेत्र', '410505', 'Northern Khed Extension', ARRAY['Fabrication & Welding', 'Heavy Machinery Support', 'Sheet Metal'], 'Near Kanersar Phata & Pune-Nashik Highway Bypass', 'Local ST buses & shared jeep connections', 38, 125, 'Emerging industrial extension catering to fabrication, sheet metal components, and plant logistics.', 'medium'),
    ('mahalunge', 'Mahalunge Ingale', 'म्हाळुंगे इंगळे', '410501', 'Chakan-Talegaon MIDC Border', ARRAY['Logistics & 3PL Warehousing', 'Automotive Suspension', 'Rubber Components'], 'Near IndoSpace Industrial Logistics Park', 'Accessible via Chakan-Talegaon State Highway', 88, 290, 'Critical logistics and warehousing hub with tier-1 auto suspension and polymer manufacturing plants.', 'high'),
    ('kuruli', 'Kuruli Industrial Belt', 'कुरुळी औद्योगिक पट्टा', '412105', 'Alandi-Chakan Road', ARRAY['Precision Machine Shops', 'Heat Treatment', 'Wire Harness Assembly'], 'Near Kuruli Toll Plaza & Alandi Phata', 'PMPML Route from Pune Swargate & Bhosari', 52, 175, 'Predominantly small-to-medium precision machine shops, heat treatment facilities, and wire harness assembly.', 'high'),
    ('nighoje', 'Nighoje Manufacturing Hub', 'निघोजे मॅन्युफॅक्चरिंग हब', '410501', 'Talwade-Chakan Link', ARRAY['Stamping & Tooling', 'EV Battery Assembly', 'Electronics'], 'Near Nighoje Bridge & River Crossing', 'Accessible from Talwade IT Park & Chakan Ring Road', 46, 150, 'Emerging junction for EV battery pack assembly, light stamping, and electrical sub-components.', 'high'),
    ('khalumbre', 'Khalumbre Industrial Corridor', 'खळुंब्रे औद्योगिक पट्टा', '410501', 'Chakan Outer Industrial Ring', ARRAY['Automotive Plastic Trims', 'Injection Molding', 'Press Tools'], 'Near Lumax Industries Complex', 'Shared transport from Chakan Manchar junction', 42, 135, 'Specialized in plastic injection molding, automotive lighting fixtures, and press tooling units.', 'medium'),
    ('vasuli', 'Vasuli Logistics & Stamping Park', 'वासुली लॉजिस्टिक व स्टॅम्पिंग पार्क', '410501', 'Outer Talegaon-Chakan Sector', ARRAY['Contract Stamping', 'Logistics Warehouses', 'Heavy Trailers'], 'Near Varroc Engineering Plant & Vasuli Hill Phata', 'Local transit via Dehu-Chakan connector', 39, 115, 'Rapidly expanding belt for automated warehousing, logistics trailers, and heavy contract stamping.', 'medium')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    marathi_name = EXCLUDED.marathi_name,
    pincode = EXCLUDED.pincode,
    zone = EXCLUDED.zone,
    key_industries = EXCLUDED.key_industries,
    landmark = EXCLUDED.landmark,
    transit_access = EXCLUDED.transit_access,
    active_companies_count = EXCLUDED.active_companies_count,
    open_jobs_count = EXCLUDED.open_jobs_count,
    description = EXCLUDED.description,
    pilot_priority = EXCLUDED.pilot_priority;
