-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- PRODUCTION CONSOLIDATED DATABASE MIGRATION SCRIPT (ALL-IN-ONE)
-- Fully Idempotent, Safe for Supabase SQL Editor
-- Target: Supabase PostgreSQL (ap-south-1 Mumbai)
-- =====================================================================

-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 01: INITIAL DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL (15+)
-- Geographic Focus: Chakan MIDC, Khed City, Kuruli, Mahalunge, Pune Belt
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. HELPER FUNCTIONS & TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 3. GEOGRAPHY & INDUSTRIAL ZONING
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    state_id TEXT NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    district_id TEXT NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS industrial_clusters (
    id TEXT PRIMARY KEY,
    city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    pincode TEXT NOT NULL,
    zone TEXT NOT NULL,
    landmark TEXT NOT NULL,
    transit_access TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS industrial_estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id TEXT NOT NULL REFERENCES industrial_clusters(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    estate_type TEXT NOT NULL, -- 'MIDC Standard', 'Private Industrial Park', 'SEZ', 'Auto Cluster'
    midc_phase TEXT,           -- 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'SEZ'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS localities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id TEXT NOT NULL REFERENCES industrial_clusters(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    pincode TEXT NOT NULL
);

-- ---------------------------------------------------------------------
-- 4. AUTHENTICATION & CORE USER PROFILES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- Linked with auth.users(id)
    email TEXT UNIQUE,
    phone TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'mr' CHECK (preferred_language IN ('en', 'mr', 'hi')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'employer', 'agency', 'admin')),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);

CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT TRUE,
    notification_whatsapp BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 5. CANDIDATE MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    current_residence TEXT,
    highest_qualification TEXT NOT NULL,
    trade_specialization TEXT,
    diploma_specialization TEXT,
    total_experience_months INTEGER DEFAULT 0 CHECK (total_experience_months >= 0),
    current_designation TEXT,
    expected_salary_in_hand INTEGER CHECK (expected_salary_in_hand >= 0),
    ready_to_join_days INTEGER DEFAULT 0 CHECK (ready_to_join_days >= 0),
    profile_completion_percentage INTEGER DEFAULT 20 CHECK (profile_completion_percentage BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_candidate_profiles_modtime
    BEFORE UPDATE ON candidate_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS candidate_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    institution_name TEXT NOT NULL,
    degree_diploma TEXT NOT NULL,
    field_of_study TEXT,
    passing_year INTEGER CHECK (passing_year BETWEEN 1970 AND 2035),
    percentage_or_cgpa TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_edu_candidate_id ON candidate_education(candidate_id);

CREATE TABLE IF NOT EXISTS candidate_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    industrial_cluster TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    responsibilities TEXT,
    machines_operated TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_exp_candidate_id ON candidate_experience(candidate_id);

CREATE TABLE IF NOT EXISTS candidate_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'expert')),
    years_of_experience NUMERIC(3,1) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);

CREATE TABLE IF NOT EXISTS candidate_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_shifts TEXT[] DEFAULT '{}',
    preferred_clusters TEXT[] DEFAULT '{}',
    min_salary_in_hand INTEGER DEFAULT 0,
    bus_facility_required BOOLEAN DEFAULT FALSE,
    canteen_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL CHECK (file_size_bytes <= 10485760), -- Max 10MB
    mime_type TEXT DEFAULT 'application/pdf',
    is_default BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_resumes_candidate_id ON candidate_resumes(candidate_id);

-- ---------------------------------------------------------------------
-- 6. COMPANY MANAGEMENT & VERIFICATION
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cluster_id TEXT REFERENCES industrial_clusters(id) ON DELETE RESTRICT,
    specific_address TEXT NOT NULL,
    industry TEXT NOT NULL,
    employee_band TEXT NOT NULL CHECK (employee_band IN ('50-200', '200-500', '500-1500', '1500+')),
    direct_employer BOOLEAN DEFAULT TRUE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    udyam_registration_no TEXT,
    gstin TEXT,
    factory_license_no TEXT,
    verification_audit_date TIMESTAMPTZ,
    established_year INTEGER,
    description TEXT,
    facilities TEXT[] DEFAULT '{}',
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_companies_modtime
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_companies_cluster_id ON companies(cluster_id);
CREATE INDEX idx_companies_verification_status ON companies(verification_status);

CREATE TABLE IF NOT EXISTS company_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    cluster_id TEXT REFERENCES industrial_clusters(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_headquarters BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_locations_company_id ON company_locations(company_id);

CREATE TABLE IF NOT EXISTS company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL CHECK (member_role IN ('owner', 'recruiter', 'hiring_manager')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_company_member UNIQUE (company_id, user_id)
);

CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_company_members_company ON company_members(company_id);

CREATE TABLE IF NOT EXISTS company_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('gstin_cert', 'udyam_cert', 'midc_allotment', 'factory_license', 'other')),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_company_documents_company_id ON company_documents(company_id);

CREATE TABLE IF NOT EXISTS company_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'verified', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    change_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 7. RECRUITMENT AGENCIES & CONTRACTORS
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS recruitment_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    office_address TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agency_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES recruitment_agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL CHECK (member_role IN ('owner', 'recruiter')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_agency_member UNIQUE (agency_id, user_id)
);

