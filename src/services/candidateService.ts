import { getSupabaseClient } from '../lib/supabase/client';
import { storageService } from './storageService';
import { CandidateProfile, JobApplication, SAMPLE_CANDIDATE, INITIAL_APPLICATIONS } from '../data/demo-data';

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
      return {
        profile: SAMPLE_CANDIDATE,
        candidateId: 'demo-cand-001',
        error: null,
      };
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
        currentResidence: profileRow.current_residence || 'Chakan Ambethan Chowk',
        highestQualification: profileRow.highest_qualification,
        tradeSpecialization: profileRow.trade_specialization || undefined,
        totalExperienceMonths: profileRow.total_experience_months || 0,
        currentDesignation: profileRow.current_designation || 'Technician',
        preferredShifts: ['Rotational 3-Shifts (A/B/C)'],
        preferredClusters: ['Chakan MIDC Phase 1', 'Chakan MIDC Phase 2'],
        expectedSalaryInHand: profileRow.expected_salary_in_hand || 18000,
        resumeFileName: latestResume,
        profileCompletionPercentage: profileRow.profile_completion_percentage || 50,
        readyToJoinDays: profileRow.ready_to_join_days || 0,
      };

      return { profile, candidateId: profileRow.id, error: null };
    } catch (err: any) {
      return { profile: SAMPLE_CANDIDATE, candidateId: 'demo-cand-001', error: err };
    }
  },

  /**
   * Update Candidate Profile
   */
  async updateCandidateProfile(
    userId: string,
    updates: Partial<CandidateProfile>
  ): Promise<{ error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    try {
      // Calculate completion score
      let score = 30;
      if (updates.currentResidence) score += 15;
      if (updates.tradeSpecialization) score += 15;
      if (updates.expectedSalaryInHand) score += 10;
      if (updates.totalExperienceMonths && updates.totalExperienceMonths > 0) score += 15;
      if (updates.resumeFileName) score += 15;
      score = Math.min(100, score);

      const dbUpdates: any = {
        profile_completion_percentage: score,
      };

      if (updates.currentResidence !== undefined) dbUpdates.current_residence = updates.currentResidence;
      if (updates.highestQualification !== undefined) dbUpdates.highest_qualification = updates.highestQualification;
      if (updates.tradeSpecialization !== undefined) dbUpdates.trade_specialization = updates.tradeSpecialization;
      if (updates.totalExperienceMonths !== undefined) dbUpdates.total_experience_months = updates.totalExperienceMonths;
      if (updates.currentDesignation !== undefined) dbUpdates.current_designation = updates.currentDesignation;
      if (updates.expectedSalaryInHand !== undefined) dbUpdates.expected_salary_in_hand = updates.expectedSalaryInHand;
      if (updates.readyToJoinDays !== undefined) dbUpdates.ready_to_join_days = updates.readyToJoinDays;

      const { error } = await (client as any)
        .from('candidate_profiles')
        .update(dbUpdates)
        .eq('user_id', userId);

      if (error) throw error;

      // Update profile name / phone if provided
      if (updates.fullName || updates.phone) {
        const profUpdates: any = {};
        if (updates.fullName) profUpdates.full_name = updates.fullName;
        if (updates.phone) profUpdates.phone = updates.phone;

        await (client as any).from('profiles').update(profUpdates).eq('id', userId);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Upload and register candidate resume
   */
  async uploadResume(
    userId: string,
    candidateId: string,
    file: File
  ): Promise<{ resumeRecord: any; error: Error | null }> {
    const { data: uploadData, error: uploadError } = await storageService.uploadResume(userId, file);
    if (uploadError || !uploadData) {
      return { resumeRecord: null, error: uploadError || new Error('Upload failed') };
    }

    const client = getSupabaseClient();
    if (!client) {
      return {
        resumeRecord: {
          file_name: uploadData.name,
          file_path: uploadData.path,
        },
        error: null,
      };
    }

    try {
      const { data, error } = await (client as any)
        .from('candidate_resumes')
        .insert({
          candidate_id: candidateId,
          file_path: uploadData.path,
          file_name: uploadData.name,
          file_size_bytes: uploadData.sizeBytes,
          mime_type: uploadData.mimeType,
          is_default: true,
        })
        .select()
        .single();

      if (error) throw error;
      return { resumeRecord: data, error: null };
    } catch (err: any) {
      return { resumeRecord: null, error: err };
    }
  },

  /**
   * Submit Job Application
   */
  async submitApplication(
    jobId: string,
    candidateId: string,
    candidateNotes?: string,
    resumeId?: string
  ): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: true, message: 'Application submitted successfully (Demo Mode).' };
    }

    try {
      const { data, error } = await (client as any)
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateId,
          resume_id: resumeId || null,
          candidate_notes: candidateNotes || null,
          current_status: 'Applied',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: 'You have already submitted an application for this vacancy.' };
        }
        throw error;
      }

      return { success: true, message: 'Application submitted successfully to plant HR!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to submit application.' };
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
      return { applications: INITIAL_APPLICATIONS, error: null };
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
        jobTitle: row.jobs?.title || 'Machining Vacancy',
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
      return { applications: INITIAL_APPLICATIONS, error: err };
    }
  },

  /**
   * Saved Jobs Management
   */
  async getSavedJobIds(candidateId: string): Promise<string[]> {
    const client = getSupabaseClient();
    if (!client) return ['job-101', 'job-104'];

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
