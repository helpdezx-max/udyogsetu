import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase/client';
import { authService, UserWorkspace } from '../services/authService';
import { UserRoleType, CompanyMemberRole } from '../types/database.types';

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  preferred_language: 'en' | 'mr' | 'hi';
  avatar_url: string | null;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRoleType[];
  activeRole: UserRoleType;
  companyMemberRole: CompanyMemberRole | null;
  workspaces: UserWorkspace[];
  activeWorkspace: UserWorkspace | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (emailOrPhone: string, password: string) => Promise<{ error: Error | null; targetRoute?: string }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null; url?: string | null }>;
  signUpCandidate: typeof authService.signUpCandidate;
  signUpEmployer: typeof authService.signUpEmployer;
  signUpAgency: typeof authService.signUpAgency;
  signOut: () => Promise<void>;
  switchActiveRole: (role: UserRoleType) => boolean;
  switchActiveWorkspace: (workspaceId: string) => void;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRoleType[]>(['candidate']);
  const [activeRole, setActiveRole] = useState<UserRoleType>('candidate');
  const [companyMemberRole, setCompanyMemberRole] = useState<CompanyMemberRole | null>(null);
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<UserWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  const loadUserData = async (activeUser: User) => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      // 1. Fetch Profile
      const { data: prof } = await client
        .from('profiles')
        .select('*')
        .eq('id', activeUser.id)
        .single();

      if (prof) {
        setProfile(prof as UserProfile);
      } else {
        // Fallback user profile from metadata
        setProfile({
          id: activeUser.id,
          email: activeUser.email || null,
          phone: activeUser.phone || (activeUser.user_metadata?.phone as string) || null,
          full_name: (activeUser.user_metadata?.full_name as string) || (activeUser.email?.split('@')[0] as string) || 'Industrial User',
          preferred_language: (activeUser.user_metadata?.preferred_language as any) || 'mr',
          avatar_url: null,
          is_active: true,
        });
      }

      // 2. Fetch User Roles
      const { data: userRoles } = await client
        .from('user_roles')
        .select('role, is_primary')
        .eq('user_id', activeUser.id);

      let detectedRoles: UserRoleType[] = ['candidate'];
      if (userRoles && userRoles.length > 0) {
        const rolesArr = userRoles as any[];
        detectedRoles = rolesArr.map((r: any) => r.role as UserRoleType);
        setRoles(detectedRoles);
        const primary = rolesArr.find((r: any) => r.is_primary)?.role || detectedRoles[0];
        setActiveRole(primary as UserRoleType);
      } else if (activeUser.user_metadata?.role) {
        const metaRole = activeUser.user_metadata.role as UserRoleType;
        if (['candidate', 'employer', 'agency'].includes(metaRole)) {
          detectedRoles = [metaRole];
          setRoles(detectedRoles);
          setActiveRole(metaRole);
        }
      }

      // 3. Fetch Company Member Role (if employer)
      const { data: compMember } = await client
        .from('company_members')
        .select('member_role')
        .eq('user_id', activeUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (compMember) {
        setCompanyMemberRole((compMember as any).member_role as CompanyMemberRole);
      }

      // 4. Load Workspaces
      const loadedWorkspaces = await authService.getUserWorkspaces(activeUser.id);
      setWorkspaces(loadedWorkspaces);
      if (loadedWorkspaces.length > 0) {
        setActiveWorkspace(loadedWorkspaces[0]);
      }
    } catch (e) {
      console.warn('Failed to load user profile & roles from Supabase:', e);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setIsLoading(false);
      return;
    }

    // Initial session check
    client.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        loadUserData(currentSession.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadUserData(newSession.user);
      } else {
        setProfile(null);
        setRoles(['candidate']);
        setActiveRole('candidate');
        setCompanyMemberRole(null);
        setWorkspaces([]);
        setActiveWorkspace(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (emailOrPhone: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await authService.signInWithPassword(emailOrPhone, password);
    let targetRoute = '/candidate/dashboard';

    if (!error && data?.user) {
      setUser(data.user);
      await loadUserData(data.user);
      const rolesList = await authService.getUserRoles(data.user.id);
      targetRoute = authService.getDashboardRouteForUser(rolesList, companyMemberRole);
    }
    setIsLoading(false);
    return { error: error as Error | null, targetRoute };
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    setIsLoading(true);
    const { data, error } = await authService.signInWithGoogle(redirectTo);
    if (error) {
      setIsLoading(false);
      return { error: error as Error | null, url: null };
    }
    return { error: null, url: data?.url || null };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles(['candidate']);
    setActiveRole('candidate');
    setCompanyMemberRole(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    setIsLoading(false);
  };

  const switchActiveRole = (targetRole: UserRoleType): boolean => {
    if (!isConfigured) {
      setActiveRole(targetRole);
      return true;
    }

    if (roles.includes(targetRole) || roles.includes('admin')) {
      setActiveRole(targetRole);
      return true;
    }

    return false;
  };

  const switchActiveWorkspace = (workspaceId: string) => {
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (ws) {
      setActiveWorkspace(ws);
      if (ws.type === 'candidate') setActiveRole('candidate');
      else if (ws.type === 'company') setActiveRole('employer');
      else if (ws.type === 'agency') setActiveRole('agency');
      else if (ws.type === 'admin') setActiveRole('admin');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    return { error: error as Error | null };
  };

  const updatePassword = async (password: string) => {
    const { error } = await authService.updatePassword(password);
    return { error: error as Error | null };
  };

  const resendVerificationEmail = async (email: string) => {
    const { error } = await authService.resendVerificationEmail(email);
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        activeRole,
        companyMemberRole,
        workspaces,
        activeWorkspace,
        isLoading,
        isConfigured,
        signIn,
        signInWithGoogle,
        signUpCandidate: authService.signUpCandidate,
        signUpEmployer: authService.signUpEmployer,
        signUpAgency: authService.signUpAgency,
        signOut,
        switchActiveRole,
        switchActiveWorkspace,
        refreshProfile,
        resetPassword,
        updatePassword,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