CREATE TABLE IF NOT EXISTS agency_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES recruitment_agencies(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'revoked')),
    authorization_letter_path TEXT,
    valid_until DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_agency_company_auth UNIQUE (agency_id, company_id)
);

CREATE TABLE IF NOT EXISTS company_recruitment_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES recruitment_agencies(id) ON DELETE CASCADE,
    authorized_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 8. JOB CATEGORIES & VACANCIES
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS job_categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    posted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    agency_id UUID REFERENCES recruitment_agencies(id) ON DELETE SET NULL,
    cluster_id TEXT NOT NULL REFERENCES industrial_clusters(id) ON DELETE RESTRICT,
    specific_location TEXT NOT NULL,
    industry TEXT NOT NULL,
    category TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('Permanent / On-Roll', 'Contractual (Fixed Term)', 'NEEM / NAPS Trainee', 'Apprentice')),
    qualification_required TEXT NOT NULL,
    experience_required TEXT NOT NULL,
    shift_type TEXT NOT NULL,
    openings_count INTEGER DEFAULT 1 CHECK (openings_count > 0),
    
    -- Structured Salary Breakdown
    salary_in_hand_monthly INTEGER NOT NULL CHECK (salary_in_hand_monthly > 0),
    salary_gross_monthly INTEGER NOT NULL CHECK (salary_gross_monthly >= salary_in_hand_monthly),
    salary_pf_monthly INTEGER DEFAULT 0 CHECK (salary_pf_monthly >= 0),
    salary_esic_covered BOOLEAN DEFAULT TRUE,
    salary_ot_hourly_rate NUMERIC(6,2),
    salary_attendance_bonus INTEGER DEFAULT 0,
    salary_canteen_deduction INTEGER DEFAULT 0,
    
    -- Facilities
    bus_facility_provided BOOLEAN DEFAULT FALSE,
    bus_routes TEXT[] DEFAULT '{}',
    canteen_provided BOOLEAN DEFAULT FALSE,
    accommodation_help BOOLEAN DEFAULT FALSE,
    
    -- Walk-in Details
    walk_in_available BOOLEAN DEFAULT FALSE,
    walk_in_dates TEXT,
    walk_in_time TEXT,
    walk_in_venue TEXT,
    walk_in_contact_person TEXT,
    walk_in_contact_phone TEXT,
    walk_in_documents TEXT[] DEFAULT '{}',
    
    recruitment_tier TEXT DEFAULT 'verified_direct' CHECK (recruitment_tier IN ('verified_direct', 'verified_agency', 'verification_pending')),
    description TEXT NOT NULL,
    responsibilities TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    gender_preference TEXT DEFAULT 'All Eligible' CHECK (gender_preference IN ('All Eligible', 'Male', 'Female', 'Female Preferred for Assembly')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'under_moderation', 'closed', 'draft', 'archived')),
    
    last_confirmed_date DATE DEFAULT CURRENT_DATE,
    deadline_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_jobs_modtime
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for lightning-fast search & filtering
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_cluster_id ON jobs(cluster_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_qualification ON jobs(qualification_required);
CREATE INDEX idx_jobs_salary ON jobs(salary_in_hand_monthly);
CREATE INDEX idx_jobs_title_trgm ON jobs USING gin (title gin_trgm_ops);

CREATE TABLE IF NOT EXISTS candidate_saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_candidate_saved_job UNIQUE (candidate_id, job_id)
);

CREATE INDEX idx_saved_jobs_candidate ON candidate_saved_jobs(candidate_id);

CREATE TABLE IF NOT EXISTS job_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 9. APPLICATIONS & RECRUITMENT WORKFLOW
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES candidate_resumes(id) ON DELETE SET NULL,
    current_status TEXT DEFAULT 'Applied' CHECK (current_status IN (
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Selected',
        'Joined',
        'Rejected'
    )),
    interview_scheduled_date TIMESTAMPTZ,
    interview_venue TEXT,
    interviewer_notes TEXT,
    salary_offered TEXT,
    candidate_notes TEXT,
    applied_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_candidate_application UNIQUE (job_id, candidate_id)
);

CREATE TRIGGER update_applications_modtime
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_current_status ON applications(current_status);

CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_app_history_application_id ON application_status_history(application_id);

-- ---------------------------------------------------------------------
-- 10. ADMINISTRATION, MODERATION & PLATFORM AUDIT
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_audit_logs_target ON admin_audit_logs(target_type, target_id);
CREATE INDEX idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL CHECK (reason IN (
        'Fake Salary',
        'Demanded Money for Job',
        'Ghost Vacancy',
        'Unsafe Working Conditions',
        'Incorrect Location'
    )),
    details TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_moderation_actions_status ON moderation_actions(status);

CREATE TABLE IF NOT EXISTS platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 11. SUPABASE AUTH USER SYNCHRONIZATION TRIGGER
-- Automatically provisions profile and default role on registration
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role TEXT;
    raw_role TEXT;
    user_fullname TEXT;
    user_phone TEXT;
