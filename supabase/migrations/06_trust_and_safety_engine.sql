-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 06: TRUST & SAFETY ENGINE, EMPLOYER VERIFICATION & MODERATION
-- Target Database: Supabase PostgreSQL (15+)
-- Geographic Focus: Chakan MIDC, Khed City, Kuruli, Mahalunge, Pune Belt
-- =====================================================================

-- 1. EXTEND COMPANIES TABLE WITH MULTI-STAGE VERIFICATION FIELDS
ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS legal_name TEXT,
    ADD COLUMN IF NOT EXISTS trade_name TEXT,
    ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'Private Limited'
        CHECK (business_type IN ('Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Proprietorship', 'Foreign Subsidiary', 'Government / PSU')),
    ADD COLUMN IF NOT EXISTS company_website TEXT,
    ADD COLUMN IF NOT EXISTS registered_office_address TEXT,
    ADD COLUMN IF NOT EXISTS factory_address TEXT,
    ADD COLUMN IF NOT EXISTS authorized_representative_name TEXT,
    ADD COLUMN IF NOT EXISTS authorized_representative_designation TEXT,
    ADD COLUMN IF NOT EXISTS authorized_representative_email TEXT,
    ADD COLUMN IF NOT EXISTS authorized_representative_phone TEXT,
    ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_address_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_rep_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS trust_badge_company_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS trust_badge_rep_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS verification_stage TEXT DEFAULT 'unverified'
        CHECK (verification_stage IN (
            'unverified',
            'verification_submitted',
            'under_review',
            'additional_info_required',
            'verified',
            'rejected',
            'suspended',
            'expired'
        )),
    ADD COLUMN IF NOT EXISTS next_review_date TIMESTAMPTZ;

-- Backfill legal name from company name where null
UPDATE companies SET legal_name = name WHERE legal_name IS NULL;
UPDATE companies SET verification_stage = 'verified', trust_badge_company_verified = TRUE, trust_badge_rep_verified = TRUE WHERE verification_status = 'verified';

-- ---------------------------------------------------------------------
-- 2. COMPANY VERIFICATION AUDIT TRAILS
-- Sensitive auditor notes are stored here and NEVER exposed publicly
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS company_verification_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verification_method TEXT NOT NULL CHECK (verification_method IN (
        'official_email_domain',
        'gstin_registry_check',
        'udyam_msme_check',
        'midc_plot_allotment_check',
        'factory_license_dish_check',
        'representative_authorization_letter',
        'physical_plant_audit',
        'manual_desk_audit'
    )),
    documents_reviewed TEXT[] DEFAULT '{}',
    internal_notes TEXT, -- Strictly private to administrators
    decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'more_info_needed', 'suspended', 'revoked')),
    rejection_reason TEXT,
    next_review_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comp_verif_audit_comp ON company_verification_audits(company_id);
CREATE INDEX idx_comp_verif_audit_reviewer ON company_verification_audits(reviewer_id);

-- ---------------------------------------------------------------------
-- 3. RECRUITMENT AGENCY VERIFICATION & COMPANY AUTHORIZATIONS
-- ---------------------------------------------------------------------

ALTER TABLE recruitment_agencies
    ADD COLUMN IF NOT EXISTS agency_type TEXT DEFAULT 'Technical Staffing Agency'
        CHECK (agency_type IN ('Technical Staffing Agency', 'Manpower Contractor', 'Apprentice / NEEM Agent', 'Executive Search')),
    ADD COLUMN IF NOT EXISTS authorized_rep_name TEXT,
    ADD COLUMN IF NOT EXISTS authorized_rep_designation TEXT,
    ADD COLUMN IF NOT EXISTS website_url TEXT,
    ADD COLUMN IF NOT EXISTS recruitment_experience_years INTEGER DEFAULT 5,
    ADD COLUMN IF NOT EXISTS trust_badge_agency_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS verification_stage TEXT DEFAULT 'unverified'
        CHECK (verification_stage IN ('unverified', 'verification_submitted', 'under_review', 'additional_info_required', 'verified', 'rejected', 'suspended'));

