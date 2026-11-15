import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  JobVacancy,
  Company,
  WalkInEvent,
  CandidateProfile,
  JobApplication,
  EmployerVerificationRequest,
  ModerationReport,
  SAMPLE_JOBS,
  SAMPLE_COMPANIES,
  SAMPLE_WALKINS,
  SAMPLE_CANDIDATE,
  INITIAL_APPLICATIONS,
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS,
} from '../data/demo-data';
import { isSupabaseConfigured } from '../lib/supabase/client';
import { jobsService } from '../services/jobsService';
import { candidateService } from '../services/candidateService';
import { employerService } from '../services/employerService';
import { adminService } from '../services/adminService';

export type UserRole = 'public' | 'candidate' | 'employer' | 'agency' | 'admin';
export type Locale = 'en' | 'mr' | 'hi';

interface AppContextType {
  // Locale
  locale: Locale;
  setLocale: (loc: Locale) => void;

  // Active Role / Impersonation for test-driving Phase 1 & 2
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Supabase Connection Status
  isSupabaseConnected: boolean;

  // Data Collections
  jobs: JobVacancy[];
  companies: Company[];
  walkIns: WalkInEvent[];
  applications: JobApplication[];
  verifications: EmployerVerificationRequest[];
  reports: ModerationReport[];
  candidateProfile: CandidateProfile;
  savedJobIds: string[];

  // Interactive Actions
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  submitApplication: (jobId: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  updateApplicationStatus: (appId: string, newStatus: JobApplication['currentStatus'], notes?: string) => Promise<void>;
  updateCandidateProfile: (updates: Partial<CandidateProfile>) => Promise<void>;
  addNewJob: (jobData: Omit<JobVacancy, 'id' | 'postedDaysAgo' | 'lastConfirmedDate' | 'status'>) => Promise<JobVacancy>;
  updateJobStatus: (jobId: string, status: JobVacancy['status']) => Promise<void>;
  updateVerificationStatus: (verificationId: string, status: 'verified' | 'rejected', reason?: string) => Promise<void>;
  resolveReport: (reportId: string, status: 'resolved' | 'dismissed') => Promise<void>;
  resetDemoData: () => void;

  // Application Modal state
  applyingJob: JobVacancy | null;
  openApplyModal: (job: JobVacancy) => void;
  closeApplyModal: () => void;
}

const STORAGE_KEY = 'udyogsetu_demo_platform_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const isSupabaseConnected = isSupabaseConfigured();

  const [jobs, setJobs] = useState<JobVacancy[]>(SAMPLE_JOBS);
  const [companies, setCompanies] = useState<Company[]>(SAMPLE_COMPANIES);
  const [walkIns, setWalkIns] = useState<WalkInEvent[]>(SAMPLE_WALKINS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [verifications, setVerifications] = useState<EmployerVerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_REPORTS);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(SAMPLE_CANDIDATE);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-101', 'job-104']);

  const [applyingJob, setApplyingJob] = useState<JobVacancy | null>(null);

