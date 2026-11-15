import { getSupabaseClient } from '../lib/supabase/client';
import { storageService } from './storageService';
import { Company, SAMPLE_COMPANIES, INITIAL_APPLICATIONS } from '../data/demo-data';

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
      return {
        company: SAMPLE_COMPANIES[0],
        role: 'owner',
        error: null,
      };
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
        logoPlaceholderBg: 'bg-industrial-900',
        logoLetter: c.name.charAt(0).toUpperCase(),
        contactEmail: c.contact_email,
        contactPhone: c.contact_phone,
        openVacanciesCount: 0,
      };

      return { company, role: memberRow.member_role, error: null };
    } catch (err: any) {
      return { company: SAMPLE_COMPANIES[0], role: 'owner', error: err };
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
      if (updates.specificAddress) dbUpdates.specific_address = updates.specificAddress;
      if (updates.industry) dbUpdates.industry = updates.industry;
      if (updates.employeeBand) dbUpdates.employee_band = updates.employeeBand;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.facilities) dbUpdates.facilities = updates.facilities;
      if (updates.contactEmail) dbUpdates.contact_email = updates.contactEmail;
      if (updates.contactPhone) dbUpdates.contact_phone = updates.contactPhone;
      if (updates.udyamRegistrationNo) dbUpdates.udyam_registration_no = updates.udyamRegistrationNo;
      if (updates.gstin) dbUpdates.gstin = updates.gstin;
      if (updates.factoryLicenseNo) dbUpdates.factory_license_no = updates.factoryLicenseNo;

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
   * Upload Company Verification Document & Register verification record
   */
  async uploadVerificationDocument(
    companyId: string,
    docType: 'gstin_cert' | 'udyam_cert' | 'midc_allotment' | 'factory_license',
    file: File,
    userId: string
  ): Promise<{ data: any; error: Error | null }> {
    const { data: uploadData, error: uploadError } = await storageService.uploadVerificationDocument(
      companyId,
      docType,
      file
    );

    if (uploadError || !uploadData) {
      return { data: null, error: uploadError || new Error('Upload failed') };
    }

    const client = getSupabaseClient();
    if (!client) {
      return { data: { id: `demo-doc-${Date.now()}` }, error: null };
    }

    try {
      // 1. Insert into company_documents
      const { data: docRecord, error: docError } = await (client as any)
        .from('company_documents')
        .insert({
          company_id: companyId,
          document_type: docType,
          file_path: uploadData.path,
          file_name: uploadData.name,
          uploaded_by: userId,
        })
        .select()
        .single();

      if (docError) throw docError;

      // 2. Upsert verification request
      await (client as any)
        .from('company_verifications')
        .upsert(
          {
            company_id: companyId,
            status: 'pending',
            notes: `Document uploaded: ${docType}`,
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
      return { data: INITIAL_APPLICATIONS, error: null };
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
      return { data: INITIAL_APPLICATIONS, error: err };
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
        interviewer_notes: notes || null,
      };

      if (interviewDate) {
        updates.interview_scheduled_date = interviewDate;
      }

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
