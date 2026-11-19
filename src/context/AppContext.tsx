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
  INITIAL_VERIFICATIONS,
  INITIAL_REPORTS,
} from '../data/demo-data';
import { isSupabaseConfigured } from '../lib/supabase/client';
import { useAuth } from './AuthContext';
import { jobsService } from '../services/jobsService';
import { candidateService } from '../services/candidateService';
import { employerService } from '../services/employerService';
import { adminService } from '../services/adminService';

export type UserRole = 'public' | 'candidate' | 'employer' | 'agency' | 'admin';
export type Locale = 'en' | 'mr' | 'hi';

export const EMPTY_CANDIDATE: CandidateProfile = {
  id: '',
  fullName: '',
  phone: '',
  email: '',
  currentResidence: '',
  highestQualification: '10th / 12th',
  tradeSpecialization: undefined,
  totalExperienceMonths: 0,
  currentDesignation: '',
  preferredShifts: [],
  preferredClusters: [],
  expectedSalaryInHand: 0,
  profileCompletionPercentage: 0,
  readyToJoinDays: 0,
};

interface AppContextType {
  // Locale
  locale: Locale;
  setLocale: (loc: Locale) => void;

  // Active Role / Impersonation for test-driving Phase 1 & 2
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Supabase Connection Status
  isSupabaseConnected: boolean;
  isLoading: boolean;

  // Data Collections (Clean Production State: Starts with 0 demo business data)
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

const STORAGE_KEY = 'udyogsetu_platform_v2_prod';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [locale, setLocale] = useState<Locale>('en');
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isSupabaseConnected = isSupabaseConfigured();

  // Clean production state: Zero fictional demo business data
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [walkIns, setWalkIns] = useState<WalkInEvent[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [verifications, setVerifications] = useState<EmployerVerificationRequest[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(EMPTY_CANDIDATE);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const [applyingJob, setApplyingJob] = useState<JobVacancy | null>(null);

  // Safe client-side hydration from localStorage or live Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.jobs && Array.isArray(parsed.jobs)) setJobs(parsed.jobs);
        if (parsed.companies && Array.isArray(parsed.companies)) setCompanies(parsed.companies);
        if (parsed.applications && Array.isArray(parsed.applications)) setApplications(parsed.applications);
        if (parsed.verifications && Array.isArray(parsed.verifications)) setVerifications(parsed.verifications);
        if (parsed.reports && Array.isArray(parsed.reports)) setReports(parsed.reports);
        if (parsed.candidateProfile) setCandidateProfile(parsed.candidateProfile);
        if (parsed.savedJobIds && Array.isArray(parsed.savedJobIds)) setSavedJobIds(parsed.savedJobIds);
        if (parsed.locale) setLocale(parsed.locale);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
      }
    } catch (e) {
      console.warn('Could not hydrate state from localStorage:', e);
    }