BEGIN
    raw_role := (NEW.raw_user_meta_data->>'role');
    user_fullname := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    user_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone');

    -- Safety check: Admin role CANNOT be self-assigned via registration metadata
    IF raw_role IN ('candidate', 'employer', 'agency') THEN
        default_role := raw_role;
    ELSE
        default_role := 'candidate';
    END IF;

    -- Insert profile
    INSERT INTO public.profiles (id, email, phone, full_name, preferred_language)
    VALUES (
        NEW.id,
        NEW.email,
        user_phone,
        user_fullname,
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'mr')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

    -- Insert user role
    INSERT INTO public.user_roles (user_id, role, is_primary)
    VALUES (NEW.id, default_role, TRUE)
    ON CONFLICT (user_id, role) DO NOTHING;

    -- If candidate, create candidate_profile stub
    IF default_role = 'candidate' THEN
        INSERT INTO public.candidate_profiles (
            user_id,
            highest_qualification,
            profile_completion_percentage
        )
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'highest_qualification', '10th / 12th'),
            25
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ---------------------------------------------------------------------
-- NEXT MODULE
-- ---------------------------------------------------------------------

-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 02: ROW LEVEL SECURITY (RLS) POLICIES
-- Target Database: Supabase PostgreSQL (15+)
-- Strict Multi-Tenant Isolation & Role Boundaries
-- =====================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS FOR RLS EVALUATION
-- These functions run with elevated privileges to check memberships without recursion

