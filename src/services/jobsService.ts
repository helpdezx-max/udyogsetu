import { getSupabaseClient } from '../lib/supabase/client';
import { JobVacancy, SAMPLE_JOBS } from '../data/demo-data';

export interface JobFilterParams {
  search?: string;
  clusterId?: string;
  category?: string;
  qualification?: string;
  employmentType?: string;
  shift?: string;
  minSalary?: number;
  maxSalary?: number;
  busFacility?: boolean;
  canteenFacility?: boolean;
  walkInOnly?: boolean;
  page?: number;
  pageSize?: number;
}

export const jobsService = {
  /**
   * Fetch Jobs with Comprehensive Filtering & Full-Text Search
   */
  async getJobs(params: JobFilterParams = {}): Promise<{
    jobs: JobVacancy[];
    totalCount: number;
    error: Error | null;
  }> {
    const client = getSupabaseClient();
    if (!client) {
      // Graceful demo-data fallback
      let filtered = [...SAMPLE_JOBS].filter((j) => j.status === 'active');

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.companyName.toLowerCase().includes(q) ||
            j.specificLocation.toLowerCase().includes(q) ||
            j.requiredSkills.some((s) => s.toLowerCase().includes(q))
        );
      }
      if (params.clusterId && params.clusterId !== 'all') {
        filtered = filtered.filter(
          (j) => j.clusterName.toLowerCase().includes(params.clusterId!.toLowerCase())
        );
      }
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter((j) => j.category === params.category);
      }
      if (params.qualification && params.qualification !== 'all') {
        filtered = filtered.filter((j) => j.qualificationRequired === params.qualification);
      }
      if (params.employmentType && params.employmentType !== 'all') {
        filtered = filtered.filter((j) => j.employmentType === params.employmentType);
      }
      if (params.shift && params.shift !== 'all') {
        filtered = filtered.filter((j) => j.shiftType === params.shift);
      }
      if (params.minSalary) {
        filtered = filtered.filter((j) => j.salary.inHandMonthly >= params.minSalary!);
      }
      if (params.maxSalary) {
        filtered = filtered.filter((j) => j.salary.inHandMonthly <= params.maxSalary!);
      }
      if (params.busFacility) {
        filtered = filtered.filter((j) => j.busFacilityProvided);
      }
      if (params.canteenFacility) {
        filtered = filtered.filter((j) => j.canteenProvided);
      }
      if (params.walkInOnly) {
        filtered = filtered.filter((j) => j.walkInAvailable);
      }

      return { jobs: filtered, totalCount: filtered.length, error: null };
    }

    try {
      let query = client
        .from('jobs')
        .select('*, companies(name, verification_status, logo_url), industrial_clusters(name)', {
          count: 'exact',
        })
        .eq('status', 'active');

      if (params.search) {
        query = query.ilike('title', `%${params.search}%`);
      }
      if (params.clusterId && params.clusterId !== 'all') {
        query = query.eq('cluster_id', params.clusterId);
      }
      if (params.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }
      if (params.qualification && params.qualification !== 'all') {
        query = query.eq('qualification_required', params.qualification);
      }
      if (params.employmentType && params.employmentType !== 'all') {
        query = query.eq('employment_type', params.employmentType as any);
      }
      if (params.shift && params.shift !== 'all') {
        query = query.eq('shift_type', params.shift);
      }
      if (params.minSalary) {
        query = query.gte('salary_in_hand_monthly', params.minSalary);
      }
      if (params.maxSalary) {
        query = query.lte('salary_in_hand_monthly', params.maxSalary);
      }
      if (params.busFacility) {
        query = query.eq('bus_facility_provided', true);
      }
      if (params.canteenFacility) {
        query = query.eq('canteen_provided', true);
      }
      if (params.walkInOnly) {
        query = query.eq('walk_in_available', true);
      }

      const page = params.page || 1;
      const pageSize = params.pageSize || 30;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Transform DB rows to JobVacancy interface
      const jobs: JobVacancy[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        companyId: row.company_id,
        companyName: row.companies?.name || 'Verified Industrial Unit',
        clusterName: row.industrial_clusters?.name || 'Chakan Industrial Belt',
        specificLocation: row.specific_location,
        industry: row.industry,
        category: row.category,
        employmentType: row.employment_type,
        qualificationRequired: row.qualification_required,
        experienceRequired: row.experience_required,
        shiftType: row.shift_type,
        openingsCount: row.openings_count,
        salary: {
          inHandMonthly: row.salary_in_hand_monthly,
          grossMonthly: row.salary_gross_monthly,
          pfDeductionMonthly: row.salary_pf_monthly,
          esicCovered: row.salary_esic_covered,
          otHourlyRate: row.salary_ot_hourly_rate,
          attendanceBonusMonthly: row.salary_attendance_bonus,
          canteenDeductionMonthly: row.salary_canteen_deduction,
        },
        busFacilityProvided: row.bus_facility_provided,
        busRoutes: row.bus_routes,
        canteenProvided: row.canteen_provided,
        accommodationHelp: row.accommodation_help,
        walkInAvailable: row.walk_in_available,
        walkInDetails: row.walk_in_available
          ? {
              interviewDates: row.walk_in_dates || 'Daily',
              reportingTime: row.walk_in_time || '9:00 AM',
              venue: row.walk_in_venue || row.specific_location,
              contactPerson: row.walk_in_contact_person || 'HR Desk',
              documentsToCarry: row.walk_in_documents || [],
            }
          : undefined,
        recruitmentTier: row.recruitment_tier,
        description: row.description,
        responsibilities: row.responsibilities || [],
        requiredSkills: row.required_skills || [],
        genderPreference: row.gender_preference,
        postedDaysAgo: Math.max(
          0,
          Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24))
        ),
        lastConfirmedDate: row.last_confirmed_date,
        deadlineDate: row.deadline_date || '',
        status: row.status,
      }));

      return { jobs, totalCount: count || jobs.length, error: null };
    } catch (err: any) {
      console.warn('Supabase jobs query error, using demo fallback:', err.message);
      return { jobs: SAMPLE_JOBS, totalCount: SAMPLE_JOBS.length, error: err };
    }
  },

  /**
   * Fetch Single Job Vacancy by ID
   */
  async getJobById(jobId: string): Promise<{ job: JobVacancy | null; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      const match = SAMPLE_JOBS.find((j) => j.id === jobId) || null;
      return { job: match, error: null };
    }

    try {
      const { data, error } = await client
        .from('jobs')
        .select('*, companies(name, verification_status, logo_url), industrial_clusters(name)')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      if (!data) return { job: null, error: null };

      const row = data as any;
      const job: JobVacancy = {
        id: row.id,
        title: row.title,
        companyId: row.company_id,
        companyName: row.companies?.name || 'Verified Plant',
        clusterName: row.industrial_clusters?.name || 'Chakan Cluster',
        specificLocation: row.specific_location,
        industry: row.industry,
        category: row.category,
        employmentType: row.employment_type,
        qualificationRequired: row.qualification_required,
        experienceRequired: row.experience_required,
        shiftType: row.shift_type,
        openingsCount: row.openings_count,
        salary: {
          inHandMonthly: row.salary_in_hand_monthly,
          grossMonthly: row.salary_gross_monthly,
          pfDeductionMonthly: row.salary_pf_monthly,
          esicCovered: row.salary_esic_covered,
          otHourlyRate: row.salary_ot_hourly_rate,
          attendanceBonusMonthly: row.salary_attendance_bonus,
          canteenDeductionMonthly: row.salary_canteen_deduction,
        },
        busFacilityProvided: row.bus_facility_provided,
        busRoutes: row.bus_routes,
        canteenProvided: row.canteen_provided,
        accommodationHelp: row.accommodation_help,
        walkInAvailable: row.walk_in_available,
        walkInDetails: row.walk_in_available
          ? {
              interviewDates: row.walk_in_dates || 'Daily',
              reportingTime: row.walk_in_time || '9:00 AM',
              venue: row.walk_in_venue || row.specific_location,
              contactPerson: row.walk_in_contact_person || 'HR Desk',
              documentsToCarry: row.walk_in_documents || [],
            }
          : undefined,
        recruitmentTier: row.recruitment_tier,
        description: row.description,
        responsibilities: row.responsibilities || [],
        requiredSkills: row.required_skills || [],
        genderPreference: row.gender_preference,
        postedDaysAgo: Math.max(
          0,
          Math.floor((Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24))
        ),
        lastConfirmedDate: row.last_confirmed_date,
        deadlineDate: row.deadline_date || '',
        status: row.status,
      };

      return { job, error: null };
    } catch (err: any) {
      const match = SAMPLE_JOBS.find((j) => j.id === jobId) || null;
      return { job: match, error: err };
    }
  },

  /**
   * Post a New Industrial Job Vacancy
   */
  async createJob(jobData: any, userId: string): Promise<{ data: any; error: Error | null }> {
    const client = getSupabaseClient();
    if (!client) {
      return { data: { id: `demo-job-${Date.now()}`, ...jobData }, error: null };
    }

    try {
      const { data, error } = await (client as any)
        .from('jobs')
        .insert({
          title: jobData.title,
          company_id: jobData.companyId,
          posted_by: userId,
          cluster_id: jobData.clusterId || 'chakan-phase-1',
          specific_location: jobData.specificLocation,
          industry: jobData.industry,
          category: jobData.category,
          employment_type: jobData.employmentType,
          qualification_required: jobData.qualificationRequired,
          experience_required: jobData.experienceRequired,
          shift_type: jobData.shiftType,
          openings_count: jobData.openingsCount || 1,
          salary_in_hand_monthly: jobData.salary.inHandMonthly,
          salary_gross_monthly: jobData.salary.grossMonthly,
          salary_pf_monthly: jobData.salary.pfDeductionMonthly || 0,
          salary_esic_covered: jobData.salary.esicCovered ?? true,
          salary_ot_hourly_rate: jobData.salary.otHourlyRate || null,
          salary_attendance_bonus: jobData.salary.attendanceBonusMonthly || 0,
          salary_canteen_deduction: jobData.salary.canteenDeductionMonthly || 0,
          bus_facility_provided: jobData.busFacilityProvided || false,
          bus_routes: jobData.busRoutes || [],
          canteen_provided: jobData.canteenProvided || false,
          accommodation_help: jobData.accommodationHelp || false,
          walk_in_available: jobData.walkInAvailable || false,
          walk_in_dates: jobData.walkInDetails?.interviewDates || null,
          walk_in_time: jobData.walk_inDetails?.reportingTime || null,
          walk_in_venue: jobData.walk_inDetails?.venue || null,
          walk_in_contact_person: jobData.walk_inDetails?.contactPerson || null,
          walk_in_contact_phone: jobData.walk_inDetails?.contactPhone || null,
          walk_in_documents: jobData.walk_inDetails?.documentsToCarry || [],
          recruitment_tier: jobData.recruitmentTier || 'verified_direct',
          description: jobData.description,
          responsibilities: jobData.responsibilities || [],
          required_skills: jobData.requiredSkills || [],
          gender_preference: jobData.genderPreference || 'All Eligible',
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * Update Job Vacancy Status (e.g. close, pause, activate)
   */
  async updateJobStatus(jobId: string, status: 'active' | 'closed' | 'under_moderation' | 'draft') {
    const client = getSupabaseClient();
    if (!client) return { error: null };

    return (client as any).from('jobs').update({ status }).eq('id', jobId);
  },
};
