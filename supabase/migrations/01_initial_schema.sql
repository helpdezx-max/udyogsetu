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
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
