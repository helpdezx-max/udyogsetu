import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase/client';
import { UserRoleType, CompanyMemberRole, TeamInvitationRole } from '../types/database.types';

export interface AuthSessionUser {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  roles: UserRoleType[];
  primaryRole: UserRoleType;
}

export interface TeamInvitationData {
  id: string;
  companyId: string;
  companyName: string;
  inviterName?: string;
  email: string;
  role: TeamInvitationRole;
  tokenHash: string;
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  expiresAt: string;
  department?: string;
  createdAt: string;
}

export interface UserWorkspace {
  id: string;
  type: 'candidate' | 'company' | 'agency' | 'admin';
  name: string;
  role: string;
  clusterName?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified' | 'rejected' | 'suspended';
}

// In-memory / localStorage fallback cache for invitations when table is provisioning
const INVITATION_STORAGE_KEY = 'udyogsetu_active_invitations_v1';
let memoryInvitations: TeamInvitationData[] = [];

function getStoredInvitations(): TeamInvitationData[] {
  if (typeof window === 'undefined') return memoryInvitations;
  try {
    const raw = localStorage.getItem(INVITATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : memoryInvitations;
  } catch {
    return memoryInvitations;
  }
}

function saveStoredInvitations(invites: TeamInvitationData[]) {
  memoryInvitations = invites;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(invites));
  } catch {}
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * 1. Candidate Registration (Email + Password + Verification details)
   */
  async signUpCandidate(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    highestQualification?: string;
    preferredLanguage?: 'en' | 'mr' | 'hi';
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `candidate-${Date.now()}`,
            email: params.email,
          },
        },
        error: null,
      };
    }

    const { data, error } = await client.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          role: 'candidate',
          full_name: params.fullName,
          phone: params.phone,
          highest_qualification: params.highestQualification || '10th / 12th',
          preferred_language: params.preferredLanguage || 'mr',
        },
      },
    });

    if (!error && data.user) {
      // Ensure profile and candidate record exist
      try {
        await client.from('profiles').upsert({
          id: data.user.id,
          email: params.email,
          phone: params.phone,
          full_name: params.fullName,
          preferred_language: params.preferredLanguage || 'mr',
          is_active: true,
        });

        await client.from('user_roles').upsert({
          user_id: data.user.id,
          role: 'candidate',
          is_primary: true,
        }, { onConflict: 'user_id,role' });

        await client.from('candidate_profiles').upsert({
          user_id: data.user.id,
          highest_qualification: params.highestQualification || '10th / 12th',
          profile_completion_percentage: 25,
        }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn('Profile initialization note:', err);
      }
    }

    return { data, error };
  },

  /**
   * 2. Employer Registration (Creates auth identity + company record + owner membership)
   */
  async signUpEmployer(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    designation?: string;
    companyName: string;
    businessType?: string;
    industry?: string;
    website?: string;
    clusterId?: string;
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `employer-${Date.now()}`,
            email: params.email,
          },
        },
        companyId: `comp-${Date.now()}`,
        error: null,
      };
    }

    const { data: authData, error: authError } = await client.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          role: 'employer',
          full_name: params.fullName,
          phone: params.phone,
          designation: params.designation || 'Company Representative',
        },
      },
    });

    if (authError || !authData.user) {
      return { data: authData, companyId: null, error: authError };
    }

    let companyId = null;
    try {
      const slug = params.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueSlug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Initialize company with pending verification status
      const { data: company, error: compError } = await client
        .from('companies')
        .insert({
          name: params.companyName,
          slug: uniqueSlug,
          cluster_id: params.clusterId || 'chakan-phase-1',
          specific_address: 'Address pending verification',
          industry: params.industry || 'Auto Components Tier-1',
          employee_band: '50-200',
          direct_employer: true,
          verification_status: 'pending',
          verification_stage: 'unverified',
          trust_badge_company_verified: false,
          contact_email: params.email,
          contact_phone: params.phone,
          company_website: params.website || null,
          business_type: (params.businessType as any) || 'Private Limited',
          authorized_representative_name: params.fullName,
          authorized_representative_designation: params.designation || 'Owner / Director',
          authorized_representative_email: params.email,
          authorized_representative_phone: params.phone,
        })
        .select()
        .single();

      if (company) {
        companyId = company.id;
        // Link user as owner
        await client.from('company_members').insert({
          company_id: company.id,
          user_id: authData.user.id,
          member_role: 'owner',
        });
      }

      // Record profile & roles
      await client.from('profiles').upsert({
        id: authData.user.id,
        email: params.email,
        phone: params.phone,
        full_name: params.fullName,
        is_active: true,
      });

      await client.from('user_roles').upsert({
        user_id: authData.user.id,
        role: 'employer',
        is_primary: true,
      }, { onConflict: 'user_id,role' });

    } catch (e) {
      console.warn('Employer onboarding link note:', e);
    }

    return { data: authData, companyId, error: null };
  },

  /**
   * 3. Recruitment Agency Registration
   */
  async signUpAgency(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    agencyName: string;
    businessType?: string;
    website?: string;
    licenseNo?: string;
    operatingLocations?: string[];
    specialization?: string;
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `agency-${Date.now()}`,
            email: params.email,
          },
        },
        agencyId: `agency-rec-${Date.now()}`,
        error: null,
      };
    }

    const { data: authData, error: authError } = await client.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          role: 'agency',
          full_name: params.fullName,
          phone: params.phone,
          agency_name: params.agencyName,
        },
      },
    });

    if (authError || !authData.user) {
      return { data: authData, agencyId: null, error: authError };
    }

    let agencyId = null;
    try {
      const slug = params.agencyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueSlug = `agency-${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Insert agency record
      const { data: agencyRecord } = await client
        .from('recruitment_agencies')
        .insert({
          name: params.agencyName,
          slug: uniqueSlug,
          contact_person: params.fullName,
          contact_email: params.email,
          contact_phone: params.phone,
          license_number: params.licenseNo || 'PENDING_REGISTRATION',
          verification_status: 'pending',
          specialization: params.specialization || 'Industrial & Manufacturing Manpower',
        } as any)
        .select()
        .single();

      if (agencyRecord) {
        agencyId = agencyRecord.id;
        await client.from('agency_members').insert({
          agency_id: agencyRecord.id,
          user_id: authData.user.id,
          member_role: 'owner',
        } as any);
      }

      await client.from('profiles').upsert({
        id: authData.user.id,
        email: params.email,
        phone: params.phone,
        full_name: params.fullName,
        is_active: true,
      });

      await client.from('user_roles').upsert({
        user_id: authData.user.id,
        role: 'agency',
        is_primary: true,
      }, { onConflict: 'user_id,role' });

    } catch (e) {
      console.warn('Agency registration link note:', e);
    }

    return { data: authData, agencyId, error: null };
  },

  /**
   * 4. Team Invitation Management (HR Admin, Recruiter, Hiring Manager, Interviewer)
   */
  async createTeamInvitation(params: {
    companyId: string;
    inviterId: string;
    email: string;
    role: TeamInvitationRole;
    department?: string;
    notes?: string;
  }): Promise<{ invitation: TeamInvitationData | null; inviteUrl: string; error: Error | null }> {
    const client = getSupabaseClient();
    const token = `inv_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const inviteData: TeamInvitationData = {
      id: `inv-${Date.now()}`,
      companyId: params.companyId,
      companyName: 'Employer Organization',
      email: params.email.trim().toLowerCase(),
      role: params.role,
      tokenHash: token,
      status: 'pending',
      expiresAt,
      department: params.department,
      createdAt: new Date().toISOString(),
    };

    if (client) {
      try {
        // Fetch company name
        const { data: comp } = await client
          .from('companies')
          .select('name')
          .eq('id', params.companyId)
          .single();
        if (comp?.name) inviteData.companyName = comp.name;

        // Attempt DB insert
        const { data, error } = await (client as any)
          .from('team_invitations')
          .insert({
            company_id: params.companyId,
            inviter_id: params.inviterId,
            email: params.email.trim().toLowerCase(),
            role: params.role,
            token_hash: token,
            status: 'pending',
            expires_at: expiresAt,
            department: params.department || null,
            notes: params.notes || null,
          })
          .select()
          .single();

        if (data) {
          inviteData.id = data.id;
        } else if (error) {
          console.warn('DB team_invitations write note, preserving in active invites:', error.message);
        }
      } catch (err) {
        console.warn('team_invitations write error:', err);
      }
    }

    // Preserve in local storage fallback
    const current = getStoredInvitations();
    saveStoredInvitations([...current.filter(i => i.tokenHash !== token), inviteData]);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const inviteUrl = `${origin}/signup/invitation?token=${token}`;

    return { invitation: inviteData, inviteUrl, error: null };
  },

  /**
   * 5. Get Invitation Details By Token
   */
  async getInvitationByToken(token: string): Promise<{
    valid: boolean;
    invitation: TeamInvitationData | null;
    error: string | null;
  }> {
    if (!token) return { valid: false, invitation: null, error: 'Missing invitation token' };

    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await (client as any)
          .from('team_invitations')
          .select('*, companies(name)')
          .eq('token_hash', token)
          .single();

        if (data && !error) {
          const isExpired = new Date(data.expires_at).getTime() < Date.now();
          if (data.status === 'revoked') {
            return { valid: false, invitation: null, error: 'This invitation has been revoked by the employer.' };
          }
          if (data.status === 'accepted') {
            return { valid: false, invitation: null, error: 'This invitation has already been used and accepted.' };
          }
          if (isExpired || data.status === 'expired') {
            return { valid: false, invitation: null, error: 'This invitation link has expired (valid for 7 days).' };
          }

          return {
            valid: true,
            invitation: {
              id: data.id,
              companyId: data.company_id,
              companyName: data.companies?.name || 'Authorized Employer',
              email: data.email,
              role: data.role,
              tokenHash: data.token_hash,
              status: data.status,
              expiresAt: data.expires_at,
              department: data.department,
              createdAt: data.created_at,
            },
            error: null,
          };
        }
      } catch (e) {
        console.warn('DB check for invitation note:', e);
      }
    }

    // Fallback to stored invitations
    const stored = getStoredInvitations().find(i => i.tokenHash === token);
    if (!stored) {
      return { valid: false, invitation: null, error: 'Invalid or unrecognized invitation link.' };
    }

    if (stored.status === 'revoked') {
      return { valid: false, invitation: null, error: 'This invitation has been revoked by the employer.' };
    }
    if (stored.status === 'accepted') {
      return { valid: false, invitation: null, error: 'This invitation has already been accepted.' };
    }
    if (new Date(stored.expiresAt).getTime() < Date.now()) {
      return { valid: false, invitation: null, error: 'This invitation has expired.' };
    }

    return { valid: true, invitation: stored, error: null };
  },

  /**
   * 6. Accept Team Invitation & Activate Membership
   */
  async acceptTeamInvitation(params: {
    token: string;
    userId: string;
    userEmail: string;
  }): Promise<{ success: boolean; companyId: string | null; role: string | null; error: Error | null }> {
    const { valid, invitation, error: verifyError } = await this.getInvitationByToken(params.token);
    if (!valid || !invitation) {
      return { success: false, companyId: null, role: null, error: new Error(verifyError || 'Invalid invitation') };
    }

    // Security check: Invitee email must match authenticated user email
    if (invitation.email.toLowerCase() !== params.userEmail.trim().toLowerCase()) {
      return {
        success: false,
        companyId: null,
        role: null,
        error: new Error(`Email mismatch. This invitation was sent to ${invitation.email}. You are currently signed in as ${params.userEmail}. Please sign in with the invited email address.`),
      };
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        // 1. Insert or update company_members with assigned role
        await client.from('company_members').upsert({
          company_id: invitation.companyId,
          user_id: params.userId,
          member_role: invitation.role as any,
        }, { onConflict: 'company_id,user_id' });

        // 2. Ensure employer role is granted to user
        await client.from('user_roles').upsert({
          user_id: params.userId,
          role: 'employer',
          is_primary: true,
        }, { onConflict: 'user_id,role' });

        // 3. Mark invitation as accepted
        await (client as any)
          .from('team_invitations')
          .update({
            status: 'accepted',
            accepted_by: params.userId,
            accepted_at: new Date().toISOString(),
          })
          .eq('id', invitation.id);
      } catch (err) {
        console.warn('DB accept invitation error:', err);
      }
    }

    // Update in stored fallback
    const current = getStoredInvitations();
    saveStoredInvitations(
      current.map(i => i.tokenHash === params.token ? { ...i, status: 'accepted' as const } : i)
    );

    return { success: true, companyId: invitation.companyId, role: invitation.role, error: null };
  },

  /**
   * 7. Sign In with Password (Checks account status, profile, roles, and redirects)
   */
  async signInWithPassword(emailOrPhone: string, password: string) {
    const client = getSupabaseClient();
    if (!client) {
      return { data: null, error: new Error('Supabase client is not configured.') };
    }
    return client.auth.signInWithPassword({ email: emailOrPhone.trim(), password });
  },

  /**
   * 7b. Sign In / Sign Up with Google OAuth
   */
  async signInWithGoogle(redirectTo?: string) {
    const defaultRedirect = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';

    const targetRedirect = redirectTo || defaultRedirect;
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          provider: 'google',
          url: `https://accounts.google.com/o/oauth2/v2/auth?provider=google&client_id=simulated&redirect_to=${encodeURIComponent(targetRedirect)}&response_type=code`,
        },
        error: null,
      };
    }

    return client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetRedirect,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
  },

  /**
   * 8. Sign Out (Clears Supabase session & local cached context)
   */
  async signOut() {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Signout warning:', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.clear();
        localStorage.removeItem('udyogsetu_platform_v2_prod');
      } catch {}
    }

    return { error: null };
  },

  /**
   * 9. Password Recovery Request
   */
  async resetPassword(email: string) {
    const client = getSupabaseClient();
    if (!client) return { error: null };
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${origin}/reset-password`,
    });
  },

  /**
   * 10. Update Password (from reset password session)
   */
  async updatePassword(newPassword: string) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: new Error('Supabase client not available') };
    return client.auth.updateUser({ password: newPassword });
  },

  /**
   * 11. Resend Verification Email
   */
  async resendVerificationEmail(email: string) {
    const client = getSupabaseClient();
    if (!client) return { error: null };
    return client.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    });
  },

  /**
   * 12. Determine Role-Based Destination
   */
  getDashboardRouteForUser(roles: UserRoleType[], companyMemberRole?: CompanyMemberRole | null): string {
    if (roles.includes('admin')) return '/admin/dashboard';
    if (roles.includes('agency')) return '/agency/dashboard';
    if (roles.includes('employer')) {
      if (companyMemberRole === 'recruiter') return '/employer/manage-jobs';
      if (companyMemberRole === 'hiring_manager') return '/employer/applicants';
      if (companyMemberRole === 'interviewer') return '/employer/interviews';
      return '/employer/dashboard';
    }
    return '/candidate/dashboard';
  },

  /**
   * 12b. Fetch User Roles from database
   */
  async getUserRoles(userId: string): Promise<UserRoleType[]> {
    const client = getSupabaseClient();
    if (!client) return ['candidate'];

    try {
      const { data, error } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error || !data || data.length === 0) {
        return ['candidate'];
      }

      return data.map((r: any) => r.role as UserRoleType);
    } catch {
      return ['candidate'];
    }
  },

  /**
   * 13. Fetch User Workspaces (Multi-organization support)
   */
  async getUserWorkspaces(userId: string): Promise<UserWorkspace[]> {
    const workspaces: UserWorkspace[] = [
      {
        id: 'candidate-personal',
        type: 'candidate',
        name: 'Personal Candidate Profile',
        role: 'Candidate / Worker',
        verificationStatus: 'verified',
      },
    ];

    const client = getSupabaseClient();
    if (!client) return workspaces;

    try {
      // Check company memberships
      const { data: compMembers } = await client
        .from('company_members')
        .select('member_role, companies(id, name, verification_status)')
        .eq('user_id', userId);

      if (compMembers && compMembers.length > 0) {
        compMembers.forEach((cm: any) => {
          if (cm.companies) {
            workspaces.push({
              id: cm.companies.id,
              type: 'company',
              name: cm.companies.name,
              role: cm.member_role || 'Member',
              verificationStatus: cm.companies.verification_status || 'pending',
            });
          }
        });
      }

      // Check agency memberships
      const { data: agencyMembers } = await (client as any)
        .from('agency_members')
        .select('member_role, recruitment_agencies(id, name, verification_status)')
        .eq('user_id', userId);

      if (agencyMembers && agencyMembers.length > 0) {
        agencyMembers.forEach((am: any) => {
          if (am.recruitment_agencies) {
            workspaces.push({
              id: am.recruitment_agencies.id,
              type: 'agency',
              name: am.recruitment_agencies.name,
              role: am.member_role || 'Agency Member',
              verificationStatus: am.recruitment_agencies.verification_status || 'pending',
            });
          }
        });
      }

      // Check admin role
      const { data: adminRole } = await client
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (adminRole) {
        workspaces.push({
          id: 'admin-platform',
          type: 'admin',
          name: 'Platform Administration Console',
          role: 'Platform Administrator',
          verificationStatus: 'verified',
        });
      }
    } catch (e) {
      console.warn('Error querying user workspaces:', e);
    }

    return workspaces;
  },

  /**
   * 14. Active Session
   */
  async getSession() {
    const client = getSupabaseClient();
    if (!client) return { session: null, error: null };
    const { data, error } = await client.auth.getSession();
    return { session: data.session, error };
  },
};