CREATE TABLE IF NOT EXISTS company_agency_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES recruitment_agencies(id) ON DELETE CASCADE,
    authorization_status TEXT DEFAULT 'pending_company_approval' CHECK (authorization_status IN (
        'pending_company_approval',
        'pending_admin_approval',
        'approved',
        'rejected',
        'revoked',
        'expired'
    )),
    scope_of_recruitment TEXT NOT NULL, -- e.g. "Contractual CNC Lathe & VMC Machinists for Chakan Phase 2"
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    authorization_letter_doc_path TEXT,
    company_authorized_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    admin_approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    trust_badge_authorized_partner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_company_agency_mandate UNIQUE (company_id, agency_id)
);

CREATE INDEX idx_company_agency_auth_comp ON company_agency_authorizations(company_id);
CREATE INDEX idx_company_agency_auth_agency ON company_agency_authorizations(agency_id);

-- ---------------------------------------------------------------------
-- 4. EXTEND JOBS WITH MODERATION, VERIFICATION & FRESHNESS FIELDS
-- ---------------------------------------------------------------------

ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved'
        CHECK (moderation_status IN (
            'draft',
            'pending_review',
            'under_review',
            'additional_info_required',
            'approved',
            'published',
            'rejected',
            'suspended',
            'expired',
            'filled'
        )),
    ADD COLUMN IF NOT EXISTS moderation_notes TEXT,
    ADD COLUMN IF NOT EXISTS moderation_reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS moderation_reviewed_at TIMESTAMPTZ,
    
    -- Independent Vacancy Authenticity
    ADD COLUMN IF NOT EXISTS vacancy_verification_status TEXT DEFAULT 'employer_confirmed'
        CHECK (vacancy_verification_status IN (
            'verification_pending',
            'source_confirmed',
            'employer_confirmed',
            'verification_required',
            'temporarily_unavailable',
            'expired',
            'filled',
            'suspended'
        )),
    ADD COLUMN IF NOT EXISTS vacancy_verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS vacancy_verified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS vacancy_verification_method TEXT DEFAULT 'employer_dashboard'
        CHECK (vacancy_verification_method IN (
            'employer_dashboard',
            'official_email',
            'hr_contact_verified',
            'source_verified',
            'admin_audit'
        )),
    ADD COLUMN IF NOT EXISTS vacancy_evidence_ref TEXT,
    ADD COLUMN IF NOT EXISTS trust_badge_employer_confirmed BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS trust_badge_source_confirmed BOOLEAN DEFAULT FALSE,
    
    -- Freshness Engine
    ADD COLUMN IF NOT EXISTS last_reconfirmed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS next_reconfirmation_due TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    ADD COLUMN IF NOT EXISTS freshness_status TEXT DEFAULT 'active'
        CHECK (freshness_status IN (
            'newly_published',
            'active',
            'reconfirmation_required',
            'temporarily_unavailable',
            'expired',
            'filled'
        )),
    
    -- Duplicate & Risk Flags
    ADD COLUMN IF NOT EXISTS is_duplicate_flagged BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS duplicate_of_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    ADD COLUMN IF NOT EXISTS risk_flags TEXT[] DEFAULT '{}';

CREATE INDEX idx_jobs_moderation_status ON jobs(moderation_status);
CREATE INDEX idx_jobs_freshness_status ON jobs(freshness_status);
CREATE INDEX idx_jobs_reconfirmation_due ON jobs(next_reconfirmation_due);
CREATE INDEX idx_jobs_risk_level ON jobs(risk_level);

