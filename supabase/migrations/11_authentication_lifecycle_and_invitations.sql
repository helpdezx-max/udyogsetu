-- ============================================================================
-- UDYOGSETU PLATFORM — MIGRATION 11: AUTHENTICATION LIFECYCLE & INVITATIONS
-- Complete Account Lifecycle, Team Invitations, Audit Logging & Role Management
-- ============================================================================

-- 1. EXTEND COMPANY MEMBER ROLES
-- Allow hr_admin, recruiter, hiring_manager, interviewer alongside owner
DO $$
BEGIN
    ALTER TABLE public.company_members 
    DROP CONSTRAINT IF EXISTS company_members_member_role_check;

    ALTER TABLE public.company_members 
    ADD CONSTRAINT company_members_member_role_check 
    CHECK (member_role IN ('owner', 'hr_admin', 'recruiter', 'hiring_manager', 'interviewer'));
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Constraint update on company_members: %', SQLERRM;
END $$;

-- 2. TEAM INVITATIONS TABLE (HR, Recruiter, Hiring Manager, Interviewer)
CREATE TABLE IF NOT EXISTS public.team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    inviter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('hr_admin', 'recruiter', 'hiring_manager', 'interviewer')),
    token_hash TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
    accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    accepted_at TIMESTAMPTZ,
    department TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_company ON public.team_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(token_hash);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON public.team_invitations(status);

-- 3. AUTHENTICATION AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'signup',
        'signin',
        'signout',
        'password_reset_request',
        'password_updated',
        'email_verified',
        'role_switched',
        'invitation_created',
        'invitation_sent',
        'invitation_accepted',
        'invitation_revoked',
        'account_suspended',
        'account_restored'
    )),
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON public.auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_event ON public.auth_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created ON public.auth_audit_logs(created_at DESC);

-- 4. ACCOUNT STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.account_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    reason TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_account_status_user ON public.account_status_history(user_id);

-- 5. ROW LEVEL SECURITY (RLS) FOR INVITATIONS & AUDIT LOGS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_status_history ENABLE ROW LEVEL SECURITY;

-- Team Invitations Policies
DROP POLICY IF EXISTS "Company admins can view own invitations" ON public.team_invitations;
CREATE POLICY "Company admins can view own invitations" ON public.team_invitations
    FOR SELECT USING (
        public.is_platform_admin() OR
        EXISTS (
            SELECT 1 FROM public.company_members cm
            WHERE cm.company_id = team_invitations.company_id
              AND cm.user_id = auth.uid()
              AND cm.member_role IN ('owner', 'hr_admin')
        )
    );

DROP POLICY IF EXISTS "Company admins can create invitations" ON public.team_invitations;
CREATE POLICY "Company admins can create invitations" ON public.team_invitations
    FOR INSERT WITH CHECK (
        public.is_platform_admin() OR
        EXISTS (
            SELECT 1 FROM public.company_members cm
            WHERE cm.company_id = team_invitations.company_id
              AND cm.user_id = auth.uid()
              AND cm.member_role IN ('owner', 'hr_admin')
        )
    );

DROP POLICY IF EXISTS "Company admins can update invitations" ON public.team_invitations;
CREATE POLICY "Company admins can update invitations" ON public.team_invitations
    FOR UPDATE USING (
        public.is_platform_admin() OR
        EXISTS (
            SELECT 1 FROM public.company_members cm
            WHERE cm.company_id = team_invitations.company_id
              AND cm.user_id = auth.uid()
              AND cm.member_role IN ('owner', 'hr_admin')
        )
    );

-- Audit Logs Policies
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.auth_audit_logs;
CREATE POLICY "Users can view own audit logs" ON public.auth_audit_logs
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_platform_admin()
    );

DROP POLICY IF EXISTS "Platform admin can view all status history" ON public.account_status_history;
CREATE POLICY "Platform admin can view all status history" ON public.account_status_history
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_platform_admin()
    );

-- 6. PLATFORM SETTINGS ANNOUNCEMENT
INSERT INTO public.platform_settings (key, value, description)
VALUES 
    ('auth_lifecycle_version', '"2.0.0"'::jsonb, 'Full production authentication lifecycle with invitation management and security audit logging'),
    ('email_verification_required', 'false'::jsonb, 'Flag indicating whether email verification blocks application access (false in pilot stage with warnings)'),
    ('invitation_validity_days', '7'::jsonb, 'Number of days an HR/recruiter company team invitation remains valid')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description;
