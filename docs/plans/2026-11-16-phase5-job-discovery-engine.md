# Phase 5: Job Aggregation & Automated Vacancy Discovery Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular, ethical, and intelligent job aggregation and vacancy discovery engine for manufacturing hubs across Chakan MIDC (Phases 1–4), Khed City, Kuruli, and the Pune belt that normalizes industrial trades, enforces legal crawling rules, detects duplicates, and bridges directly into the Phase 3 trust & moderation engine.

**Architecture:** A pluggable connector pipeline (`BaseConnector`, `CareerPageConnector`, `StructuredFeedConnector`, `ManualSubmissionConnector`) governed by a database-backed `discovery_sources` registry. Ingested vacancies are normalized for shopfloor trades and Marathi/Hindi variations, geocoded to Chakan industrial clusters, and piped directly into `trustService.evaluateJobRisk()` with `moderation_status: 'pending_review'` and `is_external_aggregation: true`.

**Tech Stack:** Next.js (TypeScript), Supabase PostgreSQL (RLS, Migrations), Cheerio / Schema.org parser, Custom Vernacular Tokenizer, Node.js fetch with Robots.txt validator.

**Spec:** [USER_REQUEST] Phase 5 — Job Aggregation & Automated Vacancy Discovery Engine.

---

## Global Constraints

- Never scrape behind authentication, CAPTCHA, paywalls, or circumvent anti-bot mechanisms.
- Always respect `robots.txt` and identify with User-Agent `UdyogSetuBot/1.0 (+https://udyogsetu.gov.in/bot)`.
- Enforce per-source rate limiting (minimum 2.0s delay between requests).
- Every aggregated vacancy must carry explicit attribution (`original_source_url`) and link candidates to the verified employer.
- Every aggregated listing must be held in `moderation_status = 'pending_review'` until verified by platform administration.
- No trust decision (such as verified badges) may ever be automated.

---

## Review Focus

1. **Robots.txt Disallowance:** A source whose `robots.txt` blocks `/careers` must be flagged `restricted` and abort collection without error or retry loops.
2. **Scam/Fee Ingestion Guard:** An aggregated listing that mentions "registration charges" or "training deposit" must immediately be marked `suspended` with critical risk score.
3. **Duplicate Collision Handling:** Multiple sources announcing the same CNC Operator role at Bajaj Auto Chakan Plant must be deduplicated into a single group under `duplicate_group_id`.
4. **Vernacular Translation Accuracy:** Marathi title "एमआयजी वेल्डर (ऑटोमोटिव्ह)" must cleanly resolve to trade `MIG Welder` and cluster `Chakan MIDC Phase 2`.
5. **Rate-Limit Backpressure:** Parallel connector runs must throttle requests to prevent HTTP 429 or server burden on employer career pages.

---

## Tasks

### Task 1: Database Migration for Discovery Engine (`07_job_discovery_engine.sql`)

**Files:**
- Create: `supabase/migrations/07_job_discovery_engine.sql`
- Modify: `src/types/database.types.ts`
- Test: `tests/discovery/discovery-schema.test.mjs`

- [ ] **Step 1.1:** Write the failing schema test verifying `discovery_sources` and `discovery_runs` table definitions and RLS policies.
- [ ] **Step 1.2:** Create migration `07_job_discovery_engine.sql` containing:
  - Table `discovery_sources` (source name, URL, category, access method, permission status, crawl frequency, reliability score, rate limit, admin notes).
  - Table `discovery_runs` (source_id, status, vacancies_discovered, vacancies_ingested, duplicates_detected, error_log).
  - Seed 5 initial verified Pune/Chakan industrial sources (Mahindra Chakan, Bajaj Auto, Tata Motors, Bharat Forge, Chakan MIDC Association).
  - RLS policies ensuring only `admin` role can manage sources and view crawler execution audits.
- [ ] **Step 1.3:** Update `src/types/database.types.ts` with new table types.
- [ ] **Step 1.4:** Run test to verify schema migration validity.
- [ ] **Step 1.5:** Commit changes (`feat(db): Add discovery_sources and discovery_runs schema`).

---

### Task 2: Core Discovery Engine & Ethical Pluggable Connectors

**Files:**
- Create: `src/services/discovery/types.ts`
- Create: `src/services/discovery/BaseConnector.ts`
- Create: `src/services/discovery/CareerPageConnector.ts`
- Create: `src/services/discovery/StructuredFeedConnector.ts`
- Create: `src/services/discovery/ManualSubmissionConnector.ts`
- Test: `tests/discovery/connectors.test.mjs`

- [ ] **Step 2.1:** Write unit tests for `BaseConnector` validating robots.txt parsing, rate limiting, and User-Agent headers.
- [ ] **Step 2.2:** Implement `src/services/discovery/types.ts` declaring `RawDiscoveredJob`, `NormalizedDiscoveredJob`, `ConnectorResult`, and `SourceConfig`.
- [ ] **Step 2.3:** Implement `BaseConnector.ts` with rate-limiting queue, `robots.txt` verification, timeout safety, and standard error telemetry.
- [ ] **Step 2.4:** Implement `CareerPageConnector.ts` extracting Schema.org `JobPosting` JSON-LD and semantic HTML headings.
- [ ] **Step 2.5:** Implement `StructuredFeedConnector.ts` parsing RSS, Atom, and JSON feeds.
- [ ] **Step 2.6:** Implement `ManualSubmissionConnector.ts` parsing individual employer-submitted URLs.
- [ ] **Step 2.7:** Run connector test suite to verify extraction and ethical rate limiting.
- [ ] **Step 2.8:** Commit changes (`feat(discovery): Implement pluggable ethical job connectors`).

