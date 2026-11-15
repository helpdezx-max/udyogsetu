# UdyogSetu (उद्योगसेतू) — Daily Vacancy Supply Operations & Freshness SOP
**Standard Operating Procedure for Platform Operations, Moderation & Supply Quality**

---

## 1. Mandatory Vacancy Data Attributes

Every listing published on UdyogSetu must contain:
1. **Identifiable Hiring Organization:** Legal plant name, industrial cluster, and statutory registration status.
2. **Standardized Job Title:** (e.g. "CNC Turning Machine Operator", not vague titles like "Urgent Staff Needed").
3. **Specific Work Location:** MIDC Sector / Plot reference or Landmark (e.g. "Chakan Phase 2, Near Bhamboli Phata").
4. **Qualification Requirements:** Explicit eligibility criteria (10th, ITI Trade, Diploma).
5. **Experience Requirements:** Clear year band (Freshers, 1–3 Years, 3–5 Years).
6. **Transparent Salary Breakdown:** Net in-hand monthly salary, gross salary, PF/ESIC coverage, and overtime hourly rate.
7. **Employment Type:** Permanent On-Roll, Contractual (Fixed Term), NEEM/NAPS Trainee, or Apprentice.
8. **Application Method:** Direct web application or verified plant gate walk-in with date/time.
9. **Vacancy Source:** Direct Employer Submission, Authorized Partner Feed, or Verified Career Page.
10. **Publication Status & Freshness Timestamp:** Last confirmed date and rolling validity.

---

## 2. Daily Vacancy Operations Schedule (Morning & Evening Cadence)

```
08:30 AM — Automated Discovery Ingestion & Pre-Moderation Risk Scan
09:30 AM — Admin Review: Pending Moderation Queue & Duplicate Arbitration
11:00 AM — Vacancy Freshness Audit (14-day reconfirmation alerts dispatched to plant HR)
02:30 PM — Candidate Fraud Complaint & Whistleblower Investigation
05:30 PM — Daily Placement Dual-Confirmation Reconciliation
```

### Daily Review Checklist:
- [ ] **New Vacancies Ingested:** Check risk score. Any listing scoring $\ge 30$ must be manually inspected. Any listing with risk score $\ge 50$ (suspected extortion fee) must remain quarantined.
- [ ] **Duplicate Detection:** Review listings flagged with $\ge 80\%$ token similarity across identical MIDC plot addresses.
- [ ] **Freshness Audit (Rolling 14-Day Cycle):**
  - Vacancies $>14$ days old without employer confirmation automatically transition to `reconfirmation_required`.
  - Automated WhatsApp ping sent to Plant HR: *"Is this vacancy still open?"*
  - Vacancies $>30$ days old without employer confirmation automatically transition to `temporarily_unavailable`.
- [ ] **Filled / Closed Listings:** Archive vacancies marked as filled to prevent wasted candidate travel.
- [ ] **Employer-Reported Corrections:** Review wage or shift timing modifications requested by plant administrators.

---

## 3. Whistleblower & Anti-Extortion Quarantine SOP

If a candidate files a complaint alleging:
- Demanded money for application, interview, or registration.
- Demanded security deposit for uniform, tools, or ID card.
- Fake salary promise (actual offer significantly lower than published in-hand wage).

**Immediate Response Actions:**
1. **Auto-Suspension:** The reported vacancy is instantly quarantined and hidden from candidate search results within 60 seconds.
2. **Plant Contact Verification:** The compliance officer calls the registered Plant HR contact to verify whether third-party scammers are misusing their corporate identity.
3. **Blacklisting:** If the employer or agency is found complicit, their account is permanently suspended, trust badges revoked, and incident details forwarded to the Chakan Industrial Police Station & MIDC Association.
