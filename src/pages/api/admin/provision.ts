import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminSupabaseClient } from '../../../lib/supabase/server';

type ProvisionResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProvisionResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Must be POST.',
    });
  }

  // 1. Enforce strict server secret authorization
  const adminSecret = process.env.ADMIN_PROVISION_SECRET;
  const providedSecret = req.headers['x-admin-secret'] || req.body?.adminSecret;

  if (!adminSecret || providedSecret !== adminSecret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing administrative provisioning secret.',
    });
  }

  const { email, userId, password, fullName } = req.body;

  if (!email && !userId) {
    return res.status(400).json({
      success: false,
      message: 'Bad Request: Either email or userId must be provided.',
    });
  }

  // 2. Initialize privileged Supabase client
  const adminClient = getAdminSupabaseClient();
  if (!adminClient) {
    return res.status(500).json({
      success: false,
      message: 'Server error: Supabase Service Role configuration missing.',
    });
  }

  try {
    let targetUserId = userId;

    if (!targetUserId && email) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (profile) {
        targetUserId = (profile as any).id;
      } else if (password) {
        // Auto-create user via admin auth API if not existing yet
        const { data: newAuthUser, error: createAuthError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName || 'Platform Admin' },
        });

        if (createAuthError || !newAuthUser?.user) {
          return res.status(400).json({
            success: false,
            message: `Failed to create admin user: ${createAuthError?.message || 'Unknown auth error'}`,
          });
        }

        targetUserId = newAuthUser.user.id;

        // Ensure profile exists in profiles table
        await adminClient.from('profiles').upsert({
          id: targetUserId,
          email,
          full_name: fullName || 'Platform Administrator',
          preferred_language: 'en',
          is_active: true,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: `User with email ${email} not found in profiles registry. Provide a password to auto-create the account.`,
        });
      }
    }

    // 3. Insert or update user_roles with admin role
    const { data: roleData, error: roleError } = await (adminClient as any)
      .from('user_roles')
      .upsert(
        {
          user_id: targetUserId,
          role: 'admin',
          is_primary: false,
        },
        { onConflict: 'user_id,role' }
      )
      .select()
      .single();

    if (roleError) {
      throw roleError;
    }

    // 4. Log to admin audit logs
    await (adminClient as any).from('admin_audit_logs').insert({
      admin_id: targetUserId,
      action: 'ADMIN_PROVISIONED',
      target_type: 'user_role',
      target_id: targetUserId,
      details: {
        email,
        assignedRole: 'admin',
        provisionedVia: 'secure_api_route',
      },
    });

    return res.status(200).json({
      success: true,
      message: `User ${email || targetUserId} has been safely provisioned with Platform Administrator permissions.`,
      data: roleData,
    });
  } catch (err: any) {
    console.error('Admin provisioning error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error during provisioning.',
    });
  }
}