CREATE OR REPLACE FUNCTION public.current_user_has_role(check_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = auth.uid()
          AND role = check_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.current_user_has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_member_of_company(comp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.company_members
        WHERE company_id = comp_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_member_of_agency(ag_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.agency_members
        WHERE agency_id = ag_id
          AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_candidate_id_for_user()
RETURNS UUID AS $$
DECLARE
    cid UUID;
BEGIN
    SELECT id INTO cid
    FROM public.candidate_profiles
    WHERE user_id = auth.uid()
    LIMIT 1;
    RETURN cid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ---------------------------------------------------------------------
-- 2. ENABLE RLS ON ALL TABLES
-- ---------------------------------------------------------------------

ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial_estates ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_saved_jobs ENABLE ROW LEVEL SECURITY;

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_verification_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE recruitment_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_recruitment_relationships ENABLE ROW LEVEL SECURITY;

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 3. PUBLIC & REFERENCE GEOGRAPHY POLICIES
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow public read access to states" ON states;
CREATE POLICY "Allow public read access to states" ON states FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to districts" ON districts;
CREATE POLICY "Allow public read access to districts" ON districts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to cities" ON cities;
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to clusters" ON industrial_clusters;
CREATE POLICY "Allow public read access to clusters" ON industrial_clusters FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to estates" ON industrial_estates;
CREATE POLICY "Allow public read access to estates" ON industrial_estates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to localities" ON localities;
CREATE POLICY "Allow public read access to localities" ON localities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to categories" ON job_categories;
CREATE POLICY "Allow public read access to categories" ON job_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public read access to platform settings" ON platform_settings;
CREATE POLICY "Allow public read access to platform settings" ON platform_settings FOR SELECT USING (true);

-- Admin mutation of reference data
DROP POLICY IF EXISTS "Admin manage states" ON states;
CREATE POLICY "Admin manage states" ON states FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage districts" ON districts;
CREATE POLICY "Admin manage districts" ON districts FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage cities" ON cities;
CREATE POLICY "Admin manage cities" ON cities FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage clusters" ON industrial_clusters;
CREATE POLICY "Admin manage clusters" ON industrial_clusters FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage estates" ON industrial_estates;
CREATE POLICY "Admin manage estates" ON industrial_estates FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage localities" ON localities;
CREATE POLICY "Admin manage localities" ON localities FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage categories" ON job_categories;
CREATE POLICY "Admin manage categories" ON job_categories FOR ALL USING (public.is_platform_admin());
DROP POLICY IF EXISTS "Admin manage platform settings" ON platform_settings;
CREATE POLICY "Admin manage platform settings" ON platform_settings FOR ALL USING (public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 4. PROFILES & USER ROLES POLICIES
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR public.is_platform_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow profile insertion by auth trigger or self" ON profiles;
CREATE POLICY "Allow profile insertion by auth trigger or self" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR public.is_platform_admin());

DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles" ON user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.is_platform_admin());

DROP POLICY IF EXISTS "Only admin or system can manage roles" ON user_roles;
CREATE POLICY "Only admin or system can manage roles" ON user_roles
    FOR ALL USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Users can view and manage own preferences" ON user_preferences;
CREATE POLICY "Users can view and manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 5. CANDIDATE PROFILE & SUBSIDIARY POLICIES
-- ---------------------------------------------------------------------

-- Candidate Profile: Candidate sees self; Admins see all; Employers see candidate IF candidate applied to their job
DROP POLICY IF EXISTS "Candidate views own profile" ON candidate_profiles;
CREATE POLICY "Candidate views own profile" ON candidate_profiles
    FOR SELECT USING (
        auth.uid() = user_id 
        OR public.is_platform_admin()
        OR EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE a.candidate_id = candidate_profiles.id
              AND cm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidate manages own profile" ON candidate_profiles;
CREATE POLICY "Candidate manages own profile" ON candidate_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Candidate Education
DROP POLICY IF EXISTS "Candidate education access" ON candidate_education;
CREATE POLICY "Candidate education access" ON candidate_education
    FOR SELECT USING (
        candidate_id = public.get_candidate_id_for_user()
        OR public.is_platform_admin()
        OR EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE a.candidate_id = candidate_education.candidate_id
              AND cm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidate manages own education" ON candidate_education;
CREATE POLICY "Candidate manages own education" ON candidate_education
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Experience
DROP POLICY IF EXISTS "Candidate experience access" ON candidate_experience;
CREATE POLICY "Candidate experience access" ON candidate_experience
    FOR SELECT USING (
        candidate_id = public.get_candidate_id_for_user()
        OR public.is_platform_admin()
        OR EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE a.candidate_id = candidate_experience.candidate_id
              AND cm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidate manages own experience" ON candidate_experience;
CREATE POLICY "Candidate manages own experience" ON candidate_experience
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Skills
DROP POLICY IF EXISTS "Candidate skills access" ON candidate_skills;
CREATE POLICY "Candidate skills access" ON candidate_skills
    FOR SELECT USING (
        candidate_id = public.get_candidate_id_for_user()
        OR public.is_platform_admin()
        OR EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE a.candidate_id = candidate_skills.candidate_id
              AND cm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidate manages own skills" ON candidate_skills;
CREATE POLICY "Candidate manages own skills" ON candidate_skills
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Preferences
DROP POLICY IF EXISTS "Candidate manages own preferences" ON candidate_preferences;
CREATE POLICY "Candidate manages own preferences" ON candidate_preferences
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Resumes (Strict Privacy!)
DROP POLICY IF EXISTS "Candidate resume metadata access" ON candidate_resumes;
CREATE POLICY "Candidate resume metadata access" ON candidate_resumes
    FOR SELECT USING (
        candidate_id = public.get_candidate_id_for_user()
        OR public.is_platform_admin()
        OR EXISTS (
            SELECT 1 FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE a.candidate_id = candidate_resumes.candidate_id
              AND cm.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Candidate manages own resumes" ON candidate_resumes;
CREATE POLICY "Candidate manages own resumes" ON candidate_resumes
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Saved Jobs
DROP POLICY IF EXISTS "Candidate manages saved jobs" ON candidate_saved_jobs;
CREATE POLICY "Candidate manages saved jobs" ON candidate_saved_jobs
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- ---------------------------------------------------------------------
-- 6. COMPANY MANAGEMENT POLICIES
-- ---------------------------------------------------------------------

-- Companies: Public sees verified companies; Members and Admins see all
DROP POLICY IF EXISTS "Public sees verified companies" ON companies;
CREATE POLICY "Public sees verified companies" ON companies
    FOR SELECT USING (
        verification_status = 'verified'
        OR public.is_member_of_company(id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Authenticated users can create companies" ON companies;
CREATE POLICY "Authenticated users can create companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Company members or admins can update company" ON companies;
CREATE POLICY "Company members or admins can update company" ON companies
    FOR UPDATE USING (
        public.is_member_of_company(id)
        OR public.is_platform_admin()
    );

-- Company Locations: Public can read locations of verified companies
DROP POLICY IF EXISTS "Public reads company locations" ON company_locations;
CREATE POLICY "Public reads company locations" ON company_locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM companies c 
            WHERE c.id = company_locations.company_id 
              AND (c.verification_status = 'verified' OR public.is_member_of_company(c.id) OR public.is_platform_admin())
        )
    );

DROP POLICY IF EXISTS "Company members manage locations" ON company_locations;
CREATE POLICY "Company members manage locations" ON company_locations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- Company Members: Visible to fellow members and admin
DROP POLICY IF EXISTS "Company members access" ON company_members;
CREATE POLICY "Company members access" ON company_members
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company owner or admin manages members" ON company_members;
CREATE POLICY "Company owner or admin manages members" ON company_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM company_members cm
            WHERE cm.company_id = company_members.company_id
              AND cm.user_id = auth.uid()
              AND cm.member_role = 'owner'
        )
        OR public.is_platform_admin()
        OR auth.uid() = user_id -- Allow initial member creation on company onboarding
    );

-- Company Documents: Strictly restricted to company members and admin
DROP POLICY IF EXISTS "Company documents access" ON company_documents;
CREATE POLICY "Company documents access" ON company_documents
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company members upload documents" ON company_documents;
CREATE POLICY "Company members upload documents" ON company_documents
    FOR INSERT WITH CHECK (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company owner or admin deletes documents" ON company_documents;
CREATE POLICY "Company owner or admin deletes documents" ON company_documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM company_members cm
            WHERE cm.company_id = company_documents.company_id
              AND cm.user_id = auth.uid()
              AND cm.member_role = 'owner'
        )
        OR public.is_platform_admin()
    );

-- Company Verifications: Restricted to members and admin
DROP POLICY IF EXISTS "Company verifications select" ON company_verifications;
CREATE POLICY "Company verifications select" ON company_verifications
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company verifications update by admin only" ON company_verifications;
CREATE POLICY "Company verifications update by admin only" ON company_verifications
    FOR UPDATE USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Company verification history select" ON company_verification_history;
CREATE POLICY "Company verification history select" ON company_verification_history
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- ---------------------------------------------------------------------
-- 7. RECRUITMENT AGENCIES POLICIES
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Public sees verified agencies" ON recruitment_agencies;
CREATE POLICY "Public sees verified agencies" ON recruitment_agencies
    FOR SELECT USING (
        verification_status = 'verified'
        OR public.is_member_of_agency(id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Authenticated users create agencies" ON recruitment_agencies;
CREATE POLICY "Authenticated users create agencies" ON recruitment_agencies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Agency members update agency" ON recruitment_agencies;
CREATE POLICY "Agency members update agency" ON recruitment_agencies
    FOR UPDATE USING (
        public.is_member_of_agency(id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Agency members access" ON agency_members;
CREATE POLICY "Agency members access" ON agency_members
    FOR SELECT USING (
        public.is_member_of_agency(agency_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Agency owner or admin manages agency members" ON agency_members;
CREATE POLICY "Agency owner or admin manages agency members" ON agency_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM agency_members am
            WHERE am.agency_id = agency_members.agency_id
              AND am.user_id = auth.uid()
              AND am.member_role = 'owner'
        )
        OR public.is_platform_admin()
        OR auth.uid() = user_id
    );

DROP POLICY IF EXISTS "Agency authorizations access" ON agency_authorizations;
CREATE POLICY "Agency authorizations access" ON agency_authorizations
    FOR SELECT USING (
        public.is_member_of_agency(agency_id)
        OR public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company owner manages agency authorizations" ON agency_authorizations;
CREATE POLICY "Company owner manages agency authorizations" ON agency_authorizations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- ---------------------------------------------------------------------
-- 8. JOBS & VACANCIES POLICIES
-- ---------------------------------------------------------------------

-- Public reads active jobs; Employers read their company's jobs (even draft/closed); Admins read all
DROP POLICY IF EXISTS "Public reads active jobs" ON jobs;
CREATE POLICY "Public reads active jobs" ON jobs
    FOR SELECT USING (
        status = 'active'
        OR public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company members and authorized agencies create jobs" ON jobs;
CREATE POLICY "Company members and authorized agencies create jobs" ON jobs
    FOR INSERT WITH CHECK (
        public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company members and authorized agencies update jobs" ON jobs;
CREATE POLICY "Company members and authorized agencies update jobs" ON jobs
    FOR UPDATE USING (
        public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company members delete jobs" ON jobs;
CREATE POLICY "Company members delete jobs" ON jobs
    FOR DELETE USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Job status history access" ON job_status_history;
CREATE POLICY "Job status history access" ON job_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = job_status_history.job_id
              AND (public.is_member_of_company(j.company_id) OR public.is_platform_admin())
        )
    );

-- ---------------------------------------------------------------------
-- 9. APPLICATIONS POLICIES
-- ---------------------------------------------------------------------

-- Candidate sees own applications; Employer sees applications for their company; Admin sees all
DROP POLICY IF EXISTS "Candidate views own applications" ON applications;
CREATE POLICY "Candidate views own applications" ON applications
    FOR SELECT USING (
        candidate_id = public.get_candidate_id_for_user()
        OR EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = applications.job_id
              AND public.is_member_of_company(j.company_id)
        )
        OR (
            EXISTS (
                SELECT 1 FROM jobs j
                WHERE j.id = applications.job_id
                  AND j.agency_id IS NOT NULL
                  AND public.is_member_of_agency(j.agency_id)
            )
        )
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Candidate submits application" ON applications;
CREATE POLICY "Candidate submits application" ON applications
    FOR INSERT WITH CHECK (
        candidate_id = public.get_candidate_id_for_user()
    );

DROP POLICY IF EXISTS "Employer updates application status" ON applications;
CREATE POLICY "Employer updates application status" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs j
            WHERE j.id = applications.job_id
              AND public.is_member_of_company(j.company_id)
        )
        OR (
            EXISTS (
                SELECT 1 FROM jobs j
                WHERE j.id = applications.job_id
                  AND j.agency_id IS NOT NULL
                  AND public.is_member_of_agency(j.agency_id)
            )
        )
        OR public.is_platform_admin()
        OR candidate_id = public.get_candidate_id_for_user()
    );

DROP POLICY IF EXISTS "Application status history access" ON application_status_history;
CREATE POLICY "Application status history access" ON application_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications a
            WHERE a.id = application_status_history.application_id
              AND (
                  a.candidate_id = public.get_candidate_id_for_user()
                  OR EXISTS (
                      SELECT 1 FROM jobs j
                      WHERE j.id = a.job_id AND public.is_member_of_company(j.company_id)
                  )
                  OR public.is_platform_admin()
              )
        )
    );

-- ---------------------------------------------------------------------
-- 10. ADMINISTRATION & MODERATION POLICIES
-- ---------------------------------------------------------------------

DROP POLICY IF EXISTS "Admin audit logs viewable only by admins" ON admin_audit_logs;
CREATE POLICY "Admin audit logs viewable only by admins" ON admin_audit_logs
    FOR SELECT USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Admin audit logs insertable by admins or triggers" ON admin_audit_logs;
CREATE POLICY "Admin audit logs insertable by admins or triggers" ON admin_audit_logs
    FOR INSERT WITH CHECK (public.is_platform_admin());

-- Moderation Reports
DROP POLICY IF EXISTS "Authenticated users submit moderation reports" ON moderation_actions;
CREATE POLICY "Authenticated users submit moderation reports" ON moderation_actions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users view own submitted reports or admins view all" ON moderation_actions;
CREATE POLICY "Users view own submitted reports or admins view all" ON moderation_actions
    FOR SELECT USING (
        reported_by = auth.uid()
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Admins manage moderation reports" ON moderation_actions;
CREATE POLICY "Admins manage moderation reports" ON moderation_actions
    FOR UPDATE USING (public.is_platform_admin());


-- ---------------------------------------------------------------------
-- NEXT MODULE
-- ---------------------------------------------------------------------


-- STORAGE BUCKETS INITIALIZATION
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES 
        ('resumes', 'resumes', FALSE, 10485760, ARRAY['application/pdf']),
        ('verification-docs', 'verification-docs', FALSE, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
        ('company-documents', 'company-documents', FALSE, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
    ON CONFLICT (id) DO UPDATE SET
        public = EXCLUDED.public,
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Storage buckets notice: %', SQLERRM;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Candidate upload own resume" ON storage.objects;
    CREATE POLICY "Candidate upload own resume" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'resumes'
            AND auth.uid() IS NOT NULL
            AND (storage.foldername(name))[1] = auth.uid()::text
        );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Candidate, authorized employer and admin read resume" ON storage.objects;
    CREATE POLICY "Candidate, authorized employer and admin read resume" ON storage.objects
        FOR SELECT USING (
            bucket_id = 'resumes'
            AND (
                (storage.foldername(name))[1] = auth.uid()::text
                OR public.is_platform_admin()
                OR EXISTS (
                    SELECT 1 
                    FROM public.candidate_profiles cp
                    JOIN public.applications a ON a.candidate_id = cp.id
                    JOIN public.jobs j ON j.id = a.job_id
                    WHERE cp.user_id::text = (storage.foldername(name))[1]
                      AND public.is_member_of_company(j.company_id)
                )
            )
        );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Employer upload verification docs" ON storage.objects;
    CREATE POLICY "Employer upload verification docs" ON storage.objects
        FOR INSERT WITH CHECK (
            (bucket_id = 'verification-docs' OR bucket_id = 'company-documents')
            AND auth.uid() IS NOT NULL
        );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Company members and admin read verification docs" ON storage.objects;
    CREATE POLICY "Company members and admin read verification docs" ON storage.objects
        FOR SELECT USING (
            (bucket_id = 'verification-docs' OR bucket_id = 'company-documents')
            AND (
                public.is_platform_admin()
                OR public.is_member_of_company((storage.foldername(name))[1]::uuid)
            )
        );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ---------------------------------------------------------------------
-- NEXT MODULE
-- ---------------------------------------------------------------------

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


-- ---------------------------------------------------------------------
-- NEXT MODULE
-- ---------------------------------------------------------------------

-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 05: SEED MANUFACTURING COMPANIES & INDUSTRIAL VACANCIES
-- =====================================================================

-- 1. SEED COMPANIES
INSERT INTO companies (
    id,
    name,
    slug,
    cluster_id,
    specific_address,
    industry,
    employee_band,
    direct_employer,
    verification_status,
    udyam_registration_no,
    gstin,
    factory_license_no,
    verification_audit_date,
    established_year,
    description,
    facilities,
    contact_email,
    contact_phone
)
VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Sahyadri Precision Auto-Tech Ltd.',
    'sahyadri-precision-autotech',
    'chakan-phase-1',
    'Plot A-42/1, Chakan MIDC Phase 1, Near Bajaj Auto Gate, Pune 410501',
    'Auto Components Tier-1',
    '500-1500',
    TRUE,
    'verified',
    'UDYAM-MH-26-0045129',
    '27AAACS1234F1Z5',
    'PUN/FAC/2012/8841',
    '2026-02-15 00:00:00+00',
    2008,
    'Leading tier-1 supplier of transmission gears, CNC machined crankshafts, and automotive engine sub-assemblies for domestic and export OEMs.',
    ARRAY['Subsidized Canteen (₹12/meal)', 'Free Bus Facility (Bhosari, Nigdi, Moshi, Rajgurunagar)', 'ESIC & Group Mediclaim', 'Performance Attendance Bonus'],
    'careers@sahyadripolymers.demo',
    '+91 2135 258900'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Indo-German Tool & Pressings Corp.',
    'indo-german-tool-pressings',
    'chakan-phase-2',
    'Gat No. 342, Sawardari-Vasuli Road, Chakan MIDC Phase 2, Pune 410501',
    'Press & Stamping',
    '200-500',
    TRUE,
    'verified',
    'UDYAM-MH-26-0012894',
    '27AABCI9876K1ZQ',
    'PUN/FAC/2015/4412',
    '2026-02-28 00:00:00+00',
    2014,
    'Specialized press shop running 400T to 1200T mechanical & hydraulic presses, progressive tooling, and robotic MIG welding lines for automotive chassis.',
    ARRAY['Tea & Breakfast Provided', 'Bus Route from Chakan Ambethan Chowk & Khed', 'Overtime Double Rate (Factory Act)'],
    'recruitment@indogermantools.demo',
    '+91 2135 264100'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Sparkline Electric Drives Pvt. Ltd.',
    'sparkline-electric-drives',
    'khed-city',
    'Plot E-12, Sector 2, Khed City SEZ, Taluka Khed, Pune 410505',
    'Electronics & Electricals',
    '200-500',
    TRUE,
    'verified',
    'UDYAM-MH-26-0099412',
    '27AACCS4567M1ZR',
    'PUN/FAC/2020/9981',
    '2026-03-01 00:00:00+00',
    2019,
    'Next-generation manufacturer of EV traction motors, battery management wiring harnesses, and high-voltage power distribution units.',
    ARRAY['Air-conditioned Cleanroom Assembly', 'Staff Van Pick-up from Bhosari & Narayangaon', 'Subsidized Canteen', 'Quarterly Skill Incentives'],
    'jobs@sparklinedrives.demo',
    '+91 2135 670010'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    verification_status = EXCLUDED.verification_status,
    facilities = EXCLUDED.facilities;

-- 2. SEED SYSTEM ADMIN PROFILE (Placeholder to allow foreign key references for posted_by)
-- This user is a system placeholder; real users get registered through Supabase Auth
INSERT INTO profiles (id, email, phone, full_name, preferred_language, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'system.recruiter@udyogsetu.internal',
    '+91 98900 00000',
    'UdyogSetu Verified Plant HR Desk',
    'en',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_roles (user_id, role, is_primary)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'employer', TRUE),
    ('00000000-0000-0000-0000-000000000001', 'admin', FALSE)
ON CONFLICT (user_id, role) DO NOTHING;

-- Associate system recruiter with seeded companies
INSERT INTO company_members (company_id, user_id, member_role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'owner'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'owner'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'owner')
ON CONFLICT (company_id, user_id) DO NOTHING;

-- 3. SEED INDUSTRIAL VACANCIES
INSERT INTO jobs (
    id,
    title,
    company_id,
    posted_by,
    cluster_id,
    specific_location,
    industry,
    category,
    employment_type,
    qualification_required,
    experience_required,
    shift_type,
    openings_count,
    salary_in_hand_monthly,
    salary_gross_monthly,
    salary_pf_monthly,
    salary_esic_covered,
    salary_ot_hourly_rate,
    salary_attendance_bonus,
    salary_canteen_deduction,
    bus_facility_provided,
    bus_routes,
    canteen_provided,
    accommodation_help,
    walk_in_available,
    walk_in_dates,
    walk_in_time,
    walk_in_venue,
    walk_in_contact_person,
    walk_in_contact_phone,
    walk_in_documents,
    recruitment_tier,
    description,
    responsibilities,
    required_skills,
    gender_preference,
    status
)
VALUES 
(
    'a1111111-1111-1111-1111-111111111111',
    'VMC Machine Operator (Fanuc / Siemens Controls)',
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'chakan-phase-1',
    'Chakan MIDC Phase 1, Near Bajaj Gate',
    'Auto Components Tier-1',
    'Machining & CNC',
    'Permanent / On-Roll',
    'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    '1 - 3 Years',
    'Rotational 3-Shifts (A/B/C)',
    8,
    18500,
    22400,
    1800,
    TRUE,
    115.00,
    1500,
    350,
    TRUE,
    ARRAY['Bhosari - Moshi - Chakan', 'Nigdi - Talwade - Mahalunge', 'Rajgurunagar - Chakan'],
    TRUE,
    FALSE,
    TRUE,
    'Mon - Sat (Regular)',
    '9:00 AM - 1:00 PM',
    'Gate No. 2, Security Office, Sahyadri Precision Auto-Tech Ltd, Chakan Phase 1',
    'Mr. Santosh Patil (HR Executive)',
    '+91 98901 22334',
    ARRAY['Updated Resume / Biodata', 'Aadhaar Card original & 2 photocopies', 'ITI Passing Certificate / Marksheet', 'Bank Passbook / Cancelled Cheque', '2 Passport size photos'],
    'verified_direct',
    'Immediate openings for skilled Vertical Machining Center (VMC) machine operators for precision machining of automotive transmission cases and cylinder heads.',
    ARRAY['Set up and operate 3-axis and 4-axis VMC machines (Fanuc & Siemens 828D controls).', 'Load raw aluminum die castings and execute G-code programs.', 'Perform routine tool offset corrections and wear compensations.', 'Inspect machined parts using Vernier calipers, micrometers, and bore gauges.'],
    ARRAY['VMC Operation', 'Fanuc Controller', 'Tool Offset Setting', 'Vernier Caliper & Micrometer', 'Blueprint Reading'],
    'All Eligible',
    'active'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'MIG / CO2 Welder (Automotive Chassis & Exhaust)',
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'chakan-phase-2',
    'Chakan MIDC Phase 2, Sawardari Road',
    'Press & Stamping',
    'Welding & Fabrication',
    'Permanent / On-Roll',
    'ITI (Fitter/Machinist/Turner/Welder/Electrician)',
    '1 - 3 Years',
    'Rotational 3-Shifts (A/B/C)',
    12,
    19200,
    23500,
    1800,
    TRUE,
    120.00,
    2000,
    300,
    TRUE,
    ARRAY['Chakan Ambethan Chowk - Sawardari', 'Khed - Chakan Phata'],
    TRUE,
    TRUE,
    TRUE,
    'Daily Walk-In Drive',
    '10:00 AM - 3:00 PM',
    'Indo-German Tool & Pressings Corp, Gat No. 342, Sawardari, Chakan Phase 2',
    'Mr. Dnyaneshwar Gorde (Plant HR)',
    '+91 98223 88990',
    ARRAY['Aadhaar Card', 'ITI Welder Certificate / Apprenticeship Card', 'Previous Company Relieving Letter', 'Bank Account Details'],
    'verified_direct',
    'Urgent requirement for qualified MIG/CO2 Welders for heavy automotive chassis sub-frames and robotic welding cell auxiliary operations.',
    ARRAY['Perform continuous MIG/MAG/CO2 welding on mild steel (MS) sheet metal assemblies ranging from 2.5mm to 6mm.', 'Clean spatter, inspect weld penetration, and check alignment using welding fixtures.', 'Adhere to shopfloor safety norms (welding helmet, leather apron, safety boots).'],
    ARRAY['MIG Welding', 'CO2 Welding', 'WPS Standards', 'Fixture Clamping', 'Weld Bead Inspection'],
    'All Eligible',
    'active'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'EV Battery Pack Assembly Technician',
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'khed-city',
    'Sector 2, Khed City SEZ, Rajgurunagar',
    'Electronics & Electricals',
    'Assembly & Line',
    'Permanent / On-Roll',
    'Diploma (Mechanical/Auto/Electrical)',
    '6m - 1 Year',
    'Day Shift Only',
    6,
    17500,
    20800,
    1800,
    TRUE,
    100.00,
    1200,
    250,
    TRUE,
    ARRAY['Bhosari - Chakan - Khed City SEZ', 'Rajgurunagar - Khed City Gate'],
    TRUE,
    FALSE,
    FALSE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY['Resume', 'Diploma Certificate', 'Aadhaar Card'],
    'verified_direct',
    'Join our cleanroom EV powertrain assembly team. You will be assembling battery modules, connecting high-voltage busbars, and conducting end-of-line electrical testing.',
    ARRAY['Assemble lithium-ion cylindrical/prismatic cell modules according to standard SOPs.', 'Operate automated ultrasonic spot welders and torque-controlled screwdrivers.', 'Perform insulation resistance (Megger) and Hi-Pot electrical safety checks.'],
    ARRAY['Battery Pack Assembly', 'High Voltage Safety', 'Torque Tightening', 'Multimeter & Megger', 'SOP Compliance'],
    'Female Preferred for Assembly',
    'active'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    openings_count = EXCLUDED.openings_count,
    salary_in_hand_monthly = EXCLUDED.salary_in_hand_monthly;


-- ---------------------------------------------------------------------
-- NEXT MODULE
-- ---------------------------------------------------------------------

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
DROP POLICY IF EXISTS "Admins full access to verification audits" ON company_verification_audits;
CREATE POLICY "Admins full access to verification audits" ON company_verification_audits
    FOR ALL USING (public.is_platform_admin());

-- company_agency_authorizations
DROP POLICY IF EXISTS "Public sees approved agency authorizations" ON company_agency_authorizations;
CREATE POLICY "Public sees approved agency authorizations" ON company_agency_authorizations
    FOR SELECT USING (
        authorization_status = 'approved'
        OR public.is_member_of_company(company_id)
        OR public.is_member_of_agency(agency_id)
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Company members manage authorizations" ON company_agency_authorizations;
CREATE POLICY "Company members manage authorizations" ON company_agency_authorizations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- duplicate_job_candidates: Admins only
DROP POLICY IF EXISTS "Admins manage duplicate job reviews" ON duplicate_job_candidates;
CREATE POLICY "Admins manage duplicate job reviews" ON duplicate_job_candidates
    FOR ALL USING (public.is_platform_admin());

-- candidate_reports
DROP POLICY IF EXISTS "Candidates can submit reports" ON candidate_reports;
CREATE POLICY "Candidates can submit reports" ON candidate_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Candidates can view own submitted reports" ON candidate_reports;
CREATE POLICY "Candidates can view own submitted reports" ON candidate_reports
    FOR SELECT USING (
        reporter_id = auth.uid()
        OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Admins manage candidate investigations" ON candidate_reports;
CREATE POLICY "Admins manage candidate investigations" ON candidate_reports
    FOR ALL USING (public.is_platform_admin());

-- risk_signals: Internal to platform admins
DROP POLICY IF EXISTS "Admins view and manage risk signals" ON risk_signals;
CREATE POLICY "Admins view and manage risk signals" ON risk_signals
    FOR ALL USING (public.is_platform_admin());
