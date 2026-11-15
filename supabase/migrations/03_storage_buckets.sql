-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- MIGRATION 03: SUPABASE STORAGE BUCKETS & STORAGE RLS POLICIES
-- Buckets:
--   1. 'resumes'           (Private: Candidate resumes, PDF only, max 10MB)
--   2. 'verification-docs' (Private: Factory licenses, GSTIN, MIDC docs, max 10MB)
-- =====================================================================

-- 1. INSERT STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'resumes', 
        'resumes', 
        FALSE, 
        10485760, -- 10MB
        ARRAY['application/pdf']
    ),
    (
        'verification-docs', 
        'verification-docs', 
        FALSE, 
        10485760, -- 10MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ---------------------------------------------------------------------
-- 2. STORAGE RLS POLICIES: RESUMES BUCKET
-- Storage path convention: resumes/{candidate_user_id}/{filename}
-- ---------------------------------------------------------------------

-- Candidates can upload their own resume file
CREATE POLICY "Candidate upload own resume" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'resumes'
        AND auth.uid() IS NOT NULL
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Candidates can read their own resume
-- Employers can read if candidate has submitted an application for the employer's company
-- Admins can read all resumes
CREATE POLICY "Candidate, authorized employer and admin read resume" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes'
        AND (
            -- Candidate owner
            (storage.foldername(name))[1] = auth.uid()::text
            -- Platform admin
            OR public.is_platform_admin()
            -- Employer with application
            OR EXISTS (
                SELECT 1 
                FROM public.candidate_profiles cp
                JOIN public.applications a ON a.candidate_id = cp.id
                JOIN public.jobs j ON j.id = a.job_id
                JOIN public.company_members cm ON cm.company_id = j.company_id
                WHERE cp.user_id::text = (storage.foldername(storage.objects.name))[1]
                  AND cm.user_id = auth.uid()
            )
        )
    );

-- Candidates can update/delete their own resume file
CREATE POLICY "Candidate manage own resume file" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'resumes'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Candidate delete own resume file" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'resumes'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- ---------------------------------------------------------------------
-- 3. STORAGE RLS POLICIES: VERIFICATION DOCUMENTS BUCKET
-- Storage path convention: verification-docs/{company_id}/{filename}
-- ---------------------------------------------------------------------

-- Company members or admins can upload verification documents
CREATE POLICY "Company member upload verification doc" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'verification-docs'
        AND (
            public.is_platform_admin()
            OR public.is_member_of_company(((storage.foldername(name))[1])::uuid)
        )
    );

-- Only company members of that company and Platform Admins can read verification documents
CREATE POLICY "Company member and admin read verification doc" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'verification-docs'
        AND (
            public.is_platform_admin()
            OR public.is_member_of_company(((storage.foldername(name))[1])::uuid)
        )
    );

-- Company owner or admin can delete verification documents
CREATE POLICY "Company owner or admin delete verification doc" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'verification-docs'
        AND (
            public.is_platform_admin()
            OR EXISTS (
                SELECT 1 
                FROM public.company_members cm
                WHERE cm.company_id = ((storage.foldername(storage.objects.name))[1])::uuid
                  AND cm.user_id = auth.uid()
                  AND cm.member_role = 'owner'
            )
        )
    );
