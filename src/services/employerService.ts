import { getSupabaseClient } from '../lib/supabase/client';
import { storageService } from './storageService';
import { Company } from '../data/demo-data';

export const employerService = {
  /**
   * Get Company Details associated with the logged-in Employer user
   */
  async getCompanyForUser(userId: string): Promise<{
    company: Company | null;
    role: string | null;
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { company: null, role: null, error: null };
    }

    try {
      const { data: member, error: memberError } = await client
        .from('company_members')
        .select('member_role, companies(*, industrial_clusters(name))')
        .eq('user_id', userId)
        .single();

      const memberRow = member as any;
      if (!memberRow || !memberRow.companies) return { company: null, role: null, error: null };

      const c = memberRow.companies;
      const company: Company = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        clusterId: c.cluster_id || 'chakan-phase-1',
        clusterName: c.industrial_clusters?.name || 'Chakan MIDC Phase 1',
        specificAddress: c.specific_address,
        industry: c.industry,
        employeeBand: c.employee_band,
        directEmployer: c.direct_employer,
        verificationStatus: c.verification_status,
        udyamRegistrationNo: c.udyam_registration_no || undefined,
        gstin: c.gstin || undefined,
        factoryLicenseNo: c.factory_license_no || undefined,
        verificationAuditDate: c.verification_audit_date || undefined,
        establishedYear: c.established_year || 2010,
        description: c.description || '',
        facilities: c.facilities || [],
        logoPlaceholderBg: 'bg-neutral-900',
        logoLetter: c.name.charAt(0).toUpperCase(),
        contactEmail: c.contact_email,
        contactPhone: c.contact_phone,
        openVacanciesCount: 0,
      };

      return { company, role: memberRow.member_role, error: null };
    } catch (err: any) {
      return { company: null, role: null, error: err };
    }
  },

  /**
   * Update Company Profile Information
   */
  async updateCompany(
    companyId: string,
    updates: Partial<Company>
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.specificAddress) dbUpdates.specific_address = updates.specificAddress;
      if (updates.contactEmail) dbUpdates.contact_email = updates.contactEmail;
      if (updates.contactPhone) dbUpdates.contact_phone = updates.contactPhone;
      if (updates.employeeBand) dbUpdates.employee_band = updates.employeeBand;
      if (updates.facilities) dbUpdates.facilities = updates.facilities;
      if (updates.udyamRegistrationNo) dbUpdates.udyam_registration_no = updates.udyamRegistrationNo;
      if (updates.gstin) dbUpdates.gstin = updates.gstin;
      if (updates.factoryLicenseNo) dbUpdates.factory_license_no = updates.factoryLicenseNo;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await (client as any)
        .from('companies')
        .update(dbUpdates)
        .eq('id', companyId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Submit Statutory Document for Plant Verification
   */
  async uploadVerificationDocument(
    companyId: string,
    file: File,
    docType: string,
    documentNumber?: string
  ): Promise<{ data: any; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { data: { documentNumber, path: `demo-docs/${file.name}` }, error: null };
    }

    try {
      const { data: uploadData, error: uploadErr } = await storageService.uploadVerificationDocument(
        companyId,
        docType,
        file
      );
      const storagePath = uploadData?.path;
      if (uploadErr || !storagePath) throw uploadErr || new Error('Document upload failed');

      // Save or update verification record
      const { data: docRecord, error: dbErr } = await (client as any)
        .from('company_verifications')
        .upsert(
          {
            company_id: companyId,
            status: 'submitted',
            notes: `Submitted ${docType} document for physical/registry audit: ${file.name}`,
          },
          { onConflict: 'company_id' }
        );

      return { data: docRecord, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * Fetch Applicants who applied to this company's jobs
   */
  async getApplicants(companyId: string): Promise<{ data: any[]; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await client
        .from('applications')
        .select(`
          *,
          jobs!inner(title, company_id),
          candidate_profiles(
            current_residence,
            highest_qualification,
            trade_specialization,
            total_experience_months,
            profiles(full_name, phone, email)
          )
        `)
        .eq('jobs.company_id', companyId)
        .order('applied_date', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: err };
    }
  },

  /**
   * Update Candidate Application Status (Shortlisted, Interview Scheduled, Selected, Rejected)
   */
  async updateApplicationStatus(
    applicationId: string,
    newStatus: string,
    notes?: string,
    interviewDate?: string
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      const updates: any = {
        current_status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (notes) updates.interviewer_notes = notes;
      if (interviewDate) updates.interview_scheduled_date = interviewDate;

      const { error } = await (client as any)
        .from('applications')
        .update(updates)
        .eq('id', applicationId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },
};
