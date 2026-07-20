---
name: Bug_Reporting
description: Executes tests derived from Test_Cases outputs and records failures in CSV format with title, environment, reproduction steps, expected result, actual result, severity, priority, risk score, and evidence.
author: Development Team
version: 1.0
---

# Bug Reporting CSV Generator

## Overview
This skill is designed to follow directly from the Test_Cases skill. Use it after test cases have been created and when the next step is to design executable tests from those test cases, run them, capture outcomes, and document failures in a structured CSV bug report.

This skill is for:
- Turning test cases into executable test runs.
- Recording failed or unexpected outcomes.
- Producing bug reports in CSV format for triage and prioritization.
- Creating a repeatable defect log tied back to the originating test cases.

This skill is not for:
- Replacing the Test_Cases skill.
- Writing informal prose-only bug summaries.
- Logging feature requests or non-defect enhancements as bugs.

## Relationship To Test_Cases

Use this skill after one of the following has happened:
- Test cases were generated from `.github/skills/Test_Cases.md`.
- Existing CSV test cases in `.github/test-cases/` were reviewed and selected for execution.
- A Sanity, Smoke, Feature, or Full Regression run has been requested.

Expected handoff inputs from Test_Cases:
- Test case ID
- Title
- Test Suite Type
- Preconditions
- Test Steps
- Expected Results
- Test Data

This skill should preserve traceability from executed test case to bug report wherever practical.

---

## Output Format

All bug reports must be generated as CSV tables with the following columns in this exact order:

1. Title
2. Environment
3. Steps to Reproduce
4. Expected Result
5. Actual Result
6. Severity
7. Priority
8. Risk Score
9. Attachments/Evidence

Canonical CSV header:

```csv
Title,Environment,Steps to Reproduce,Expected Result,Actual Result,Severity,Priority,Risk Score,Attachments/Evidence
```

Example:

```csv
Title,Environment,Steps to Reproduce,Expected Result,Actual Result,Severity,Priority,Risk Score,Attachments/Evidence
Login returns 500 for valid credentials,"macOS; Node 22; local API; PostgreSQL Docker container","1. Start API; 2. Send POST /auth/login with valid credentials; 3. Inspect response","Returns 200 with access token","Returns 500 Internal Server Error",High,High,9,"Terminal output: npm test; API response body; stack trace excerpt"
```

---

## CSV Guidelines

- Keep the CSV valid and tabular with exactly 9 columns per row.
- Wrap fields containing commas in quotes.
- Use semicolons within a field when listing multiple values.
- Keep `Steps to Reproduce` sequential and action-oriented.
- Keep `Expected Result` aligned to the originating test case expectation.
- Keep `Actual Result` factual and observable.
- Record evidence in `Attachments/Evidence` when available.
- If no bug is found for a given executed test case, do not create a bug row for that passing result unless the user explicitly asks for a pass/fail execution log.

---

## CSV Schema Safety Guardrails (Mandatory)

Hard constraints:
- Never add extra columns.
- Never reorder or rename the required columns.
- Never append free text outside the 9th column.
- Never leave out `Risk Score`; calculate it using the defined model below.
- Never invent evidence that was not observed.

Post-edit validation before finalizing:
- Confirm header exactly matches the canonical 9-column header.
- Confirm every data row parses to exactly 9 columns.
- Confirm no trailing notes exist outside the CSV row structure.

---

## Environment Capture Rules

The `Environment` field should describe the environment from which the test was executed. Include what is known from the workspace or runtime context.

Prefer this structure:
- OS
- Runtime/toolchain
- Execution mode
- Relevant backing services
- Any environment flags or notable config

Examples:
- `macOS; Node 22; local Vitest run`
- `macOS; local API via npm run dev; PostgreSQL in Docker`
- `CI Linux runner; Node 22; npm run test`

If some environment information is unknown, include only verified facts. Do not guess.

---

## Severity And Priority Model

### Severity

Use one of these values:
- Critical
- High
- Medium
- Low

Interpretation:
- Critical: System unusable, security failure, data loss, or release-blocking outage.
- High: Major feature broken, no reasonable workaround, high user or business impact.
- Medium: Important defect with workaround or partial impact.
- Low: Minor defect, cosmetic issue, low operational impact.

### Priority

Use one of these values:
- Critical
- High
- Medium
- Low

Interpretation:
- Critical: Must be fixed immediately.
- High: Should be fixed in the current cycle.
- Medium: Should be scheduled soon.
- Low: Can be deferred if necessary.

### Risk Score

