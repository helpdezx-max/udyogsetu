const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'types', 'database.types.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update companies Row, Insert, Update
const compFieldsRow = `          contact_phone: string;
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
          next_review_date: string | null;`;

content = content.replace('contact_phone: string;\r\n          logo_url: string | null;', compFieldsRow);
content = content.replace('contact_phone: string;\n          logo_url: string | null;', compFieldsRow);

const compFieldsInsert = `contact_phone: string;
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
          next_review_date?: string | null;`;

content = content.replace('contact_phone: string;\r\n          logo_url?: string | null;', compFieldsInsert);
content = content.replace('contact_phone: string;\n          logo_url?: string | null;', compFieldsInsert);

const compFieldsUpdate = `contact_phone?: string;
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
          next_review_date?: string | null;`;

content = content.replace('contact_phone?: string;\r\n          logo_url?: string | null;', compFieldsUpdate);
content = content.replace('contact_phone?: string;\n          logo_url?: string | null;', compFieldsUpdate);

// 2. Update jobs Row, Insert, Update
const jobFieldsRow = `deadline_date: string | null;
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
          risk_flags: string[];`;

content = content.replace('deadline_date: string | null;\r\n          created_at: string;', jobFieldsRow + '\r\n          created_at: string;');
content = content.replace('deadline_date: string | null;\n          created_at: string;', jobFieldsRow + '\n          created_at: string;');

const jobFieldsInsert = `deadline_date?: string | null;
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
          risk_flags?: string[];`;

content = content.replace('deadline_date?: string | null;\r\n          created_at?: string;', jobFieldsInsert + '\r\n          created_at?: string;');
content = content.replace('deadline_date?: string | null;\n          created_at?: string;', jobFieldsInsert + '\n          created_at?: string;');

const jobFieldsUpdate = `deadline_date?: string | null;
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
          risk_flags?: string[];`;

content = content.replace('deadline_date?: string | null;\r\n          created_at?: string;\r\n          updated_at?: string;\r\n        };\r\n        Relationships: [];\r\n      };\r\n      applications:', jobFieldsUpdate + '\r\n          created_at?: string;\r\n          updated_at?: string;\r\n        };\r\n        Relationships: [];\r\n      };\r\n      applications:');
content = content.replace('deadline_date?: string | null;\n          created_at?: string;\n          updated_at?: string;\n        };\n        Relationships: [];\n      };\n      applications:', jobFieldsUpdate + '\n          created_at?: string;\n          updated_at?: string;\n        };\n        Relationships: [];\n      };\n      applications:');

// 3. Add new tables before closing of Tables
const newTables = `      recruitment_agencies: {
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
`;

if (!content.includes('company_verification_audits:')) {
  if (content.includes('    };\r\n    Views: Record<string, never>;')) {
    content = content.replace('    };\r\n    Views: Record<string, never>;', newTables + '    };\r\n    Views: Record<string, never>;');
  } else {
    content = content.replace('    };\n    Views: Record<string, never>;', newTables + '    };\n    Views: Record<string, never>;');
  }
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated database.types.ts with all Phase 3 tables and columns.');