-- ---------------------------------------------------------------------
-- 5. DUPLICATE JOB CANDIDATES REVIEW QUEUE
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS duplicate_job_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    matched_job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    match_type TEXT NOT NULL CHECK (match_type IN (
        'exact_title_company_location',
        'high_description_similarity',
        'same_hr_contact_phone',
        'potential_repost'
    )),
    similarity_score NUMERIC(5,2) NOT NULL,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'confirmed_duplicate', 'dismissed_distinct_plant')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_duplicate_candidates_job ON duplicate_job_candidates(job_id);
CREATE INDEX idx_duplicate_candidates_status ON duplicate_job_candidates(review_status);

-- ---------------------------------------------------------------------
-- 6. CANDIDATE COMPLAINTS & FRAUD INVESTIGATIONS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidate_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_ticket_no TEXT UNIQUE NOT NULL,
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES recruitment_agencies(id) ON DELETE SET NULL,
    report_category TEXT NOT NULL CHECK (report_category IN (
        'Fake Salary',
        'Demanded Money / Registration Fee',
        'Ghost Vacancy',
        'Unsafe Working Conditions',
        'Incorrect Location',
        'Impersonation',
        'Suspicious External Link',
        'Misleading Employment Terms'
    )),
    description TEXT NOT NULL,
    evidence_file_paths TEXT[] DEFAULT '{}',
    reporter_contact_allowed BOOLEAN DEFAULT TRUE,
    
    -- Investigation Lifecycle
    investigation_status TEXT DEFAULT 'submitted' CHECK (investigation_status IN (
        'submitted',
        'under_review',
        'additional_info_required',
        'investigation_ongoing',
        'resolved',
        'dismissed',
        'escalated'
    )),
    assigned_investigator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    internal_investigation_notes TEXT, -- Strictly private
    final_decision_notes TEXT,
    action_taken TEXT DEFAULT 'none' CHECK (action_taken IN (
        'none',
        'warning_issued',
        'job_suspended',
        'employer_suspended',
        'agency_authorization_revoked',
        'banned'
    )),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_candidate_reports_modtime
    BEFORE UPDATE ON candidate_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_candidate_reports_job ON candidate_reports(job_id);
CREATE INDEX idx_candidate_reports_comp ON candidate_reports(company_id);
CREATE INDEX idx_candidate_reports_status ON candidate_reports(investigation_status);
CREATE INDEX idx_candidate_reports_ticket ON candidate_reports(report_ticket_no);

-- ---------------------------------------------------------------------
-- 7. FRAUD RISK SIGNALS LOG
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS risk_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('job', 'company', 'agency')),
    entity_id TEXT NOT NULL,
    signal_code TEXT NOT NULL, -- e.g. 'FEE_DEMAND_KEYWORD', 'UNREALISTIC_SALARY_HELPER', 'MULTIPLE_FRAUD_REPORTS'
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    signal_details JSONB DEFAULT '{}'::jsonb,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_signals_entity ON risk_signals(entity_type, entity_id);
CREATE INDEX idx_risk_signals_severity ON risk_signals(severity);

-- ---------------------------------------------------------------------
-- 8. AUTOMATED PRE-MODERATION & RISK SCORING TRIGGER
-- Analyzes job listings upon creation/update for obvious fraud red flags
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.analyze_job_risk_and_moderation()
RETURNS TRIGGER AS $$
DECLARE
    calculated_risk INTEGER := 0;
    flags TEXT[] := '{}';
    desc_lower TEXT;
    is_employer_verified BOOLEAN := FALSE;