Calculate `Risk Score` by combining Severity and Priority using this numeric mapping:
- Critical = 4
- High = 3
- Medium = 2
- Low = 1

Formula:
- `Risk Score = Severity Score x Priority Score`

Examples:
- Critical + Critical = 16
- High + High = 9
- High + Medium = 6
- Medium + Low = 2

Always store the numeric result in the CSV.

---

## Execution Workflow

Use this workflow when converting test cases into bug reports.

1. Confirm scope.
- Identify whether the user wants Sanity, Smoke, Feature, or Full Regression execution.
- Identify which test case files or IDs are in scope.

2. Identify execution surface.
- Map each selected test case to an executable path.
- Determine whether it is best executed as unit test, integration test, API call, type-check, manual verification, or a combination.

3. Prepare environment.
- Capture the current verified environment.
- Start or verify required services if needed.
- Note blockers such as missing env vars, unavailable DB, or absent seed data.

4. Execute tests.
- Run the relevant automated tests when available.
- If no automated path exists, perform the narrowest manual verification that matches the test case.
- Record observed results exactly.

5. Compare actual vs expected.
- Use the originating test case `Expected Results` as the baseline.
- Log a bug only when the observed behavior differs materially from the expected behavior.

6. Assign severity and priority.
- Base severity on impact.
- Base priority on urgency and delivery risk.
- Calculate numeric risk score.

7. Capture evidence.
- Include terminal output summaries, response payloads, screenshots, log excerpts, stack traces, or file references where available.
- Evidence must be factual and reproducible.

8. Generate CSV bug rows.
- One row per distinct defect.
- Merge duplicates only when the same underlying defect causes the same observable failure.

9. Report residual gaps.
- Note tests not executed.
- Note blocked tests.
- Note inconclusive results separately from confirmed defects.

---

## Test Execution Types To Consider

When designing executable tests from test cases, consider the most appropriate execution type:
- Sanity testing
- Smoke testing
- Feature testing
- Full regression testing
- Unit testing
- Integration testing
- API testing
- Validation testing
- Authorization and security testing
- Error handling testing
- Type-check or compile validation
- Manual exploratory confirmation where automation is not available

If a test type is inappropriate, state that explicitly in the summary rather than forcing an invalid execution path.

---

## Evidence Guidance

Preferred evidence sources:
- Terminal command output
- Failing test output
- HTTP request and response payloads
- Stack traces
- Logs
- Screenshots when available
- File references to relevant code or test definitions

Evidence field examples:
- `Vitest output for authController.test.ts; response body {"message":"Internal server error"}`
- `Terminal output from npm run test; stack trace in auth service login path`
- `HTTP 401 response from GET /job-roles without token`

If no evidence can be captured, write:
- `No attachment captured; behavior reproduced manually in local environment`

---

## Bug Row Writing Rules

- Title should be concise and defect-focused.
- Steps to Reproduce should be directly executable.
- Expected Result should describe intended behavior, not implementation detail.
- Actual Result should describe what happened, including incorrect status codes or messages when relevant.
- Severity and Priority must use only the allowed values.
- Risk Score must always be numeric and derived from the defined matrix.

---

## Re-Evaluation And Follow-Up

Use this skill again when:
- A fix is delivered and retest is needed.
- A failed Sanity run needs escalation into Feature or Full Regression execution.
- New evidence changes severity or priority.
- Duplicate defects need consolidation.

---

## Final Output Checklist

Before finalizing bug report CSV output, confirm:
- The executed scope is clear.
- Environment reflects verified runtime facts only.
- Each bug row corresponds to an actual observed failure.
- Each row has exactly 9 columns.
- Severity and Priority use allowed values only.
- Risk Score is numeric and correctly calculated.
- Evidence is included where possible and not invented.
- Blocked or unexecuted tests are called out separately if relevant.

---

## Example Bug Report Output

```csv
Title,Environment,Steps to Reproduce,Expected Result,Actual Result,Severity,Priority,Risk Score,Attachments/Evidence
Protected job role route allows request without token,"macOS; Node 22; local API via npm run dev; PostgreSQL in Docker","1. Start API; 2. Send GET /job-roles without Authorization header; 3. Inspect response","Returns 401 Unauthorized","Returns 200 with job role payload",Critical,Critical,16,"HTTP response captured locally; request executed against local API"
Login returns 500 instead of 401 for invalid credentials,"macOS; Node 22; local Vitest run","1. Run auth controller/login test with invalid credentials path; 2. Inspect response","Returns 401 Invalid credentials","Returns 500 Internal server error",High,High,9,"Vitest failure output; response body mismatch"
```
