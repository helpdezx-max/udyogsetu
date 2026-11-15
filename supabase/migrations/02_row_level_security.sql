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

CREATE POLICY "Allow public read access to states" ON states FOR SELECT USING (true);
CREATE POLICY "Allow public read access to districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to clusters" ON industrial_clusters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to estates" ON industrial_estates FOR SELECT USING (true);
CREATE POLICY "Allow public read access to localities" ON localities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON job_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to platform settings" ON platform_settings FOR SELECT USING (true);

-- Admin mutation of reference data
CREATE POLICY "Admin manage states" ON states FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage districts" ON districts FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage cities" ON cities FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage clusters" ON industrial_clusters FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage estates" ON industrial_estates FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage localities" ON localities FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage categories" ON job_categories FOR ALL USING (public.is_platform_admin());
CREATE POLICY "Admin manage platform settings" ON platform_settings FOR ALL USING (public.is_platform_admin());

-- ---------------------------------------------------------------------
-- 4. PROFILES & USER ROLES POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR public.is_platform_admin());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile insertion by auth trigger or self" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR public.is_platform_admin());

CREATE POLICY "Users can view own roles" ON user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.is_platform_admin());

CREATE POLICY "Only admin or system can manage roles" ON user_roles
    FOR ALL USING (public.is_platform_admin());

CREATE POLICY "Users can view and manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 5. CANDIDATE PROFILE & SUBSIDIARY POLICIES
-- ---------------------------------------------------------------------

-- Candidate Profile: Candidate sees self; Admins see all; Employers see candidate IF candidate applied to their job
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

CREATE POLICY "Candidate manages own profile" ON candidate_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Candidate Education
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

CREATE POLICY "Candidate manages own education" ON candidate_education
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Experience
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

CREATE POLICY "Candidate manages own experience" ON candidate_experience
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Skills
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

CREATE POLICY "Candidate manages own skills" ON candidate_skills
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Preferences
CREATE POLICY "Candidate manages own preferences" ON candidate_preferences
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Resumes (Strict Privacy!)
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

CREATE POLICY "Candidate manages own resumes" ON candidate_resumes
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- Candidate Saved Jobs
CREATE POLICY "Candidate manages saved jobs" ON candidate_saved_jobs
    FOR ALL USING (candidate_id = public.get_candidate_id_for_user());

-- ---------------------------------------------------------------------
-- 6. COMPANY MANAGEMENT POLICIES
-- ---------------------------------------------------------------------

-- Companies: Public sees verified companies; Members and Admins see all
CREATE POLICY "Public sees verified companies" ON companies
    FOR SELECT USING (
        verification_status = 'verified'
        OR public.is_member_of_company(id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Authenticated users can create companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Company members or admins can update company" ON companies
    FOR UPDATE USING (
        public.is_member_of_company(id)
        OR public.is_platform_admin()
    );

-- Company Locations: Public can read locations of verified companies
CREATE POLICY "Public reads company locations" ON company_locations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM companies c 
            WHERE c.id = company_locations.company_id 
              AND (c.verification_status = 'verified' OR public.is_member_of_company(c.id) OR public.is_platform_admin())
        )
    );

CREATE POLICY "Company members manage locations" ON company_locations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- Company Members: Visible to fellow members and admin
CREATE POLICY "Company members access" ON company_members
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

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
CREATE POLICY "Company documents access" ON company_documents
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Company members upload documents" ON company_documents
    FOR INSERT WITH CHECK (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

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
CREATE POLICY "Company verifications select" ON company_verifications
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Company verifications update by admin only" ON company_verifications
    FOR UPDATE USING (public.is_platform_admin());

CREATE POLICY "Company verification history select" ON company_verification_history
    FOR SELECT USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- ---------------------------------------------------------------------
-- 7. RECRUITMENT AGENCIES POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Public sees verified agencies" ON recruitment_agencies
    FOR SELECT USING (
        verification_status = 'verified'
        OR public.is_member_of_agency(id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Authenticated users create agencies" ON recruitment_agencies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Agency members update agency" ON recruitment_agencies
    FOR UPDATE USING (
        public.is_member_of_agency(id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Agency members access" ON agency_members
    FOR SELECT USING (
        public.is_member_of_agency(agency_id)
        OR public.is_platform_admin()
    );

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

CREATE POLICY "Agency authorizations access" ON agency_authorizations
    FOR SELECT USING (
        public.is_member_of_agency(agency_id)
        OR public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

CREATE POLICY "Company owner manages agency authorizations" ON agency_authorizations
    FOR ALL USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

-- ---------------------------------------------------------------------
-- 8. JOBS & VACANCIES POLICIES
-- ---------------------------------------------------------------------

-- Public reads active jobs; Employers read their company's jobs (even draft/closed); Admins read all
CREATE POLICY "Public reads active jobs" ON jobs
    FOR SELECT USING (
        status = 'active'
        OR public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

CREATE POLICY "Company members and authorized agencies create jobs" ON jobs
    FOR INSERT WITH CHECK (
        public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

CREATE POLICY "Company members and authorized agencies update jobs" ON jobs
    FOR UPDATE USING (
        public.is_member_of_company(company_id)
        OR (agency_id IS NOT NULL AND public.is_member_of_agency(agency_id))
        OR public.is_platform_admin()
    );

CREATE POLICY "Company members delete jobs" ON jobs
    FOR DELETE USING (
        public.is_member_of_company(company_id)
        OR public.is_platform_admin()
    );

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

CREATE POLICY "Candidate submits application" ON applications
    FOR INSERT WITH CHECK (
        candidate_id = public.get_candidate_id_for_user()
    );

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

CREATE POLICY "Admin audit logs viewable only by admins" ON admin_audit_logs
    FOR SELECT USING (public.is_platform_admin());

CREATE POLICY "Admin audit logs insertable by admins or triggers" ON admin_audit_logs
    FOR INSERT WITH CHECK (public.is_platform_admin());

-- Moderation Reports
CREATE POLICY "Authenticated users submit moderation reports" ON moderation_actions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users view own submitted reports or admins view all" ON moderation_actions
    FOR SELECT USING (
        reported_by = auth.uid()
        OR public.is_platform_admin()
    );

CREATE POLICY "Admins manage moderation reports" ON moderation_actions
    FOR UPDATE USING (public.is_platform_admin());
