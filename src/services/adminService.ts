import { getSupabaseClient } from '../lib/supabase/client';
import {
  EmployerVerificationRequest,
  ModerationReport,
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS,
} from '../data/demo-data';

export const adminService = {
  /**
   * Fetch Pending Verification Requests
   */
  async getPendingVerifications(): Promise<{
    verifications: EmployerVerificationRequest[];
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { verifications: INITIAL_VERIFICATIONS, error: null };
    }

    try {
      const { data, error } = await client
        .from('company_verifications')
        .select(`
          id,
          status,
          rejection_reason,
          created_at,
          companies(id, name, specific_address, contact_phone, contact_email, industrial_clusters(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const verifications: EmployerVerificationRequest[] = (data || []).map((row: any) => ({
        id: row.id,
        companyId: row.companies?.id || '',
        companyName: row.companies?.name || 'Factory Unit',
        clusterName: row.companies?.industrial_clusters?.name || 'Chakan MIDC',
        submittedDate: new Date(row.created_at).toLocaleDateString('en-GB'),
        documentsSubmitted: {
          gstinCert: 'GSTIN Registration Copy',
          udyamCert: 'MSME Udyam Certificate',
          midcAllotmentLetter: 'MIDC Industrial Plot Allotment Letter',
          factoryLicense: 'Factory Act License No. 4412',
        },
        contactPerson: 'Authorized Plant Signatory',
        contactPhone: row.companies?.contact_phone || '+91 2135 258900',
        status: row.status === 'verified' ? 'verified' : row.status === 'rejected' ? 'rejected' : 'pending',
        rejectionReason: row.rejection_reason || undefined,
      }));

      return { verifications, error: null };
    } catch (err: any) {
      return { verifications: INITIAL_VERIFICATIONS, error: err };
    }
  },

  /**
   * Approve or Reject an Employer Verification
   */
  async reviewVerification(
    verificationId: string,
    companyId: string,
    status: 'verified' | 'rejected',
    reason?: string,
    adminUserId?: string
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      // 1. Update verification record
      await (client as any)
        .from('company_verifications')
        .update({
          status,
          rejection_reason: reason || null,
          reviewed_by: adminUserId || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', verificationId);

      // 2. Update company status
      await (client as any)
        .from('companies')
        .update({
          verification_status: status,
          verification_audit_date: status === 'verified' ? new Date().toISOString() : null,
        })
        .eq('id', companyId);

      // 3. Log admin audit action
      if (adminUserId) {
        await (client as any).from('admin_audit_logs').insert({
          admin_id: adminUserId,
          action: `VERIFICATION_${status.toUpperCase()}`,
          target_type: 'company',
          target_id: companyId,
          details: { verificationId, status, reason },
        });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Fetch Moderation Reports
   */
  async getModerationReports(): Promise<{
    reports: ModerationReport[];
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { reports: INITIAL_REPORTS, error: null };
    }

    try {
      const { data, error } = await client
        .from('moderation_actions')
        .select(`
          id,
          reason,
          details,
          status,
          created_at,
          jobs(id, title, companies(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reports: ModerationReport[] = (data || []).map((row: any) => ({
        id: row.id,
        jobId: row.jobs?.id || 'job-general',
        jobTitle: row.jobs?.title || 'Reported Job Vacancy',
        companyName: row.jobs?.companies?.name || 'Reported Entity',
        reportedBy: 'Concerned Job Seeker (Aadhaar Verified)',
        reason: row.reason,
        reportedDate: new Date(row.created_at).toLocaleDateString('en-GB'),
        status: row.status,
        details: row.details,
      }));

      return { reports, error: null };
    } catch (err: any) {
      return { reports: INITIAL_REPORTS, error: err };
    }
  },

  /**
   * Resolve Moderation Action
   */
  async resolveReport(
    reportId: string,
    status: 'resolved' | 'dismissed',
    notes?: string,
    adminUserId?: string
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      await (client as any)
        .from('moderation_actions')
        .update({
          status,
          resolution_notes: notes || null,
          resolved_by: adminUserId || null,
        })
        .eq('id', reportId);

      if (adminUserId) {
        await (client as any).from('admin_audit_logs').insert({
          admin_id: adminUserId,
          action: `MODERATION_${status.toUpperCase()}`,
          target_type: 'moderation_action',
          target_id: reportId,
          details: { status, notes },
        });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },
};
