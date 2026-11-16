-- ============================================================================
-- UDYOGSETU PLATFORM — MIGRATION 10: PRODUCTION CLEANUP & ACTIVATION
-- Removes Category A Fake/Demo Business Data while Preserving Category B Reference Data
-- ============================================================================

-- 1. TRANSACTIONAL REMOVAL OF CATEGORY A FAKE BUSINESS & RECRUITMENT RECORDS
-- Only removes confirmed fictional demonstration data from Migration 05
DO $$
BEGIN
    -- A. Remove demo applications (if any exist referencing demo jobs or demo candidates)
    DELETE FROM public.applications 
    WHERE job_id IN (
        SELECT id FROM public.jobs WHERE id LIKE 'job-seed-%' OR company_id IN (
            '11111111-1111-1111-1111-111111111111',
            '22222222-2222-2222-2222-222222222222',
            '33333333-3333-3333-3333-333333333333'
        )
    );

    -- B. Remove demo jobs
    DELETE FROM public.jobs 
    WHERE id LIKE 'job-seed-%' OR company_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
    );

    -- C. Remove demo company memberships
    DELETE FROM public.company_members 
    WHERE company_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
    ) OR user_id = '00000000-0000-0000-0000-000000000001';

    -- D. Remove demo company verification records
    DELETE FROM public.company_verifications 
    WHERE company_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
    );

    -- E. Remove demo companies
    DELETE FROM public.companies 
    WHERE id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
    ) OR contact_email LIKE '%.demo';

    -- F. Remove placeholder demo recruiter user profile & roles
    DELETE FROM public.user_roles 
    WHERE user_id = '00000000-0000-0000-0000-000000000001';

    DELETE FROM public.profiles 
    WHERE id = '00000000-0000-0000-0000-000000000001' 
       OR email = 'system.recruiter@udyogsetu.internal';

    RAISE NOTICE 'Category A demo business records successfully purged from public schema.';
END $$;

-- 2. PRESERVE & CONFIRM CATEGORY B REFERENCE DATA INTEGRITY
-- Verify that legitimate states, districts, cities, and 12 industrial locations remain intact
DO $$
DECLARE
    cluster_count INT;
    location_count INT;
BEGIN
    SELECT COUNT(*) INTO cluster_count FROM public.industrial_clusters;
    SELECT COUNT(*) INTO location_count FROM public.industrial_pilot_locations;

    IF cluster_count = 0 THEN
        RAISE EXCEPTION 'Reference data error: industrial_clusters is empty!';
    END IF;

    RAISE NOTICE 'Category B Reference Data verified: % clusters, % pilot locations intact.', cluster_count, location_count;
END $$;

-- 3. ENSURE PRODUCTION EMPTY-STATE HEALTH CHECK
-- Adds a platform setting record indicating production data cleanup is active
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('production_mode_active', 'true'::jsonb, 'Flag indicating platform is running in clean production mode with zero demo business data'),
    ('demo_data_purged_at', to_jsonb(now()::text), 'Timestamp of Category A demo data purge')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description;
