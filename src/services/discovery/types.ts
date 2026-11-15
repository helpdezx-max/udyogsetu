export type SourceCategory =
  | 'career_page'
  | 'job_board'
  | 'agency_page'
  | 'industrial_announcement'
  | 'employer_feed'
  | 'partner_feed'
  | 'manual_submission';

export type AccessMethod = 'http_get' | 'rss_feed' | 'json_api' | 'manual_url';

export type PermissionStatus =
  | 'not_reviewed'
  | 'review_required'
  | 'approved'
  | 'restricted'
  | 'rejected';

export interface DiscoverySource {
  id: string;
  name: string;
  website_url: string;
  category: SourceCategory;
  source_owner: string | null;
  access_method: AccessMethod;
  permission_status: PermissionStatus;
  crawl_frequency_minutes: number;
  last_successful_crawl: string | null;
  last_attempted_crawl: string | null;
  reliability_score: number;
  is_enabled: boolean;
  rate_limit_per_minute: number;
  error_history?: any[];
  admin_notes?: string | null;
}

export interface RawDiscoveredJob {
  sourceId: string;
  sourceName: string;
  externalId?: string;
  title: string;
  companyName: string;
  rawLocation?: string;
  rawSalary?: string;
  description: string;
  requirements?: string[];
  originalUrl: string;
  postedDate?: string;
  shiftDetails?: string;
  qualifications?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface NormalizedDiscoveredJob {
  sourceId: string;
  sourceName: string;
  title: string;
  standardTrade: string;
  companyName: string;
  industryCategory: string;
  cluster: string;
  city: string;
  state: string;
  monthlySalaryMin?: number;
  monthlySalaryMax?: number;
  inHandMonthlyEstimate?: number;
  shiftType: 'morning' | 'evening' | 'night' | 'rotational' | 'general';
  experienceYearsMin: number;
  educationMin: 'none' | '10th_pass' | '12th_pass' | 'iti' | 'diploma' | 'degree';
  facilities: {
    busProvided: boolean;
    canteenProvided: boolean;
    overtimeOffered: boolean;
    pfEsiIncluded: boolean;
  };
  openingsCount: number;
  originalSourceUrl: string;
  discoveredAt: string;
  description: string;
}

export interface ConnectorResult {
  success: boolean;
  sourceId: string;
  vacanciesFound: RawDiscoveredJob[];
  error?: string;
  rateLimitDelayMs: number;
  robotsCompliant: boolean;
}

export interface DiscoveryRunSummary {
  runId: string;
  sourceId: string;
  status: 'running' | 'completed' | 'failed' | 'partial';
  vacanciesDiscovered: number;
  vacanciesIngested: number;
  duplicatesDetected: number;
  errors: string[];
  startedAt: string;
  completedAt?: string;
}