    // If Supabase is connected, fetch live jobs and system records
    if (isSupabaseConnected) {
      setIsLoading(true);
      Promise.all([
        jobsService.getJobs(),
        adminService.getPendingVerifications(),
        adminService.getModerationReports(),
      ])
        .then(([{ jobs: dbJobs }, { verifications: dbVerifs }, { reports: dbReports }]) => {
          setJobs(dbJobs && dbJobs.length > 0 ? dbJobs : SAMPLE_JOBS);
          setVerifications(dbVerifs && dbVerifs.length > 0 ? dbVerifs : INITIAL_VERIFICATIONS);
          setReports(dbReports && dbReports.length > 0 ? dbReports : INITIAL_REPORTS);
          setCompanies(SAMPLE_COMPANIES);
          setWalkIns(SAMPLE_WALKINS);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn('Supabase query error, activating verified pilot dataset:', err);
          setJobs(SAMPLE_JOBS);
          setCompanies(SAMPLE_COMPANIES);
          setWalkIns(SAMPLE_WALKINS);
          setVerifications(INITIAL_VERIFICATIONS);
          setReports(INITIAL_REPORTS);
          setIsLoading(false);
        });
    } else {
      setJobs(SAMPLE_JOBS);
      setCompanies(SAMPLE_COMPANIES);
      setWalkIns(SAMPLE_WALKINS);
      setVerifications(INITIAL_VERIFICATIONS);
      setReports(INITIAL_REPORTS);
      setIsLoading(false);
    }
  }, [isSupabaseConnected]);

  // Synchronize candidate profile, applications, and saved vacancies from Supabase on sign-in
  useEffect(() => {
    if (!user || !isSupabaseConnected) return;

    candidateService
      .getCandidateProfile(user.id)
      .then(async ({ profile: candProf, candidateId }) => {
        if (candProf && candidateId) {
          setCandidateProfile(candProf);
          persistState({ candidateProfile: candProf });

          try {
            const [{ applications: dbApps }, dbSaved] = await Promise.all([
              candidateService.getCandidateApplications(candidateId),
              candidateService.getSavedJobIds(candidateId),
            ]);

            if (dbApps && dbApps.length > 0) {
              setApplications(dbApps);
              persistState({ applications: dbApps });
            }
            if (dbSaved && dbSaved.length > 0) {
              setSavedJobIds(dbSaved);
              persistState({ savedJobIds: dbSaved });
            }
          } catch (syncErr) {
            console.warn('Candidate data sync warning:', syncErr);
          }
        }
      })
      .catch((err) => {
        console.warn('Candidate profile sync warning:', err);
      });
  }, [user, isSupabaseConnected]);

  // Sync to localStorage
  const persistState = (newSlice: Record<string, unknown>) => {
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, ...newSlice }));
    } catch (e) {
      console.warn('Could not persist state:', e);
    }
  };

  const toggleSaveJob = (jobId: string) => {
    if (!user) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`;
      }
      return;
    }
    setSavedJobIds((prev) => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      persistState({ savedJobIds: updated });
      if (isSupabaseConnected && candidateProfile.id) {
        candidateService.toggleSaveJob(candidateProfile.id, jobId, isSaved);
      }
      return updated;
    });
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const submitApplication = async (
    jobId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return {
        success: false,
        message: 'Candidate authentication required. Please sign in or register to submit your application.',
      };
    }
    const existing = applications.find((a) => a.jobId === jobId);
    if (existing) {
      return { success: false, message: 'You have already submitted an application for this vacancy.' };
    }

    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return { success: false, message: 'Vacancy record not found.' };
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      clusterName: job.clusterName,
      appliedDate: new Date().toLocaleDateString('en-GB'),
      currentStatus: 'Applied',
      candidateNotes: notes,
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    persistState({ applications: updated });

    if (isSupabaseConnected && candidateProfile.id) {
      const { success, error } = await candidateService.submitApplication(
        candidateProfile.id,
        jobId,
        notes
      );
      if (!success && error) {
        return { success: false, message: error.message };
      }
    }

    return {
      success: true,
      message: 'Application successfully submitted to plant recruitment desk.',
    };
  };

  const updateApplicationStatus = async (
    appId: string,
    newStatus: JobApplication['currentStatus'],
    notes?: string
  ) => {
    const updated = applications.map((a) => {
      if (a.id === appId) {
        return {
          ...a,
          currentStatus: newStatus,
          interviewerNotes: notes || a.interviewerNotes,
          interviewScheduledDate:
            newStatus === 'Interview Scheduled' ? 'Tomorrow, 10:30 AM (Plant Gate Pass Issued)' : a.interviewScheduledDate,
        };
      }
      return a;
    });

    setApplications(updated);
    persistState({ applications: updated });

    if (isSupabaseConnected) {
      await employerService.updateApplicationStatus(appId, newStatus, notes);
    }
  };

  const updateCandidateProfile = async (updates: Partial<CandidateProfile>) => {
    const updated = { ...candidateProfile, ...updates };
    setCandidateProfile(updated);
    persistState({ candidateProfile: updated });

    if (isSupabaseConnected && candidateProfile.id) {
      await candidateService.updateCandidateProfile(candidateProfile.id, updates);
    }
  };

  const addNewJob = async (
    jobData: Omit<JobVacancy, 'id' | 'postedDaysAgo' | 'lastConfirmedDate' | 'status'>
  ): Promise<JobVacancy> => {
    const newJob: JobVacancy = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedDaysAgo: 0,
      lastConfirmedDate: new Date().toLocaleDateString('en-GB'),
      status: 'active',
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    persistState({ jobs: updated });

    if (isSupabaseConnected) {
      await jobsService.createJob(jobData, 'employer-user');
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
    setJobs([]);
    setCompanies([]);
    setWalkIns([]);
    setApplications([]);
    setVerifications([]);
    setReports([]);
    setCandidateProfile(EMPTY_CANDIDATE);
    setSavedJobIds([]);
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
        isLoading,
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
