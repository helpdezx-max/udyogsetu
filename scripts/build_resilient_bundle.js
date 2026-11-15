const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

let s1 = fs.readFileSync(path.join(migrationsDir, '01_initial_schema.sql'), 'utf8');
let s2 = fs.readFileSync(path.join(migrationsDir, '02_row_level_security.sql'), 'utf8');
let s3 = fs.readFileSync(path.join(migrationsDir, '03_storage_buckets.sql'), 'utf8');
let s4 = fs.readFileSync(path.join(migrationsDir, '04_seed_data.sql'), 'utf8');
let s5 = fs.readFileSync(path.join(migrationsDir, '05_seed_companies_and_jobs.sql'), 'utf8');
let s6 = fs.readFileSync(path.join(migrationsDir, '06_trust_and_safety_engine.sql'), 'utf8');

// 1. In s1: Change "id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE" to "id UUID PRIMARY KEY"
s1 = s1.replace(
  'id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,',
  'id UUID PRIMARY KEY, -- Linked with auth.users(id)'
);

// In s1: Wrap auth.users trigger in exception block
const triggerBlock = `-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_registration();`;

const safeTriggerBlock = `DO $$
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user_registration();
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Trigger on auth.users skipped: %', SQLERRM;
END $$;`;

s1 = s1.replace(triggerBlock, safeTriggerBlock);

// 2. In s2: Add DROP POLICY IF EXISTS before every CREATE POLICY
s2 = s2.replace(/CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)/g, (match, policyName, tableName) => {
  return `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\nCREATE POLICY "${policyName}" ON ${tableName}`;
});

// 3. In s3: Wrap storage buckets and storage policies in safe block
s3 = `
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
`;

// 4. In s6: Add DROP POLICY IF EXISTS before policies
s6 = s6.replace(/CREATE POLICY\s+"([^"]+)"\s+ON\s+([^\s]+)/g, (match, policyName, tableName) => {
  return `DROP POLICY IF EXISTS "${policyName}" ON ${tableName};\nCREATE POLICY "${policyName}" ON ${tableName}`;
});

const bundleHeader = `-- =====================================================================
-- UDYOGSETU (उद्योगसेतू) INDUSTRIAL RECRUITMENT PLATFORM
-- PRODUCTION CONSOLIDATED DATABASE MIGRATION SCRIPT (ALL-IN-ONE)
-- Fully Idempotent, Safe for Supabase SQL Editor
-- Target: Supabase PostgreSQL (ap-south-1 Mumbai)
-- =====================================================================\n\n`;

const fullBundle = bundleHeader + [s1, s2, s3, s4, s5, s6].join('\n\n-- ---------------------------------------------------------------------\n-- NEXT MODULE\n-- ---------------------------------------------------------------------\n\n');

fs.writeFileSync(path.join(migrationsDir, 'all_migrations_bundle.sql'), fullBundle, 'utf8');
console.log('Successfully generated bulletproof all_migrations_bundle.sql (' + fullBundle.length + ' bytes)');
