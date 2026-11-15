import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase/client';
import { authService } from '../services/authService';
import { UserRoleType } from '../types/database.types';

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  preferred_language: 'en' | 'mr' | 'hi';
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRoleType[];
  activeRole: UserRoleType;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpCandidate: typeof authService.signUpCandidate;
  signUpEmployer: typeof authService.signUpEmployer;
  signUpAgency: typeof authService.signUpAgency;
  signOut: () => Promise<void>;
  switchActiveRole: (role: UserRoleType) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<UserRoleType[]>(['candidate']);
  const [activeRole, setActiveRole] = useState<UserRoleType>('candidate');
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
      }

      // 2. Fetch User Roles
      const { data: userRoles } = await client
        .from('user_roles')
        .select('role, is_primary')
        .eq('user_id', activeUser.id);

      if (userRoles && userRoles.length > 0) {
        const rolesArr = userRoles as any[];
        const roleList = rolesArr.map((r: any) => r.role as UserRoleType);
        setRoles(roleList);
        const primary = rolesArr.find((r: any) => r.is_primary)?.role || roleList[0];
        setActiveRole(primary as UserRoleType);
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
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await authService.signInWithPassword(email, password);
    if (!error && data?.user) {
      setUser(data.user);
      await loadUserData(data.user);
    }
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles(['candidate']);
    setActiveRole('candidate');
    setIsLoading(false);
  };

  const switchActiveRole = (targetRole: UserRoleType): boolean => {
    if (!isConfigured) {
      // In demo mode allow switching for full testing
      setActiveRole(targetRole);
      return true;
    }

    if (roles.includes(targetRole) || roles.includes('admin')) {
      setActiveRole(targetRole);
      return true;
    }

    return false;
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        roles,
        activeRole,
        isLoading,
        isConfigured,
        signIn,
        signUpCandidate: authService.signUpCandidate,
        signUpEmployer: authService.signUpEmployer,
        signUpAgency: authService.signUpAgency,
        signOut,
        switchActiveRole,
        refreshProfile,
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
