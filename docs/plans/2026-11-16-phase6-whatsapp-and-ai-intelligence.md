# Phase 6: WhatsApp Business, Notifications & AI Recruitment Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a consent-first WhatsApp Business notification system and a pluggable, explainable AI intelligence layer for UdyogSetu that accelerates manufacturing hiring across Chakan MIDC and the Pune belt while keeping humans fully responsible for all hiring and verification decisions.

**Architecture:** 
1. Meta WhatsApp Cloud API client with webhook verification (`hub.challenge`), delivery status callbacks, consent tracking (`whatsapp_consent_records`), and `STOP` command opt-out listener.
2. Multilingual message template catalog (English, Marathi `mr`, Hindi `hi`) for job alerts, application milestones, interview entry passes, and plant gate reminders.
3. Pluggable AI engine (`src/services/ai/`) featuring fallback rule-based generation when offline, AI JD drafting with anti-extortion guards, candidate-gated resume parsing, explainable 0–100% job matching, and candidate/employer chatbots.
4. Admin AI Control Center (`/admin/ai-control`) for provider/model toggles, token usage/cost logging, and risk queue oversight.

**Tech Stack:** Next.js (TypeScript), Supabase PostgreSQL (RLS, Migrations), Meta WhatsApp Cloud API v21.0, Pluggable AI Client (Gemini API / Rule-based Fallback), Node.js Crypto (Webhook signature verification).

**Spec:** [USER_REQUEST] Phase 6 — WhatsApp Business, Notifications & AI Recruitment Intelligence.

---

## Global Constraints

- **Core Rule:** AI assists recruitment. Humans remain 100% responsible for verification, shortlisting, selection, and hiring decisions.
- Never send WhatsApp messages without prior candidate consent.
- Honor `STOP` / `UNSUBSCRIBE` commands instantly and halt all non-essential outbound messaging.
- Keep all access tokens, app secrets, and AI keys server-side only. Never leak credentials to browser clients.
- If external WhatsApp or AI APIs fail or are unconfigured, core hiring workflows, in-app notifications, and job applications must continue to work without disruption.
- AI extracted resume fields must be gated by candidate review (`is_confirmed: false`) before saving to profiles.

---

## Review Focus

1. **Webhook Signature & Handshake Guard:** Webhook `GET /api/webhooks/whatsapp` must accurately verify `hub.mode` and `hub.verify_token`, and reject forged tokens.
2. **Opt-Out Compliance:** Inbound message containing "STOP" must immediately change consent status to `opted_out` and block future promotional/alert dispatches.
3. **Idempotent Dispatch:** Disagreeing network retries for the same notification event must not send duplicate WhatsApp alerts to candidates.
4. **Offline AI Reliability:** When no external AI key is configured, all AI assistants (JD generator, resume parser, matching) must gracefully execute deterministic rule-based fallbacks with HTTP 200.
5. **No Automated Hiring:** AI match scores must be clearly documented as advisory recommendations only, with no automated rejection or hiring triggers.

---

## Tasks

### Task 1: Database Migration for WhatsApp & AI Intelligence (`08_whatsapp_and_ai_intelligence.sql`)

**Files:**
- Create: `supabase/migrations/08_whatsapp_and_ai_intelligence.sql`
- Modify: `src/types/database.types.ts`
- Test: `tests/phase6/schema.test.ts`

- [ ] **Step 1.1:** Write failing schema test verifying table definitions for `whatsapp_consent_records`, `whatsapp_message_logs`, `job_alert_preferences`, `ai_usage_logs`, and `ai_feature_settings`.
- [ ] **Step 1.2:** Write migration `08_whatsapp_and_ai_intelligence.sql` creating:
  - Table `whatsapp_consent_records` (phone, user_id, consent_status, categories_accepted, opted_in_at, opted_out_at).
  - Table `whatsapp_message_logs` (recipient_phone, template_name, language_code, idempotency_key, status, error_message).
  - Table `job_alert_preferences` (candidate_id, preferred_trades, preferred_clusters, min_salary, alert_frequency, is_active).
  - Table `ai_usage_logs` (feature_name, model_name, prompt_tokens, completion_tokens, estimated_cost_usd, status).
  - Table `ai_feature_settings` (feature_key, is_enabled, model_provider, model_name, monthly_token_budget).
  - Seed initial AI settings & WhatsApp template definitions.
  - RLS policies enforcing tenant isolation and admin auditing.
- [ ] **Step 1.3:** Update `src/types/database.types.ts` with new table types.
- [ ] **Step 1.4:** Run schema test to verify definition completeness.
- [ ] **Step 1.5:** Commit changes (`feat(db): Add WhatsApp and AI intelligence schema`).

---

### Task 2: Meta WhatsApp Cloud API Service & Webhook Gateway

**Files:**
- Create: `src/services/whatsapp/types.ts`
- Create: `src/services/whatsapp/templates.ts`
- Create: `src/services/whatsapp/consentManager.ts`
- Create: `src/services/whatsapp/whatsappClient.ts`
- Create: `src/pages/api/webhooks/whatsapp.ts`
- Test: `tests/phase6/whatsapp.test.ts`

