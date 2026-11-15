-- ============================================================================
-- UDYOGSETU PLATFORM — MIGRATION 07: JOB AGGREGATION & VACANCY DISCOVERY ENGINE
-- Hyperlocal Industrial Employment Network (Chakan MIDC & Pune Belt)
-- ============================================================================

-- 1. DISCOVERY SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS discovery_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN (
            'career_page',
            'job_board',
            'agency_page',
            'industrial_announcement',
            'employer_feed',
            'partner_feed',
            'manual_submission'
        )
    ),
    source_owner TEXT,
    access_method TEXT NOT NULL DEFAULT 'http_get' CHECK (
        access_method IN ('http_get', 'rss_feed', 'json_api', 'manual_url')
    ),
    permission_status TEXT NOT NULL DEFAULT 'review_required' CHECK (
        permission_status IN ('not_reviewed', 'review_required', 'approved', 'restricted', 'rejected')
    ),
    crawl_frequency_minutes INT NOT NULL DEFAULT 1440,
    last_successful_crawl TIMESTAMPTZ,
    last_attempted_crawl TIMESTAMPTZ,
    reliability_score INT NOT NULL DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    rate_limit_per_minute INT NOT NULL DEFAULT 10,
    error_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. DISCOVERY RUN AUDIT LOGS
CREATE TABLE IF NOT EXISTS discovery_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES discovery_sources(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'partial')),
    vacancies_discovered INT NOT NULL DEFAULT 0,
    vacancies_ingested INT NOT NULL DEFAULT 0,
    duplicates_detected INT NOT NULL DEFAULT 0,
    error_log JSONB NOT NULL DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_discovery_sources_status ON discovery_sources(permission_status);
CREATE INDEX IF NOT EXISTS idx_discovery_sources_enabled ON discovery_sources(is_enabled);
CREATE INDEX IF NOT EXISTS idx_discovery_runs_source_id ON discovery_runs(source_id);
CREATE INDEX IF NOT EXISTS idx_discovery_runs_started_at ON discovery_runs(started_at DESC);

-- 4. ROW LEVEL SECURITY
ALTER TABLE discovery_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_runs ENABLE ROW LEVEL SECURITY;

-- Admins full access to discovery sources
DROP POLICY IF EXISTS "Admins full access to discovery sources" ON discovery_sources;
CREATE POLICY "Admins full access to discovery sources" ON discovery_sources
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admins full access to discovery runs
DROP POLICY IF EXISTS "Admins full access to discovery runs" ON discovery_runs;
CREATE POLICY "Admins full access to discovery runs" ON discovery_runs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- 5. SEED VERIFIED CHAKAN INDUSTRIAL SOURCES
INSERT INTO discovery_sources (name, website_url, category, source_owner, access_method, permission_status, crawl_frequency_minutes, reliability_score, is_enabled, rate_limit_per_minute, admin_notes)
VALUES
    (
        'Mahindra & Mahindra Chakan Plant Direct Careers',
        'https://jobs.mahindra.com/search/?q=chakan',
        'career_page',
        'Mahindra & Mahindra Ltd.',
        'http_get',
        'approved',
        720,
        98,
        true,
        6,
        'Direct OEM career portal for Chakan automotive manufacturing facility. Schema.org JobPosting compliant.'
    ),
    (
        'Bajaj Auto Chakan & Akurdi Production Openings',
        'https://www.bajajauto.com/careers/openings',
        'career_page',
        'Bajaj Auto Ltd.',
        'http_get',
        'approved',
        720,
        96,
        true,
        6,
        'Two-wheeler and commercial vehicle assembly, press shop and weld shop roles.'
    ),
    (
        'Tata Motors Pune Passenger & Commercial Plant',
        'https://www.tatamotors.com/careers/opportunities',
        'career_page',
        'Tata Motors Ltd.',
        'http_get',
        'approved',
        720,
        95,
        true,
        5,
        'Pimpri and Chakan CVBU/PVBU manufacturing shifts and shopfloor apprenticeships.'
    ),
    (
        'Bharat Forge Chakan Industrial Complex',
        'https://www.bharatforge.com/careers',
        'career_page',
        'Bharat Forge Ltd.',
        'http_get',
        'approved',
        1440,
        94,
        true,
        6,
        'Precision forging, machining, heat treatment and metallurgical quality roles.'
    ),
    (
        'Chakan MIDC Industrial Association Walk-in Feed',
        'https://chakanmidc.org/vacancies',
        'industrial_announcement',
        'Chakan Industries Association',
        'rss_feed',
        'approved',
        360,
        92,
        true,
        10,
        'Hyperlocal association bulletin for Tier 1 and Tier 2 MSME auto-ancillary suppliers.'
    ),
    (
        'General Motors / Talegaon Vendor Park Feeds',
        'https://example.com/talegaon-vendors/jobs',
        'job_board',
        'Talegaon Vendor Association',
        'http_get',
        'review_required',
        1440,
        80,
        false,
        5,
        'Requires legal terms review before automated crawling can be enabled.'
    )
ON CONFLICT DO NOTHING;
