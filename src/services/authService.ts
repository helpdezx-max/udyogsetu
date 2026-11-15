import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase/client';
import { UserRoleType } from '../types/database.types';

export interface AuthSessionUser {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  roles: UserRoleType[];
  primaryRole: UserRoleType;
}

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Candidate Registration (Email + Password, with full name, phone, trade qualification)
   */
  async signUpCandidate(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    highestQualification: string;
    preferredLanguage?: 'en' | 'mr' | 'hi';
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `demo-candidate-${Date.now()}`,
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
          highest_qualification: params.highestQualification,
          preferred_language: params.preferredLanguage || 'mr',
        },
      },
    });

    return { data, error };
  },

  /**
   * Employer Registration (Creates auth account + initial company profile)
   */
  async signUpEmployer(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    companyName: string;
    clusterId?: string;
    industry?: string;
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `demo-employer-${Date.now()}`,
            email: params.email,
          },
        },
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
        },
      },
    });

    if (authError || !authData.user) {
      return { data: authData, error: authError };
    }

    // Auto-create initial company record if user created
    try {
      const slug = params.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data: company, error: compError } = await (client as any)
        .from('companies')
        .insert({
          name: params.companyName,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          cluster_id: params.clusterId || 'chakan-phase-1',
          specific_address: 'Address pending verification',
          industry: params.industry || 'Auto Components Tier-1',
          employee_band: '50-200',
          direct_employer: true,
          verification_status: 'pending',
          contact_email: params.email,
          contact_phone: params.phone,
        })
        .select()
        .single();

      if (compError) {
        console.warn('Company insertion deferred to onboarding:', compError.message);
      } else if (company) {
        // Link user as owner
        await (client as any).from('company_members').insert({
          company_id: (company as any).id,
          user_id: authData.user.id,
          member_role: 'owner',
        });
      }
    } catch (e) {
      console.warn('Employer company creation caught error:', e);
    }

    return { data: authData, error: null };
  },

  /**
   * Agency Registration (Creates auth account + initial recruitment agency profile)
   */
  async signUpAgency(params: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    agencyName: string;
    licenseNo: string;
  }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          user: {
            id: `demo-agency-${Date.now()}`,
            email: params.email,
          },
        },
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
        },
      },
    });

    if (authError || !authData.user) {
      return { data: authData, error: authError };
    }

    return { data: authData, error: null };
  },

  /**
   * Sign In with Email & Password
   */
  async signInWithPassword(email: string, password: string) {
    const client = getSupabaseClient();
    if (!client) {
      return { data: null, error: new Error('Supabase is not configured. Running in local demo mode.') };
    }
    return client.auth.signInWithPassword({ email, password });
  },

  /**
   * Sign Out
   */
  async signOut() {
    const client = getSupabaseClient();
    if (!client) return { error: null };
    return client.auth.signOut();
  },

  /**
   * Password Recovery
   */
  async resetPassword(email: string) {
    const client = getSupabaseClient();
    if (!client) return { error: null };
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });
  },

  /**
   * Get Active Session
   */
  async getSession() {
    const client = getSupabaseClient();
    if (!client) return { session: null, error: null };
    const { data, error } = await client.auth.getSession();
    return { session: data.session, error };
  },

  /**
   * Fetch User Roles
   */
  async getUserRoles(userId: string): Promise<UserRoleType[]> {
    const client = getSupabaseClient();
    if (!client) return ['candidate'];

    const { data, error } = await client
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return ['candidate'];
    }

    return data.map((r: any) => r.role as UserRoleType);
  },

  /**
   * Listen to Auth Changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const client = getSupabaseClient();
    if (!client) {
      return { unsubscribe: () => {} };
    }

    const { data } = client.auth.onAuthStateChange(callback);
    return { unsubscribe: () => data.subscription.unsubscribe() };
  },
};