- [ ] **Step 2.1:** Write unit tests for WhatsApp client (idempotency, consent check, offline fallback queue, STOP opt-out handling).
- [ ] **Step 2.2:** Implement `src/services/whatsapp/types.ts` and `templates.ts` with English, Marathi, and Hindi message templates (job alerts, application status, interview gate pass).
- [ ] **Step 2.3:** Implement `consentManager.ts` managing opt-in timestamps, preferred categories, and opt-out processing.
- [ ] **Step 2.4:** Implement `whatsappClient.ts` handling Meta Cloud API requests, idempotency deduplication, and safe offline simulation logging.
- [ ] **Step 2.5:** Implement `/api/webhooks/whatsapp.ts` handling GET verification challenge and POST delivery/message status events.
- [ ] **Step 2.6:** Run WhatsApp unit test suite and verify all assertions pass.
- [ ] **Step 2.7:** Commit changes (`feat(whatsapp): Implement WhatsApp Cloud API client and webhook gateway`).

---

### Task 3: Job Alert Engine

**Files:**
- Create: `src/services/alerts/jobAlertEngine.ts`
- Test: `tests/phase6/alerts.test.ts`

- [ ] **Step 3.1:** Write unit test testing trade/cluster/salary matching, non-duplication check, and multi-channel dispatch.
- [ ] **Step 3.2:** Implement `jobAlertEngine.ts` matching active, verified manufacturing vacancies against candidate alert preferences.
- [ ] **Step 3.3:** Run alert engine tests to verify zero duplicate alerts and proper Marathi/Hindi notification routing.
- [ ] **Step 3.4:** Commit changes (`feat(alerts): Implement personalized job alert engine`).

---

### Task 4: Pluggable AI Client & Fallback Engine

**Files:**
- Create: `src/services/ai/types.ts`
- Create: `src/services/ai/aiClient.ts`
- Test: `tests/phase6/ai-client.test.ts`

- [ ] **Step 4.1:** Write unit test for AI client validating prompt token logging, failure handling, and deterministic rule-based fallback when keys are absent.
- [ ] **Step 4.2:** Implement `src/services/ai/types.ts` and `aiClient.ts` with telemetry tracking (`ai_usage_logs`) and fallback resilience.
- [ ] **Step 4.3:** Run AI client tests and verify clean execution.
- [ ] **Step 4.4:** Commit changes (`feat(ai): Implement pluggable AI client with offline fallback`).

---

### Task 5: AI Recruitment Feature Modules

**Files:**
- Create: `src/services/ai/jobDescriptionAssistant.ts`
- Create: `src/services/ai/resumeParser.ts`
- Create: `src/services/ai/jobMatcher.ts`
- Create: `src/services/ai/candidateAssistant.ts`
- Create: `src/services/ai/employerAssistant.ts`
- Test: `tests/phase6/ai-features.test.ts`

- [ ] **Step 5.1:** Write unit tests for JD generator (anti-extortion guard), resume parser (candidate review confirmation flag), and explainable matcher (0–100% breakdown).
- [ ] **Step 5.2:** Implement `jobDescriptionAssistant.ts` generating standardized manufacturing JDs with safety and shift details.
- [ ] **Step 5.3:** Implement `resumeParser.ts` extracting ITI trades, experience, and machine proficiencies, gated by `is_confirmed: false`.
- [ ] **Step 5.4:** Implement `jobMatcher.ts` computing explainable compatibility scores across trades, clusters, and perks.
- [ ] **Step 5.5:** Implement `candidateAssistant.ts` and `employerAssistant.ts` for vernacular interview prep, checklists, and evaluation sheets.
- [ ] **Step 5.6:** Run feature tests and confirm all pass.
- [ ] **Step 5.7:** Commit changes (`feat(ai): Implement AI JD, resume parser, and matching assistants`).

---

### Task 6: Admin AI Control Center & Candidate Assistant UI

**Files:**
- Create: `src/pages/admin/ai-control.tsx`
- Create: `src/pages/candidate/assistant.tsx`
- Create: `src/pages/api/ai/chat.ts`
- Create: `src/pages/api/ai/parse-resume.ts`
- Create: `src/pages/api/ai/generate-jd.ts`
- Modify: `src/components/layout/AdminLayout.tsx`
- Modify: `src/components/layout/CandidateLayout.tsx`

- [ ] **Step 6.1:** Implement API endpoints `/api/ai/chat.ts`, `/api/ai/parse-resume.ts`, and `/api/ai/generate-jd.ts`.
- [ ] **Step 6.2:** Create Admin AI Control Center `src/pages/admin/ai-control.tsx` with feature toggles, WhatsApp status, and token usage metrics.
- [ ] **Step 6.3:** Create Candidate AI Assistant page `src/pages/candidate/assistant.tsx` with vernacular chat interface and quick action prompts.
- [ ] **Step 6.4:** Add navigation links to `AdminLayout.tsx` and `CandidateLayout.tsx`.
- [ ] **Step 6.5:** Commit changes (`feat(ui): Add Admin AI Control Center and Candidate Assistant`).

---

### Task 7: End-to-End Verification & Documentation

**Files:**
- Modify: `package.json`
- Create: `C:/Users/KhaN/.gemini/antigravity/brain/4f1acc10-d507-4f7e-a207-7c19639e1dd5/phase6_ai_and_whatsapp_report.md`

- [ ] **Step 7.1:** Update `package.json` test script to run all 40+ tests across Phases 1–6.
- [ ] **Step 7.2:** Run full test suite (`npm run test`) and verify 100% green pass.
- [ ] **Step 7.3:** Run production build `npm run build` to verify all 63+ routes compile with 0 errors.
- [ ] **Step 7.4:** Write comprehensive Phase 6 delivery report artifact.
- [ ] **Step 7.5:** Commit and push all changes to GitHub.
