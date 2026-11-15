-- ============================================================================
-- UDYOGSETU PLATFORM — MIGRATION 08: WHATSAPP BUSINESS & AI RECRUITMENT INTELLIGENCE
-- Hyperlocal Industrial Employment Network (Chakan MIDC & Pune Belt)
-- ============================================================================

-- 1. WHATSAPP CONSENT RECORDS
CREATE TABLE IF NOT EXISTS whatsapp_consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    consent_status TEXT NOT NULL DEFAULT 'opted_in' CHECK (consent_status IN ('opted_in', 'opted_out', 'pending')),
    consent_source TEXT NOT NULL DEFAULT 'web_registration',
    categories_accepted TEXT[] NOT NULL DEFAULT ARRAY['job_alerts', 'application_updates', 'interview_reminders']::TEXT[],
    opted_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    opted_out_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. WHATSAPP OUTBOX & DELIVERY MESSAGE LOGS
CREATE TABLE IF NOT EXISTS whatsapp_message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_phone TEXT NOT NULL,
    template_name TEXT NOT NULL,
    language_code TEXT NOT NULL DEFAULT 'en',
    idempotency_key TEXT UNIQUE NOT NULL,
    message_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
    whatsapp_message_id TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CANDIDATE JOB ALERT PREFERENCES
CREATE TABLE IF NOT EXISTS job_alert_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_trades TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    preferred_clusters TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    min_salary INT NOT NULL DEFAULT 0,
    shift_preference TEXT NOT NULL DEFAULT 'any',
    alert_frequency TEXT NOT NULL DEFAULT 'immediate' CHECK (alert_frequency IN ('immediate', 'daily_digest', 'weekly_digest', 'disabled')),
    notification_channels TEXT[] NOT NULL DEFAULT ARRAY['whatsapp', 'in_app']::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AI USAGE, TELEMETRY & COST AUDITING
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'fallback_rule_based', 'failed')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    error_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AI FEATURE CONTROL & GOVERNANCE SETTINGS
CREATE TABLE IF NOT EXISTS ai_feature_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT UNIQUE NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    model_provider TEXT NOT NULL DEFAULT 'gemini',
    model_name TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    monthly_token_budget INT NOT NULL DEFAULT 1000000,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_whatsapp_consent_phone ON whatsapp_consent_records(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_logs_idempotency ON whatsapp_message_logs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_job_alert_prefs_user_id ON job_alert_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_feature ON ai_usage_logs(feature_name);

-- 7. ROW LEVEL SECURITY
ALTER TABLE whatsapp_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_settings ENABLE ROW LEVEL SECURITY;

-- Admins full access to all WhatsApp & AI logs
DROP POLICY IF EXISTS "Admins manage whatsapp consent" ON whatsapp_consent_records;
CREATE POLICY "Admins manage whatsapp consent" ON whatsapp_consent_records
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins manage whatsapp message logs" ON whatsapp_message_logs;
CREATE POLICY "Admins manage whatsapp message logs" ON whatsapp_message_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins manage ai usage logs" ON ai_usage_logs;
CREATE POLICY "Admins manage ai usage logs" ON ai_usage_logs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins manage ai feature settings" ON ai_feature_settings;
CREATE POLICY "Admins manage ai feature settings" ON ai_feature_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Users manage own job alert preferences
DROP POLICY IF EXISTS "Users manage own job alert preferences" ON job_alert_preferences;
CREATE POLICY "Users manage own job alert preferences" ON job_alert_preferences
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 8. SEED INITIAL AI FEATURE GOVERNANCE SETTINGS
INSERT INTO ai_feature_settings (feature_key, is_enabled, model_provider, model_name, monthly_token_budget, description)
VALUES
    ('job_description_assistant', true, 'gemini', 'gemini-1.5-flash', 500000, 'Generates structured manufacturing JDs with safety and shift specs'),
    ('resume_parser', true, 'gemini', 'gemini-1.5-flash', 1000000, 'Extracts ITI trades, experience, and machine skills with candidate review gate'),
    ('explainable_job_matcher', true, 'gemini', 'gemini-1.5-flash', 750000, 'Calculates 0-100% compatibility score with plain-text rationale'),
    ('candidate_chat_assistant', true, 'gemini', 'gemini-1.5-flash', 1500000, 'Vernacular guidance for factory floor interview prep and checklists'),
    ('employer_interview_assistant', true, 'gemini', 'gemini-1.5-flash', 500000, 'Generates structured technical evaluation rubrics for shopfloor trades'),
    ('ai_risk_signals', true, 'gemini', 'gemini-1.5-flash', 250000, 'Assists Phase 3 risk engine by detecting hidden fee extortion')
ON CONFLICT (feature_key) DO NOTHING;
