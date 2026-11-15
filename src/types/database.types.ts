export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleType = 'candidate' | 'employer' | 'agency' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string;
          avatar_url: string | null;
          preferred_language: 'en' | 'mr' | 'hi';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name: string;
          avatar_url?: string | null;
          preferred_language?: 'en' | 'mr' | 'hi';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          preferred_language?: 'en' | 'mr' | 'hi';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRoleType;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRoleType;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: UserRoleType;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          notification_email: boolean;
          notification_sms: boolean;
          notification_whatsapp: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_email?: boolean;
          notification_sms?: boolean;
          notification_whatsapp?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_email?: boolean;
          notification_sms?: boolean;
          notification_whatsapp?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidate_profiles: {
        Row: {
          id: string;
          user_id: string;
          current_residence: string | null;
          highest_qualification: string;
          trade_specialization: string | null;
          diploma_specialization: string | null;
          total_experience_months: number;
          current_designation: string | null;
          expected_salary_in_hand: number | null;
          ready_to_join_days: number;
          profile_completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_residence?: string | null;
          highest_qualification: string;
          trade_specialization?: string | null;
          diploma_specialization?: string | null;
          total_experience_months?: number;
          current_designation?: string | null;
          expected_salary_in_hand?: number | null;
          ready_to_join_days?: number;
          profile_completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_residence?: string | null;
          highest_qualification?: string;
          trade_specialization?: string | null;
          diploma_specialization?: string | null;
          total_experience_months?: number;
          current_designation?: string | null;
          expected_salary_in_hand?: number | null;
          ready_to_join_days?: number;
          profile_completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidate_education: {
        Row: {
          id: string;
          candidate_id: string;
          institution_name: string;
          degree_diploma: string;
          field_of_study: string | null;
          passing_year: number | null;
          percentage_or_cgpa: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          institution_name: string;
          degree_diploma: string;
          field_of_study?: string | null;
          passing_year?: number | null;
          percentage_or_cgpa?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          institution_name?: string;
          degree_diploma?: string;
          field_of_study?: string | null;
          passing_year?: number | null;
          percentage_or_cgpa?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      candidate_experience: {
        Row: {
          id: string;
          candidate_id: string;
          company_name: string;
          designation: string;
          industrial_cluster: string | null;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          responsibilities: string | null;
          machines_operated: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          company_name: string;
          designation: string;
          industrial_cluster?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          responsibilities?: string | null;
          machines_operated?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          company_name?: string;
          designation?: string;
          industrial_cluster?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          is_current?: boolean;
          responsibilities?: string | null;
          machines_operated?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      candidate_skills: {
        Row: {
          id: string;
          candidate_id: string;
          skill_name: string;
          proficiency_level: 'beginner' | 'intermediate' | 'expert';
          years_of_experience: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          skill_name: string;
          proficiency_level?: 'beginner' | 'intermediate' | 'expert';
          years_of_experience?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          skill_name?: string;
          proficiency_level?: 'beginner' | 'intermediate' | 'expert';
          years_of_experience?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      candidate_preferences: {
        Row: {
          id: string;
          candidate_id: string;
          preferred_shifts: string[];
          preferred_clusters: string[];
          min_salary_in_hand: number;
          bus_facility_required: boolean;
          canteen_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          preferred_shifts?: string[];
          preferred_clusters?: string[];
          min_salary_in_hand?: number;
          bus_facility_required?: boolean;
          canteen_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          preferred_shifts?: string[];
          preferred_clusters?: string[];
          min_salary_in_hand?: number;
          bus_facility_required?: boolean;
          canteen_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      candidate_resumes: {
        Row: {
          id: string;
          candidate_id: string;
          file_path: string;
          file_name: string;
          file_size_bytes: number;
          mime_type: string;
          is_default: boolean;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          file_path: string;
          file_name: string;
          file_size_bytes: number;
          mime_type?: string;
          is_default?: boolean;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          file_path?: string;
          file_name?: string;
          file_size_bytes?: number;
          mime_type?: string;
          is_default?: boolean;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      candidate_saved_jobs: {
        Row: {
          id: string;
          candidate_id: string;
          job_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          job_id: string;
          saved_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          job_id?: string;
          saved_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          cluster_id: string | null;
          specific_address: string;
          industry: string;
          employee_band: '50-200' | '200-500' | '500-1500' | '1500+';
          direct_employer: boolean;
          verification_status: 'pending' | 'verified' | 'rejected';
          udyam_registration_no: string | null;
          gstin: string | null;
          factory_license_no: string | null;
          verification_audit_date: string | null;
          established_year: number | null;
          description: string | null;
          facilities: string[];
          contact_email: string;
                    contact_phone: string;
          logo_url: string | null;
          legal_name: string | null;
          trade_name: string | null;
          business_type: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship' | 'Foreign Subsidiary' | 'Government / PSU';
          company_website: string | null;
          registered_office_address: string | null;
          factory_address: string | null;
          authorized_representative_name: string | null;
          authorized_representative_designation: string | null;
          authorized_representative_email: string | null;
          authorized_representative_phone: string | null;
          is_email_verified: boolean;
          is_address_verified: boolean;
          is_rep_verified: boolean;
          trust_badge_company_verified: boolean;
          trust_badge_rep_verified: boolean;
          verification_stage: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended' | 'expired';
          next_review_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          cluster_id?: string | null;
          specific_address: string;
          industry: string;
          employee_band: '50-200' | '200-500' | '500-1500' | '1500+';
          direct_employer?: boolean;
          verification_status?: 'pending' | 'verified' | 'rejected';
          udyam_registration_no?: string | null;
          gstin?: string | null;
          factory_license_no?: string | null;
          verification_audit_date?: string | null;
          established_year?: number | null;
          description?: string | null;
          facilities?: string[];
          contact_email: string;
          contact_phone: string;
          logo_url?: string | null;
          legal_name?: string | null;
          trade_name?: string | null;
          business_type?: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship' | 'Foreign Subsidiary' | 'Government / PSU';
          company_website?: string | null;
          registered_office_address?: string | null;
          factory_address?: string | null;
          authorized_representative_name?: string | null;
          authorized_representative_designation?: string | null;
          authorized_representative_email?: string | null;
          authorized_representative_phone?: string | null;
          is_email_verified?: boolean;
          is_address_verified?: boolean;
          is_rep_verified?: boolean;
          trust_badge_company_verified?: boolean;
          trust_badge_rep_verified?: boolean;
          verification_stage?: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended' | 'expired';
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          cluster_id?: string | null;
          specific_address?: string;
          industry?: string;
          employee_band?: '50-200' | '200-500' | '500-1500' | '1500+';
          direct_employer?: boolean;
          verification_status?: 'pending' | 'verified' | 'rejected';
          udyam_registration_no?: string | null;
          gstin?: string | null;
          factory_license_no?: string | null;
          verification_audit_date?: string | null;
          established_year?: number | null;
          description?: string | null;
          facilities?: string[];
          contact_email?: string;
          contact_phone?: string;
          logo_url?: string | null;
          legal_name?: string | null;
          trade_name?: string | null;
          business_type?: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship' | 'Foreign Subsidiary' | 'Government / PSU';
          company_website?: string | null;
          registered_office_address?: string | null;
          factory_address?: string | null;
          authorized_representative_name?: string | null;
          authorized_representative_designation?: string | null;
          authorized_representative_email?: string | null;
          authorized_representative_phone?: string | null;
          is_email_verified?: boolean;
          is_address_verified?: boolean;
          is_rep_verified?: boolean;
          trust_badge_company_verified?: boolean;
          trust_badge_rep_verified?: boolean;
          verification_stage?: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended' | 'expired';
          next_review_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_locations: {
        Row: {
          id: string;
          company_id: string;
          location_name: string;
          cluster_id: string | null;
          address: string;
          pincode: string;
          is_headquarters: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          location_name: string;
          cluster_id?: string | null;
          address: string;
          pincode: string;
          is_headquarters?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          location_name?: string;
          cluster_id?: string | null;
          address?: string;
          pincode?: string;
          is_headquarters?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      company_members: {
        Row: {
          id: string;
          company_id: string;
          user_id: string;
          member_role: 'owner' | 'recruiter' | 'hiring_manager';
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          user_id: string;
          member_role: 'owner' | 'recruiter' | 'hiring_manager';
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          user_id?: string;
          member_role?: 'owner' | 'recruiter' | 'hiring_manager';
          created_at?: string;
        };
        Relationships: [];
      };
      company_documents: {
        Row: {
          id: string;
          company_id: string;
          document_type: 'gstin_cert' | 'udyam_cert' | 'midc_allotment' | 'factory_license' | 'other';
          file_path: string;
          file_name: string;
          uploaded_by: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          document_type: 'gstin_cert' | 'udyam_cert' | 'midc_allotment' | 'factory_license' | 'other';
          file_path: string;
          file_name: string;
          uploaded_by?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          document_type?: 'gstin_cert' | 'udyam_cert' | 'midc_allotment' | 'factory_license' | 'other';
          file_path?: string;
          file_name?: string;
          uploaded_by?: string | null;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      company_verifications: {
        Row: {
          id: string;
          company_id: string;
          status: 'pending' | 'in_review' | 'verified' | 'rejected';
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          status?: 'pending' | 'in_review' | 'verified' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          status?: 'pending' | 'in_review' | 'verified' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company_id: string;
          posted_by: string;
          agency_id: string | null;
          cluster_id: string;
          specific_location: string;
          industry: string;
          category: string;
          employment_type: 'Permanent / On-Roll' | 'Contractual (Fixed Term)' | 'NEEM / NAPS Trainee' | 'Apprentice';
          qualification_required: string;
          experience_required: string;
          shift_type: string;
          openings_count: number;
          salary_in_hand_monthly: number;
          salary_gross_monthly: number;
          salary_pf_monthly: number;
          salary_esic_covered: boolean;
          salary_ot_hourly_rate: number | null;
          salary_attendance_bonus: number;
          salary_canteen_deduction: number;
          bus_facility_provided: boolean;
          bus_routes: string[];
          canteen_provided: boolean;
          accommodation_help: boolean;
          walk_in_available: boolean;
          walk_in_dates: string | null;
          walk_in_time: string | null;
          walk_in_venue: string | null;
          walk_in_contact_person: string | null;
          walk_in_contact_phone: string | null;
          walk_in_documents: string[];
          recruitment_tier: 'verified_direct' | 'verified_agency' | 'verification_pending';
          description: string;
          responsibilities: string[];
          required_skills: string[];
          gender_preference: 'All Eligible' | 'Male' | 'Female' | 'Female Preferred for Assembly';
          status: 'active' | 'under_moderation' | 'closed' | 'draft' | 'archived';
          last_confirmed_date: string;
          deadline_date: string | null;
          moderation_status: 'draft' | 'pending_review' | 'under_review' | 'additional_info_required' | 'approved' | 'published' | 'rejected' | 'suspended' | 'expired' | 'filled';
          moderation_notes: string | null;
          moderation_reviewed_by: string | null;
          moderation_reviewed_at: string | null;
          vacancy_verification_status: 'verification_pending' | 'source_confirmed' | 'employer_confirmed' | 'verification_required' | 'temporarily_unavailable' | 'expired' | 'filled' | 'suspended';
          vacancy_verified_by: string | null;
          vacancy_verified_at: string;
          vacancy_verification_method: 'employer_dashboard' | 'official_email' | 'hr_contact_verified' | 'source_verified' | 'admin_audit';
          vacancy_evidence_ref: string | null;
          trust_badge_employer_confirmed: boolean;
          trust_badge_source_confirmed: boolean;
          last_reconfirmed_at: string;
          next_reconfirmation_due: string;
          freshness_status: 'newly_published' | 'active' | 'reconfirmation_required' | 'temporarily_unavailable' | 'expired' | 'filled';
          is_duplicate_flagged: boolean;
          duplicate_of_job_id: string | null;
          risk_score: number;
          risk_level: 'low' | 'medium' | 'high' | 'critical';
          risk_flags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company_id: string;
          posted_by: string;
          agency_id?: string | null;
          cluster_id: string;
          specific_location: string;
          industry: string;
          category: string;
          employment_type: 'Permanent / On-Roll' | 'Contractual (Fixed Term)' | 'NEEM / NAPS Trainee' | 'Apprentice';
          qualification_required: string;
          experience_required: string;
          shift_type: string;
          openings_count?: number;
          salary_in_hand_monthly: number;
          salary_gross_monthly: number;
          salary_pf_monthly?: number;
          salary_esic_covered?: boolean;
          salary_ot_hourly_rate?: number | null;
          salary_attendance_bonus?: number;
          salary_canteen_deduction?: number;
          bus_facility_provided?: boolean;
          bus_routes?: string[];
          canteen_provided?: boolean;
          accommodation_help?: boolean;
          walk_in_available?: boolean;
          walk_in_dates?: string | null;
          walk_in_time?: string | null;
          walk_in_venue?: string | null;
          walk_in_contact_person?: string | null;
          walk_in_contact_phone?: string | null;
          walk_in_documents?: string[];
          recruitment_tier?: 'verified_direct' | 'verified_agency' | 'verification_pending';
          description: string;
          responsibilities?: string[];
          required_skills?: string[];
          gender_preference?: 'All Eligible' | 'Male' | 'Female' | 'Female Preferred for Assembly';
          status?: 'active' | 'under_moderation' | 'closed' | 'draft' | 'archived';
          last_confirmed_date?: string;
          deadline_date?: string | null;
          moderation_status?: 'draft' | 'pending_review' | 'under_review' | 'additional_info_required' | 'approved' | 'published' | 'rejected' | 'suspended' | 'expired' | 'filled';
          moderation_notes?: string | null;
          moderation_reviewed_by?: string | null;
          moderation_reviewed_at?: string | null;
          vacancy_verification_status?: 'verification_pending' | 'source_confirmed' | 'employer_confirmed' | 'verification_required' | 'temporarily_unavailable' | 'expired' | 'filled' | 'suspended';
          vacancy_verified_by?: string | null;
          vacancy_verified_at?: string;
          vacancy_verification_method?: 'employer_dashboard' | 'official_email' | 'hr_contact_verified' | 'source_verified' | 'admin_audit';
          vacancy_evidence_ref?: string | null;
          trust_badge_employer_confirmed?: boolean;
          trust_badge_source_confirmed?: boolean;
          last_reconfirmed_at?: string;
          next_reconfirmation_due?: string;
          freshness_status?: 'newly_published' | 'active' | 'reconfirmation_required' | 'temporarily_unavailable' | 'expired' | 'filled';
          is_duplicate_flagged?: boolean;
          duplicate_of_job_id?: string | null;
          risk_score?: number;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          risk_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company_id?: string;
          posted_by?: string;
          agency_id?: string | null;
          cluster_id?: string;
          specific_location?: string;
          industry?: string;
          category?: string;
          employment_type?: 'Permanent / On-Roll' | 'Contractual (Fixed Term)' | 'NEEM / NAPS Trainee' | 'Apprentice';
          qualification_required?: string;
          experience_required?: string;
          shift_type?: string;
          openings_count?: number;
          salary_in_hand_monthly?: number;
          salary_gross_monthly?: number;
          salary_pf_monthly?: number;
          salary_esic_covered?: boolean;
          salary_ot_hourly_rate?: number | null;
          salary_attendance_bonus?: number;
          salary_canteen_deduction?: number;
          bus_facility_provided?: boolean;
          bus_routes?: string[];
          canteen_provided?: boolean;
          accommodation_help?: boolean;
          walk_in_available?: boolean;
          walk_in_dates?: string | null;
          walk_in_time?: string | null;
          walk_in_venue?: string | null;
          walk_in_contact_person?: string | null;
          walk_in_contact_phone?: string | null;
          walk_in_documents?: string[];
          recruitment_tier?: 'verified_direct' | 'verified_agency' | 'verification_pending';
          description?: string;
          responsibilities?: string[];
          required_skills?: string[];
          gender_preference?: 'All Eligible' | 'Male' | 'Female' | 'Female Preferred for Assembly';
          status?: 'active' | 'under_moderation' | 'closed' | 'draft' | 'archived';
          last_confirmed_date?: string;
          deadline_date?: string | null;
          moderation_status?: 'draft' | 'pending_review' | 'under_review' | 'additional_info_required' | 'approved' | 'published' | 'rejected' | 'suspended' | 'expired' | 'filled';
          moderation_notes?: string | null;
          moderation_reviewed_by?: string | null;
          moderation_reviewed_at?: string | null;
          vacancy_verification_status?: 'verification_pending' | 'source_confirmed' | 'employer_confirmed' | 'verification_required' | 'temporarily_unavailable' | 'expired' | 'filled' | 'suspended';
          vacancy_verified_by?: string | null;
          vacancy_verified_at?: string;
          vacancy_verification_method?: 'employer_dashboard' | 'official_email' | 'hr_contact_verified' | 'source_verified' | 'admin_audit';
          vacancy_evidence_ref?: string | null;
          trust_badge_employer_confirmed?: boolean;
          trust_badge_source_confirmed?: boolean;
          last_reconfirmed_at?: string;
          next_reconfirmation_due?: string;
          freshness_status?: 'newly_published' | 'active' | 'reconfirmation_required' | 'temporarily_unavailable' | 'expired' | 'filled';
          is_duplicate_flagged?: boolean;
          duplicate_of_job_id?: string | null;
          risk_score?: number;
          risk_level?: 'low' | 'medium' | 'high' | 'critical';
          risk_flags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          resume_id: string | null;
          current_status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Joined' | 'Rejected';
          interview_scheduled_date: string | null;
          interview_venue: string | null;
          interviewer_notes: string | null;
          salary_offered: string | null;
          candidate_notes: string | null;
          applied_date: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          resume_id?: string | null;
          current_status?: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Joined' | 'Rejected';
          interview_scheduled_date?: string | null;
          interview_venue?: string | null;
          interviewer_notes?: string | null;
          salary_offered?: string | null;
          candidate_notes?: string | null;
          applied_date?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          resume_id?: string | null;
          current_status?: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Joined' | 'Rejected';
          interview_scheduled_date?: string | null;
          interview_venue?: string | null;
          interviewer_notes?: string | null;
          salary_offered?: string | null;
          candidate_notes?: string | null;
          applied_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      industrial_clusters: {
        Row: {
          id: string;
          city_id: string;
          name: string;
          pincode: string;
          zone: string;
          landmark: string;
          transit_access: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          city_id: string;
          name: string;
          pincode: string;
          zone: string;
          landmark: string;
          transit_access: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          city_id?: string;
          name?: string;
          pincode?: string;
          zone?: string;
          landmark?: string;
          transit_access?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          target_type: string;
          target_id: string;
          details: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          target_type: string;
          target_id: string;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          target_type?: string;
          target_id?: string;
          details?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      moderation_actions: {
        Row: {
          id: string;
          job_id: string | null;
          company_id: string | null;
          reported_by: string | null;
          reason: 'Fake Salary' | 'Demanded Money for Job' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location';
          details: string;
          status: 'pending' | 'resolved' | 'dismissed';
          resolved_by: string | null;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          company_id?: string | null;
          reported_by?: string | null;
          reason: 'Fake Salary' | 'Demanded Money for Job' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location';
          details: string;
          status?: 'pending' | 'resolved' | 'dismissed';
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string | null;
          company_id?: string | null;
          reported_by?: string | null;
          reason?: 'Fake Salary' | 'Demanded Money for Job' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location';
          details?: string;
          status?: 'pending' | 'resolved' | 'dismissed';
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recruitment_agencies: {
        Row: {
          id: string;
          name: string;
          license_number: string;
          contact_email: string;
          contact_phone: string;
          office_address: string;
          agency_type: 'Technical Staffing Agency' | 'Manpower Contractor' | 'Apprentice / NEEM Agent' | 'Executive Search';
          authorized_rep_name: string | null;
          authorized_rep_designation: string | null;
          website_url: string | null;
          recruitment_experience_years: number;
          verification_status: 'pending' | 'verified' | 'rejected';
          verification_stage: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended';
          trust_badge_agency_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          license_number: string;
          contact_email: string;
          contact_phone: string;
          office_address: string;
          agency_type?: 'Technical Staffing Agency' | 'Manpower Contractor' | 'Apprentice / NEEM Agent' | 'Executive Search';
          authorized_rep_name?: string | null;
          authorized_rep_designation?: string | null;
          website_url?: string | null;
          recruitment_experience_years?: number;
          verification_status?: 'pending' | 'verified' | 'rejected';
          verification_stage?: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended';
          trust_badge_agency_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          license_number?: string;
          contact_email?: string;
          contact_phone?: string;
          office_address?: string;
          agency_type?: 'Technical Staffing Agency' | 'Manpower Contractor' | 'Apprentice / NEEM Agent' | 'Executive Search';
          authorized_rep_name?: string | null;
          authorized_rep_designation?: string | null;
          website_url?: string | null;
          recruitment_experience_years?: number;
          verification_status?: 'pending' | 'verified' | 'rejected';
          verification_stage?: 'unverified' | 'verification_submitted' | 'under_review' | 'additional_info_required' | 'verified' | 'rejected' | 'suspended';
          trust_badge_agency_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      company_verification_audits: {
        Row: {
          id: string;
          company_id: string;
          reviewer_id: string | null;
          review_date: string;
          verification_method: 'official_email_domain' | 'gstin_registry_check' | 'udyam_msme_check' | 'midc_plot_allotment_check' | 'factory_license_dish_check' | 'representative_authorization_letter' | 'physical_plant_audit' | 'manual_desk_audit';
          documents_reviewed: string[];
          internal_notes: string | null;
          decision: 'approved' | 'rejected' | 'more_info_needed' | 'suspended' | 'revoked';
          rejection_reason: string | null;
          next_review_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          reviewer_id?: string | null;
          review_date?: string;
          verification_method: 'official_email_domain' | 'gstin_registry_check' | 'udyam_msme_check' | 'midc_plot_allotment_check' | 'factory_license_dish_check' | 'representative_authorization_letter' | 'physical_plant_audit' | 'manual_desk_audit';
          documents_reviewed?: string[];
          internal_notes?: string | null;
          decision: 'approved' | 'rejected' | 'more_info_needed' | 'suspended' | 'revoked';
          rejection_reason?: string | null;
          next_review_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          reviewer_id?: string | null;
          review_date?: string;
          verification_method?: 'official_email_domain' | 'gstin_registry_check' | 'udyam_msme_check' | 'midc_plot_allotment_check' | 'factory_license_dish_check' | 'representative_authorization_letter' | 'physical_plant_audit' | 'manual_desk_audit';
          documents_reviewed?: string[];
          internal_notes?: string | null;
          decision?: 'approved' | 'rejected' | 'more_info_needed' | 'suspended' | 'revoked';
          rejection_reason?: string | null;
          next_review_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      company_agency_authorizations: {
        Row: {
          id: string;
          company_id: string;
          agency_id: string;
          authorization_status: 'pending_company_approval' | 'pending_admin_approval' | 'approved' | 'rejected' | 'revoked' | 'expired';
          scope_of_recruitment: string;
          valid_from: string;
          valid_until: string;
          authorization_letter_doc_path: string | null;
          company_authorized_by: string | null;
          admin_approved_by: string | null;
          trust_badge_authorized_partner: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          agency_id: string;
          authorization_status?: 'pending_company_approval' | 'pending_admin_approval' | 'approved' | 'rejected' | 'revoked' | 'expired';
          scope_of_recruitment: string;
          valid_from?: string;
          valid_until: string;
          authorization_letter_doc_path?: string | null;
          company_authorized_by?: string | null;
          admin_approved_by?: string | null;
          trust_badge_authorized_partner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          agency_id?: string;
          authorization_status?: 'pending_company_approval' | 'pending_admin_approval' | 'approved' | 'rejected' | 'revoked' | 'expired';
          scope_of_recruitment?: string;
          valid_from?: string;
          valid_until?: string;
          authorization_letter_doc_path?: string | null;
          company_authorized_by?: string | null;
          admin_approved_by?: string | null;
          trust_badge_authorized_partner?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      duplicate_job_candidates: {
        Row: {
          id: string;
          job_id: string;
          matched_job_id: string;
          match_type: 'exact_title_company_location' | 'high_description_similarity' | 'same_hr_contact_phone' | 'potential_repost';
          similarity_score: number;
          review_status: 'pending' | 'confirmed_duplicate' | 'dismissed_distinct_plant';
          reviewed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          matched_job_id: string;
          match_type: 'exact_title_company_location' | 'high_description_similarity' | 'same_hr_contact_phone' | 'potential_repost';
          similarity_score: number;
          review_status?: 'pending' | 'confirmed_duplicate' | 'dismissed_distinct_plant';
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          matched_job_id?: string;
          match_type?: 'exact_title_company_location' | 'high_description_similarity' | 'same_hr_contact_phone' | 'potential_repost';
          similarity_score?: number;
          review_status?: 'pending' | 'confirmed_duplicate' | 'dismissed_distinct_plant';
          reviewed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      candidate_reports: {
        Row: {
          id: string;
          report_ticket_no: string;
          reporter_id: string | null;
          job_id: string | null;
          company_id: string | null;
          agency_id: string | null;
          report_category: 'Fake Salary' | 'Demanded Money / Registration Fee' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location' | 'Impersonation' | 'Suspicious External Link' | 'Misleading Employment Terms';
          description: string;
          evidence_file_paths: string[];
          reporter_contact_allowed: boolean;
          investigation_status: 'submitted' | 'under_review' | 'additional_info_required' | 'investigation_ongoing' | 'resolved' | 'dismissed' | 'escalated';
          assigned_investigator_id: string | null;
          internal_investigation_notes: string | null;
          final_decision_notes: string | null;
          action_taken: 'none' | 'warning_issued' | 'job_suspended' | 'employer_suspended' | 'agency_authorization_revoked' | 'banned';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          report_ticket_no: string;
          reporter_id?: string | null;
          job_id?: string | null;
          company_id?: string | null;
          agency_id?: string | null;
          report_category: 'Fake Salary' | 'Demanded Money / Registration Fee' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location' | 'Impersonation' | 'Suspicious External Link' | 'Misleading Employment Terms';
          description: string;
          evidence_file_paths?: string[];
          reporter_contact_allowed?: boolean;
          investigation_status?: 'submitted' | 'under_review' | 'additional_info_required' | 'investigation_ongoing' | 'resolved' | 'dismissed' | 'escalated';
          assigned_investigator_id?: string | null;
          internal_investigation_notes?: string | null;
          final_decision_notes?: string | null;
          action_taken?: 'none' | 'warning_issued' | 'job_suspended' | 'employer_suspended' | 'agency_authorization_revoked' | 'banned';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          report_ticket_no?: string;
          reporter_id?: string | null;
          job_id?: string | null;
          company_id?: string | null;
          agency_id?: string | null;
          report_category?: 'Fake Salary' | 'Demanded Money / Registration Fee' | 'Ghost Vacancy' | 'Unsafe Working Conditions' | 'Incorrect Location' | 'Impersonation' | 'Suspicious External Link' | 'Misleading Employment Terms';
          description?: string;
          evidence_file_paths?: string[];
          reporter_contact_allowed?: boolean;
          investigation_status?: 'submitted' | 'under_review' | 'additional_info_required' | 'investigation_ongoing' | 'resolved' | 'dismissed' | 'escalated';
          assigned_investigator_id?: string | null;
          internal_investigation_notes?: string | null;
          final_decision_notes?: string | null;
          action_taken?: 'none' | 'warning_issued' | 'job_suspended' | 'employer_suspended' | 'agency_authorization_revoked' | 'banned';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      risk_signals: {
        Row: {
          id: string;
          entity_type: 'job' | 'company' | 'agency';
          entity_id: string;
          signal_code: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          signal_details: Json;
          is_resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: 'job' | 'company' | 'agency';
          entity_id: string;
          signal_code: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          signal_details?: Json;
          is_resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          entity_type?: 'job' | 'company' | 'agency';
          entity_id?: string;
          signal_code?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          signal_details?: Json;
          is_resolved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      discovery_sources: {
        Row: {
          id: string;
          name: string;
          website_url: string;
          category: 'career_page' | 'job_board' | 'agency_page' | 'industrial_announcement' | 'employer_feed' | 'partner_feed' | 'manual_submission';
          source_owner: string | null;
          access_method: 'http_get' | 'rss_feed' | 'json_api' | 'manual_url';
          permission_status: 'not_reviewed' | 'review_required' | 'approved' | 'restricted' | 'rejected';
          crawl_frequency_minutes: number;
          last_successful_crawl: string | null;
          last_attempted_crawl: string | null;
          reliability_score: number;
          is_enabled: boolean;
          rate_limit_per_minute: number;
          error_history: Json;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          website_url: string;
          category: 'career_page' | 'job_board' | 'agency_page' | 'industrial_announcement' | 'employer_feed' | 'partner_feed' | 'manual_submission';
          source_owner?: string | null;
          access_method?: 'http_get' | 'rss_feed' | 'json_api' | 'manual_url';
          permission_status?: 'not_reviewed' | 'review_required' | 'approved' | 'restricted' | 'rejected';
          crawl_frequency_minutes?: number;
          last_successful_crawl?: string | null;
          last_attempted_crawl?: string | null;
          reliability_score?: number;
          is_enabled?: boolean;
          rate_limit_per_minute?: number;
          error_history?: Json;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          website_url?: string;
          category?: 'career_page' | 'job_board' | 'agency_page' | 'industrial_announcement' | 'employer_feed' | 'partner_feed' | 'manual_submission';
          source_owner?: string | null;
          access_method?: 'http_get' | 'rss_feed' | 'json_api' | 'manual_url';
          permission_status?: 'not_reviewed' | 'review_required' | 'approved' | 'restricted' | 'rejected';
          crawl_frequency_minutes?: number;
          last_successful_crawl?: string | null;
          last_attempted_crawl?: string | null;
          reliability_score?: number;
          is_enabled?: boolean;
          rate_limit_per_minute?: number;
          error_history?: Json;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      discovery_runs: {
        Row: {
          id: string;
          source_id: string;
          status: 'running' | 'completed' | 'failed' | 'partial';
          vacancies_discovered: number;
          vacancies_ingested: number;
          duplicates_detected: number;
          error_log: Json;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          source_id: string;
          status: 'running' | 'completed' | 'failed' | 'partial';
          vacancies_discovered?: number;
          vacancies_ingested?: number;
          duplicates_detected?: number;
          error_log?: Json;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          source_id?: string;
          status?: 'running' | 'completed' | 'failed' | 'partial';
          vacancies_discovered?: number;
          vacancies_ingested?: number;
          duplicates_detected?: number;
          error_log?: Json;
          started_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "discovery_runs_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "discovery_sources";
            referencedColumns: ["id"];
          }
        ];
      };
      whatsapp_consent_records: {
        Row: {
          id: string;
          phone_number: string;
          user_id: string | null;
          consent_status: 'opted_in' | 'opted_out' | 'pending';
          consent_source: string;
          categories_accepted: string[];
          opted_in_at: string;
          opted_out_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          user_id?: string | null;
          consent_status?: 'opted_in' | 'opted_out' | 'pending';
          consent_source?: string;
          categories_accepted?: string[];
          opted_in_at?: string;
          opted_out_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          user_id?: string | null;
          consent_status?: 'opted_in' | 'opted_out' | 'pending';
          consent_source?: string;
          categories_accepted?: string[];
          opted_in_at?: string;
          opted_out_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      whatsapp_message_logs: {
        Row: {
          id: string;
          recipient_phone: string;
          template_name: string;
          language_code: string;
          idempotency_key: string;
          message_payload: Json;
          status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
          whatsapp_message_id: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipient_phone: string;
          template_name: string;
          language_code?: string;
          idempotency_key: string;
          message_payload?: Json;
          status?: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
          whatsapp_message_id?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recipient_phone?: string;
          template_name?: string;
          language_code?: string;
          idempotency_key?: string;
          message_payload?: Json;
          status?: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
          whatsapp_message_id?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_alert_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferred_trades: string[];
          preferred_clusters: string[];
          min_salary: number;
          shift_preference: string;
          alert_frequency: 'immediate' | 'daily_digest' | 'weekly_digest' | 'disabled';
          notification_channels: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferred_trades?: string[];
          preferred_clusters?: string[];
          min_salary?: number;
          shift_preference?: string;
          alert_frequency?: 'immediate' | 'daily_digest' | 'weekly_digest' | 'disabled';
          notification_channels?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferred_trades?: string[];
          preferred_clusters?: string[];
          min_salary?: number;
          shift_preference?: string;
          alert_frequency?: 'immediate' | 'daily_digest' | 'weekly_digest' | 'disabled';
          notification_channels?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          feature_name: string;
          model_name: string;
          prompt_tokens: number;
          completion_tokens: number;
          estimated_cost_usd: number;
          status: 'success' | 'fallback_rule_based' | 'failed';
          user_id: string | null;
          error_details: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          feature_name: string;
          model_name: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          estimated_cost_usd?: number;
          status?: 'success' | 'fallback_rule_based' | 'failed';
          user_id?: string | null;
          error_details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          feature_name?: string;
          model_name?: string;
          prompt_tokens?: number;
          completion_tokens?: number;
          estimated_cost_usd?: number;
          status?: 'success' | 'fallback_rule_based' | 'failed';
          user_id?: string | null;
          error_details?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ai_feature_settings: {
        Row: {
          id: string;
          feature_key: string;
          is_enabled: boolean;
          model_provider: string;
          model_name: string;
          monthly_token_budget: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          feature_key: string;
          is_enabled?: boolean;
          model_provider?: string;
          model_name?: string;
          monthly_token_budget?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          feature_key?: string;
          is_enabled?: boolean;
          model_provider?: string;
          model_name?: string;
          monthly_token_budget?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      employer_prospects: {
        Row: {
          id: string;
          company_name: string;
          industry: string;
          industrial_location: string;
          official_website: string | null;
          public_business_contact: string | null;
          contact_person: string | null;
          contact_source: string | null;
          outreach_date: string | null;
          outreach_method: 'email' | 'phone' | 'linkedin' | 'in_person' | 'referral' | 'other' | null;
          response_status: 'no_response' | 'responsive' | 'interested' | 'not_interested' | 'follow_up_needed';
          meeting_status: 'none' | 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          verification_status: 'unverified' | 'in_progress' | 'verified' | 'rejected';
          vacancy_availability: 'immediate' | 'upcoming' | 'none' | 'unknown';
          next_followup_date: string | null;
          pipeline_stage:
            | 'prospect_identified'
            | 'research_completed'
            | 'contacted'
            | 'interested'
            | 'meeting_scheduled'
            | 'verification_started'
            | 'employer_verified'
            | 'first_vacancy_submitted'
            | 'first_vacancy_published'
            | 'active_employer'
            | 'inactive_employer';
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          industry: string;
          industrial_location: string;
          official_website?: string | null;
          public_business_contact?: string | null;
          contact_person?: string | null;
          contact_source?: string | null;
          outreach_date?: string | null;
          outreach_method?: 'email' | 'phone' | 'linkedin' | 'in_person' | 'referral' | 'other' | null;
          response_status?: 'no_response' | 'responsive' | 'interested' | 'not_interested' | 'follow_up_needed';
          meeting_status?: 'none' | 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          verification_status?: 'unverified' | 'in_progress' | 'verified' | 'rejected';
          vacancy_availability?: 'immediate' | 'upcoming' | 'none' | 'unknown';
          next_followup_date?: string | null;
          pipeline_stage?:
            | 'prospect_identified'
            | 'research_completed'
            | 'contacted'
            | 'interested'
            | 'meeting_scheduled'
            | 'verification_started'
            | 'employer_verified'
            | 'first_vacancy_submitted'
            | 'first_vacancy_published'
            | 'active_employer'
            | 'inactive_employer';
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          industry?: string;
          industrial_location?: string;
          official_website?: string | null;
          public_business_contact?: string | null;
          contact_person?: string | null;
          contact_source?: string | null;
          outreach_date?: string | null;
          outreach_method?: 'email' | 'phone' | 'linkedin' | 'in_person' | 'referral' | 'other' | null;
          response_status?: 'no_response' | 'responsive' | 'interested' | 'not_interested' | 'follow_up_needed';
          meeting_status?: 'none' | 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
          verification_status?: 'unverified' | 'in_progress' | 'verified' | 'rejected';
          vacancy_availability?: 'immediate' | 'upcoming' | 'none' | 'unknown';
          next_followup_date?: string | null;
          pipeline_stage?:
            | 'prospect_identified'
            | 'research_completed'
            | 'contacted'
            | 'interested'
            | 'meeting_scheduled'
            | 'verification_started'
            | 'employer_verified'
            | 'first_vacancy_submitted'
            | 'first_vacancy_published'
            | 'active_employer'
            | 'inactive_employer';
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      industrial_pilot_locations: {
        Row: {
          id: string;
          name: string;
          marathi_name: string;
          pincode: string;
          zone: string;
          key_industries: string[];
          landmark: string;
          transit_access: string;
          active_companies_count: number;
          open_jobs_count: number;
          description: string;
          pilot_priority: 'high' | 'medium' | 'expansion';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          marathi_name: string;
          pincode: string;
          zone: string;
          key_industries?: string[];
          landmark: string;
          transit_access: string;
          active_companies_count?: number;
          open_jobs_count?: number;
          description: string;
          pilot_priority?: 'high' | 'medium' | 'expansion';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          marathi_name?: string;
          pincode?: string;
          zone?: string;
          key_industries?: string[];
          landmark?: string;
          transit_access?: string;
          active_companies_count?: number;
          open_jobs_count?: number;
          description?: string;
          pilot_priority?: 'high' | 'medium' | 'expansion';
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agency_authorizations: {
        Row: {
          id: string;
          agency_id: string;
          client_company_name: string;
          client_contact_person: string | null;
          authorization_scope: string;
          contract_labor_license_no: string | null;
          mandate_valid_until: string;
          is_direct_employer_representation_barred: boolean;
          status: 'active' | 'expired' | 'revoked' | 'pending_audit';
          internal_audit_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          client_company_name: string;
          client_contact_person?: string | null;
          authorization_scope: string;
          contract_labor_license_no?: string | null;
          mandate_valid_until: string;
          is_direct_employer_representation_barred?: boolean;
          status?: 'active' | 'expired' | 'revoked' | 'pending_audit';
          internal_audit_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          client_company_name?: string;
          client_contact_person?: string | null;
          authorization_scope?: string;
          contract_labor_license_no?: string | null;
          mandate_valid_until?: string;
          is_direct_employer_representation_barred?: boolean;
          status?: 'active' | 'expired' | 'revoked' | 'pending_audit';
          internal_audit_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      placement_records: {
        Row: {
          id: string;
          application_id: string | null;
          candidate_id: string | null;
          company_id: string;
          job_id: string | null;
          offered_salary_monthly: number;
          joining_date: string;
          candidate_confirmation_status: 'pending' | 'confirmed' | 'declined' | 'disputed';
          employer_confirmation_status: 'pending' | 'confirmed' | 'no_show' | 'disputed';
          placement_status: 'offered' | 'accepted' | 'joined' | 'disputed' | 'cancelled';
          dispute_reason: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id?: string | null;
          candidate_id?: string | null;
          company_id: string;
          job_id?: string | null;
          offered_salary_monthly: number;
          joining_date: string;
          candidate_confirmation_status?: 'pending' | 'confirmed' | 'declined' | 'disputed';
          employer_confirmation_status?: 'pending' | 'confirmed' | 'no_show' | 'disputed';
          placement_status?: 'offered' | 'accepted' | 'joined' | 'disputed' | 'cancelled';
          dispute_reason?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string | null;
          candidate_id?: string | null;
          company_id?: string;
          job_id?: string | null;
          offered_salary_monthly?: number;
          joining_date?: string;
          candidate_confirmation_status?: 'pending' | 'confirmed' | 'declined' | 'disputed';
          employer_confirmation_status?: 'pending' | 'confirmed' | 'no_show' | 'disputed';
          placement_status?: 'offered' | 'accepted' | 'joined' | 'disputed' | 'cancelled';
          dispute_reason?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_has_role: {
        Args: { check_role: string };
        Returns: boolean;
      };
      is_platform_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_member_of_company: {
        Args: { comp_id: string };
        Returns: boolean;
      };
      get_candidate_id_for_user: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
  };
}
