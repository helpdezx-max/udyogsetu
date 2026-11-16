import { getSupabaseClient } from '../lib/supabase/client';
import { storageService } from './storageService';
import { CandidateProfile, JobApplication } from '../data/demo-data';

export const candidateService = {
  /**
   * Fetch Candidate Profile with related details
   */
  async getCandidateProfile(userId: string): Promise<{
    profile: CandidateProfile | null;
    candidateId: string | null;
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { profile: null, candidateId: null, error: null };
    }

    try {
      const { data: cand, error: candError } = await client
        .from('candidate_profiles')
        .select('*, profiles(full_name, email, phone)')
        .eq('user_id', userId)
        .single();

      if (candError) throw candError;
      if (!cand) return { profile: null, candidateId: null, error: null };

      // Fetch saved resumes
      const { data: resumes } = await client
        .from('candidate_resumes')
        .select('*')
        .eq('candidate_id', (cand as any).id)
        .order('uploaded_at', { ascending: false });

      const profileRow = cand as any;
      const resumesArr = resumes as any[] | null;
      const latestResume = resumesArr && resumesArr.length > 0 ? resumesArr[0].file_name : undefined;

      const profile: CandidateProfile = {
        id: profileRow.id,
        fullName: profileRow.profiles?.full_name || 'Candidate',
        phone: profileRow.profiles?.phone || '',
        email: profileRow.profiles?.email || '',
        currentResidence: profileRow.current_residence || '',
        highestQualification: profileRow.highest_qualification,
        tradeSpecialization: profileRow.trade_specialization || undefined,
        totalExperienceMonths: profileRow.total_experience_months || 0,
        currentDesignation: profileRow.current_designation || 'Technician',
        preferredShifts: ['Rotational 3-Shifts (A/B/C)'],
        preferredClusters: ['Chakan MIDC Phase 1', 'Chakan MIDC Phase 2'],
        expectedSalaryInHand: profileRow.expected_salary_in_hand || 0,
        resumeFileName: latestResume,
        profileCompletionPercentage: profileRow.profile_completion_percentage || 0,
        readyToJoinDays: profileRow.ready_to_join_days || 0,
      };

      return { profile, candidateId: profileRow.id, error: null };
    } catch (err: any) {
      return { profile: null, candidateId: null, error: err };
    }
  },

  /**
   * Update Candidate Profile
   */
  async updateCandidateProfile(
    candidateId: string,
    updates: Partial<CandidateProfile>
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      const dbUpdates: any = {};
      if (updates.highestQualification) dbUpdates.highest_qualification = updates.highestQualification;
      if (updates.tradeSpecialization !== undefined) dbUpdates.trade_specialization = updates.tradeSpecialization;
      if (updates.totalExperienceMonths !== undefined) dbUpdates.total_experience_months = updates.totalExperienceMonths;
      if (updates.currentDesignation) dbUpdates.current_designation = updates.currentDesignation;
      if (updates.expectedSalaryInHand !== undefined) dbUpdates.expected_salary_in_hand = updates.expectedSalaryInHand;
      if (updates.currentResidence) dbUpdates.current_residence = updates.currentResidence;
      if (updates.readyToJoinDays !== undefined) dbUpdates.ready_to_join_days = updates.readyToJoinDays;
      if (updates.profileCompletionPercentage !== undefined)
        dbUpdates.profile_completion_percentage = updates.profileCompletionPercentage;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await (client as any)
        .from('candidate_profiles')
        .update(dbUpdates)
        .eq('id', candidateId);

      if (error) throw error;
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Upload Candidate Resume & record metadata
   */
  async uploadResume(
    candidateId: string,
    file: File
  ): Promise<{ url: string | null; fileName: string | null; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { url: null, fileName: file.name, error: null };
    }

    try {
      const { data: uploadData, error: uploadErr } = await storageService.uploadResume(candidateId, file);
      const storagePath = uploadData?.path;
      if (uploadErr || !storagePath) throw uploadErr || new Error('Upload failed');

      // Save metadata in candidate_resumes table
      const { error: dbErr } = await (client as any).from('candidate_resumes').insert({
        candidate_id: candidateId,
        storage_path: storagePath,
        file_name: file.name,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
        is_primary: true,
      });

      if (dbErr) throw dbErr;

      return { url: storagePath, fileName: file.name, error: null };
    } catch (err: any) {
      return { url: null, fileName: null, error: err };
    }
  },

  /**
   * Submit Job Application with Verification Checklist
   */
  async submitApplication(
    candidateId: string,
    jobId: string,
    candidateNotes?: string
  ): Promise<{ success: boolean; applicationId: string | null; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: true, applicationId: `app-${Date.now()}`, error: null };
    }

    try {
      const { data, error } = await (client as any)
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          current_status: 'Applied',
          candidate_notes: candidateNotes || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, applicationId: null, error: new Error('You have already applied for this vacancy.') };
        }
        throw error;
      }

      return { success: true, applicationId: data?.id, error: null };
    } catch (err: any) {
      return { success: false, applicationId: null, error: err };
    }
  },

  /**
   * Fetch Candidate's Submitted Applications
   */
  async getCandidateApplications(candidateId: string): Promise<{
    applications: JobApplication[];
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      return { applications: [], error: null };
    }

    try {
      const { data, error } = await client
        .from('applications')
        .select('*, jobs(title, specific_location, companies(name), industrial_clusters(name))')
        .eq('candidate_id', candidateId)
        .order('applied_date', { ascending: false });

      if (error) throw error;

      const applications: JobApplication[] = (data || []).map((row: any) => ({
        id: row.id,
        jobId: row.job_id,
        jobTitle: row.jobs?.title || 'Industrial Vacancy',
        companyName: row.jobs?.companies?.name || 'Verified Plant',
        clusterName: row.jobs?.industrial_clusters?.name || 'Chakan MIDC',
        appliedDate: new Date(row.applied_date).toLocaleDateString('en-GB'),
        currentStatus: row.current_status,
        interviewScheduledDate: row.interview_scheduled_date || undefined,
        interviewVenue: row.interview_venue || undefined,
        interviewerNotes: row.interviewer_notes || undefined,
        salaryOffered: row.salary_offered || undefined,
        candidateNotes: row.candidate_notes || undefined,
      }));

      return { applications, error: null };
    } catch (err: any) {
      return { applications: [], error: err };
    }
  },

  /**
   * Saved Jobs Management
   */
  async getSavedJobIds(candidateId: string): Promise<string[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data } = await client
        .from('candidate_saved_jobs')
        .select('job_id')
        .eq('candidate_id', candidateId);

      return (data || []).map((r: any) => r.job_id);
    } catch {
      return [];
    }
  },

  async toggleSaveJob(candidateId: string, jobId: string, isCurrentlySaved: boolean): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return !isCurrentlySaved;

    try {
      if (isCurrentlySaved) {
        await client
          .from('candidate_saved_jobs')
          .delete()
          .match({ candidate_id: candidateId, job_id: jobId });
        return false;
      } else {
        await (client as any)
          .from('candidate_saved_jobs')
          .insert({ candidate_id: candidateId, job_id: jobId });
        return true;
      }
    } catch {
      return isCurrentlySaved;
    }
  },
};