BEGIN
    desc_lower := LOWER(NEW.description || ' ' || NEW.title);

    -- 1. Check if employer is verified
    SELECT trust_badge_company_verified INTO is_employer_verified
    FROM public.companies
    WHERE id = NEW.company_id;

    IF NOT COALESCE(is_employer_verified, FALSE) THEN
        calculated_risk := calculated_risk + 20;
        flags := array_append(flags, 'UNVERIFIED_EMPLOYER_ACCOUNT');
    END IF;

    -- 2. Detect fee/money extortion signals (Total violation in industrial recruitment!)
    IF desc_lower LIKE '%registration fee%' OR desc_lower LIKE '%interview fee%' OR 
       desc_lower LIKE '%security deposit%' OR desc_lower LIKE '%training charge%' OR
       desc_lower LIKE '%pay rs%' OR desc_lower LIKE '%pay ₹%' THEN
        calculated_risk := calculated_risk + 60;
        flags := array_append(flags, 'ILLEGAL_FEE_KEYWORD_DETECTED');
        NEW.moderation_status := 'suspended'; -- Instant auto-suspension!
    END IF;

    -- 3. Detect unrealistic salary claims for helper / freshers
    IF (NEW.category = 'Assembly & Line' OR desc_lower LIKE '%helper%' OR desc_lower LIKE '%loader%') AND
       NEW.salary_in_hand_monthly > 45000 THEN
        calculated_risk := calculated_risk + 35;
        flags := array_append(flags, 'ANOMALOUS_HIGH_SALARY_FOR_UNSKILLED');
    END IF;

    -- 4. Check for external telegram / bit.ly / short links
    IF desc_lower LIKE '%t.me/%' OR desc_lower LIKE '%bit.ly/%' OR desc_lower LIKE '%tinyurl%' THEN
        calculated_risk := calculated_risk + 25;
        flags := array_append(flags, 'SUSPICIOUS_SHORTLINK');
    END IF;

    -- Set calculated score & level
    NEW.risk_score := LEAST(100, calculated_risk);
    IF NEW.risk_score >= 60 THEN
        NEW.risk_level := 'critical';
    ELSIF NEW.risk_score >= 35 THEN
        NEW.risk_level := 'high';
    ELSIF NEW.risk_score >= 15 THEN
        NEW.risk_level := 'medium';
    ELSE
        NEW.risk_level := 'low';
    END IF;

    NEW.risk_flags := flags;

    -- If critical risk and not already suspended, hold for mandatory admin review
    IF NEW.risk_level = 'critical' AND NEW.moderation_status != 'suspended' THEN
        NEW.moderation_status := 'pending_review';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_job_pre_moderation ON jobs;
CREATE TRIGGER trigger_job_pre_moderation
    BEFORE INSERT OR UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.analyze_job_risk_and_moderation();

-- ---------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY POLICIES FOR TRUST & SAFETY TABLES
-- ---------------------------------------------------------------------

ALTER TABLE company_verification_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_agency_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE duplicate_job_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_signals ENABLE ROW LEVEL SECURITY;

-- company_verification_audits: STRICTLY ADMIN ONLY! (Sensitive review notes)
CREATE POLICY "Admins full access to verification audits" ON company_verification_audits
    FOR ALL USING (public.is_platform_admin());

-- company_agency_authorizations
CREATE POLICY "Public sees approved agency authorizations" ON company_agency_authorizations
    FOR SELECT USING (
        authorization_status = 'approved'
        OR public.is_member_of_company(company_id)
        OR public.is_member_of_agency(agency_id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Company members manage authorizations" ON company_agency_authorizations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- duplicate_job_candidates: Admins only
CREATE POLICY "Admins manage duplicate job reviews" ON duplicate_job_candidates
    FOR ALL USING (public.is_platform_admin());

-- candidate_reports
CREATE POLICY "Candidates can submit reports" ON candidate_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Candidates can view own submitted reports" ON candidate_reports
    FOR SELECT USING (
        reporter_id = auth.uid()
        OR public.is_platform_admin()
    );

CREATE POLICY "Admins manage candidate investigations" ON candidate_reports
    FOR ALL USING (public.is_platform_admin());

-- risk_signals: Internal to platform admins
CREATE POLICY "Admins view and manage risk signals" ON risk_signals
    FOR ALL USING (public.is_platform_admin());
