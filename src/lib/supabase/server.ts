import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isServerSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith('http') &&
    (supabaseServiceRoleKey || supabaseAnonKey)
  );
};

/**
 * Creates an admin/privileged Supabase client using the Service Role Key.
 * NEVER expose this or import this file into browser/client components.
 * Only use in /pages/api/ routes or server-side scripts.
 */
export const getAdminSupabaseClient = (): SupabaseClient<any> | null => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

/**
 * Creates a server-side Supabase client scoped to a user's JWT bearer token.
 */
export const createServerSupabaseClient = (jwtToken?: string): SupabaseClient<any> | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
    },
  });
};