  // Safe client-side hydration from localStorage or live Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.jobs) setJobs(parsed.jobs);
        if (parsed.companies) setCompanies(parsed.companies);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.verifications) setVerifications(parsed.verifications);
        if (parsed.reports) setReports(parsed.reports);
        if (parsed.candidateProfile) setCandidateProfile(parsed.candidateProfile);
        if (parsed.savedJobIds) setSavedJobIds(parsed.savedJobIds);
        if (parsed.locale) setLocale(parsed.locale);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
      }
    } catch (e) {
      console.warn('Could not hydrate demo state from localStorage:', e);
    }

    // If Supabase is connected, fetch live jobs
    if (isSupabaseConnected) {
      jobsService.getJobs().then(({ jobs: dbJobs, error }) => {
        if (!error && dbJobs && dbJobs.length > 0) {
          setJobs(dbJobs);
        }
      });
      adminService.getPendingVerifications().then(({ verifications: dbVerifs, error }) => {
        if (!error && dbVerifs) {
          setVerifications(dbVerifs);
        }
      });
      adminService.getModerationReports().then(({ reports: dbReports, error }) => {
        if (!error && dbReports) {
          setReports(dbReports);
        }
      });
    }
  }, [isSupabaseConnected]);

  // Sync to localStorage
  const persistState = (newSlice: Record<string, unknown>) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, ...newSlice }));
    } catch (e) {
      console.warn('Could not persist demo state:', e);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      persistState({ savedJobIds: updated });
      return updated;
    });

    if (isSupabaseConnected && candidateProfile.id) {
      candidateService.toggleSaveJob(candidateProfile.id, jobId, savedJobIds.includes(jobId));
    }
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const submitApplication = async (jobId: string, notes?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found' };

    const alreadyApplied = applications.some((a) => a.jobId === jobId);
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this vacancy.' };
    }

    const newApp: JobApplication = {
      id: `app-${Date.now().toString().slice(-4)}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      clusterName: job.clusterName,
      appliedDate: 'Just now',
      currentStatus: 'Applied',
      candidateNotes: notes,
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    persistState({ applications: updated });

    if (isSupabaseConnected && candidateProfile.id) {
      await candidateService.submitApplication(jobId, candidateProfile.id, notes);
    }

    return { success: true, message: `Application submitted successfully to ${job.companyName}!` };
  };

  const updateApplicationStatus = async (
    appId: string,
    newStatus: JobApplication['currentStatus'],
    notes?: string
  ) => {
    const updated = applications.map((app) =>
      app.id === appId
        ? {
            ...app,
            currentStatus: newStatus,
            interviewerNotes: notes || app.interviewerNotes,
            interviewScheduledDate:
              newStatus === 'Interview Scheduled' ? '20-Nov-2026, 11:00 AM' : app.interviewScheduledDate,
          }
        : app
    );
    setApplications(updated);
    persistState({ applications: updated });

    if (isSupabaseConnected) {
      await employerService.updateApplicationStatus(appId, newStatus, notes);
    }
  };

  const updateCandidateProfile = async (updates: Partial<CandidateProfile>) => {
    setCandidateProfile((prev) => {
      const updated = { ...prev, ...updates };
      persistState({ candidateProfile: updated });
      return updated;
    });

    if (isSupabaseConnected && candidateProfile.id) {
      await candidateService.updateCandidateProfile(candidateProfile.id, updates);
    }
  };

  const addNewJob = async (
    jobData: Omit<JobVacancy, 'id' | 'postedDaysAgo' | 'lastConfirmedDate' | 'status'>
  ): Promise<JobVacancy> => {
    const newJob: JobVacancy = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      postedDaysAgo: 0,
      lastConfirmedDate: 'Today (Verified Post)',
      status: 'active',
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    persistState({ jobs: updated });

    if (isSupabaseConnected) {
      await jobsService.createJob(jobData, '00000000-0000-0000-0000-000000000001');
    }

    return newJob;
  };

  const updateJobStatus = async (jobId: string, status: JobVacancy['status']) => {
    const updated = jobs.map((j) => (j.id === jobId ? { ...j, status } : j));
    setJobs(updated);
    persistState({ jobs: updated });

    if (isSupabaseConnected) {
      await jobsService.updateJobStatus(jobId, status);
    }
  };

  const updateVerificationStatus = async (
    verificationId: string,
    status: 'verified' | 'rejected',
    reason?: string
  ) => {
    const verif = verifications.find((v) => v.id === verificationId);
    const updatedVerifs = verifications.map((v) =>
      v.id === verificationId ? { ...v, status, rejectionReason: reason } : v
    );
    setVerifications(updatedVerifs);

    if (verif) {
      const updatedCompanies = companies.map((c) =>
        c.id === verif.companyId ? { ...c, verificationStatus: status } : c
      );
      setCompanies(updatedCompanies);
      persistState({ verifications: updatedVerifs, companies: updatedCompanies });

      if (isSupabaseConnected) {
        await adminService.reviewVerification(verificationId, verif.companyId, status, reason);
      }
    } else {
      persistState({ verifications: updatedVerifs });
    }
  };

  const resolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status } : r));
    setReports(updated);
    persistState({ reports: updated });

    if (isSupabaseConnected) {
      await adminService.resolveReport(reportId, status);
    }
  };

  const resetDemoData = () => {
    setJobs(SAMPLE_JOBS);
    setCompanies(SAMPLE_COMPANIES);
    setWalkIns(SAMPLE_WALKINS);
    setApplications(INITIAL_APPLICATIONS);
    setVerifications(INITIAL_VERIFICATIONS);
    setReports(INITIAL_REPORTS);
    setCandidateProfile(SAMPLE_CANDIDATE);
    setSavedJobIds(['job-101', 'job-104']);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const openApplyModal = (job: JobVacancy) => setApplyingJob(job);
  const closeApplyModal = () => setApplyingJob(null);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    persistState({ locale: newLocale });
  };

  const handleSetActiveRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    persistState({ activeRole: newRole });
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        activeRole,
        setActiveRole: handleSetActiveRole,
        isSupabaseConnected,
        jobs,
        companies,
        walkIns,
        applications,
        verifications,
        reports,
        candidateProfile,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        submitApplication,
        updateApplicationStatus,
        updateCandidateProfile,
        addNewJob,
        updateJobStatus,
        updateVerificationStatus,
        resolveReport,
        resetDemoData,
        applyingJob,
        openApplyModal,
        closeApplyModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