---

### Task 3: Industrial Job Trade, Geography & Vernacular Normalizer

**Files:**
- Create: `src/services/discovery/normalizer.ts`
- Test: `tests/discovery/normalizer.test.mjs`

- [ ] **Step 3.1:** Write unit test testing trade matching (English/Marathi/Hindi), cluster geocoding (Chakan Phases 1-4, Khed City, Kuruli), salary parser, and facility detector.
- [ ] **Step 3.2:** Implement dictionary & regex parser in `normalizer.ts` for:
  - 25+ shopfloor trades (CNC, VMC, Lathe, Welder, Electrician, Fitter, Quality, Assembly, Trainee).
  - Vernacular Marathi/Hindi aliases (वेल्डर, ऑपरेटर, फिटर, इलेक्ट्रीशियन).
  - Hyperlocal industrial clusters (Chakan MIDC Phase 1–4, Kuruli, Mahalunge, Khed City, Talegaon, Bhosari).
  - Shift patterns & perks (Rotational, 8h/12h, Bus Route, Canteen).
  - Clean monthly in-hand salary extraction.
- [ ] **Step 3.3:** Run tests to confirm 100% accuracy on sample industrial listings.
- [ ] **Step 3.4:** Commit changes (`feat(discovery): Add industrial trade and geography normalizer`).

---

### Task 4: Ingestion Pipeline & Phase 3 Trust Integration

**Files:**
- Create: `src/services/discovery/ingestionPipeline.ts`
- Modify: `src/services/jobsService.ts`
- Test: `tests/discovery/ingestion.test.mjs`

- [ ] **Step 4.1:** Write integration test verifying duplicate prevention, pre-moderation risk scoring, and storage in Supabase.
- [ ] **Step 4.2:** Implement `ingestionPipeline.ts` that:
  - Receives normalized jobs from connectors.
  - Queries active vacancies for duplicate detection (exact title + company + cluster, and token similarity).
  - Invokes `trustService.evaluateJobRisk()` on candidate vacancies.
  - Sets `source_type = 'aggregated'`, `is_external_aggregation = true`, `moderation_status = 'pending_review'`.
  - Persists clean records to `jobs` table and logs metrics to `discovery_runs`.
- [ ] **Step 4.3:** Run integration test and verify no duplicate or scam job bypasses `pending_review`.
- [ ] **Step 4.4:** Commit changes (`feat(discovery): Wire discovery ingestion into Phase 3 trust engine`).

---

### Task 5: Admin Source Governance & Discovery API Endpoints

**Files:**
- Create: `src/pages/api/admin/discovery/run.ts`
- Create: `src/pages/api/admin/discovery/sources.ts`
- Create: `src/pages/api/discovery/submit-url.ts`
- Create: `src/pages/admin/sources.tsx`
- Modify: `src/components/layout/AdminLayout.tsx`
- Test: `tests/discovery/admin-discovery-api.test.mjs`

- [ ] **Step 5.1:** Write API test validating admin authorization on `/api/admin/discovery/run` and URL submission on `/api/discovery/submit-url`.
- [ ] **Step 5.2:** Implement `/api/admin/discovery/run.ts` to trigger scheduled or on-demand connector crawls.
- [ ] **Step 5.3:** Implement `/api/admin/discovery/sources.ts` for CRUD management of registered sources.
- [ ] **Step 5.4:** Implement `/api/discovery/submit-url.ts` for single vacancy manual submission.
- [ ] **Step 5.5:** Create Admin UI page `src/pages/admin/sources.tsx` featuring:
  - Source Registry table with permission statuses (`Approved`, `Review Required`, `Restricted`).
  - "Run Discovery" action button.
  - Crawl history & error inspection modal.
  - "Submit Single URL" quick intake form.
- [ ] **Step 5.6:** Add "Job Sources & Discovery" link to `AdminLayout.tsx` navigation sidebar.
- [ ] **Step 5.7:** Run test suite and build verification.
- [ ] **Step 5.8:** Commit changes (`feat(ui): Add admin discovery dashboard and management APIs`).

---

### Task 6: End-to-End Verification, Scheduled Cron & Documentation

**Files:**
- Create: `tests/discovery/discovery-engine.test.mjs`
- Modify: `vercel.json`
- Modify: `README.md`
- Create: `C:/Users/KhaN/.gemini/antigravity/brain/4f1acc10-d507-4f7e-a207-7c19639e1dd5/phase5_job_discovery_report.md`

- [ ] **Step 6.1:** Run comprehensive discovery test suite covering connectors, normalizers, duplicate detection, and trust integration.
- [ ] **Step 6.2:** Update `vercel.json` to include the automated discovery crawl cron job.
- [ ] **Step 6.3:** Run production build `npm run build` to ensure all 60+ routes pass with 0 errors.
- [ ] **Step 6.4:** Compile comprehensive Phase 5 architectural delivery report.
- [ ] **Step 6.5:** Commit and push changes to GitHub.
