---
name: Test_Cases
description: Generates comprehensive test plans in CSV format for team4-backend project functions with columns for ID, Title, Test Type, Test Suite Type, Preconditions, Test Steps, Expected Results, Actual Results, and Test Data.
author: Development Team
version: 1.3
---

# Test Plan CSV Generator

## Overview
This skill generates comprehensive test plans in CSV format for team4-backend project functions. The project uses **Jest** for unit testing, **TypeScript** for type safety, and follows **MVC architecture** with dependencies on Prisma ORM, Express.js, and custom middleware.

### Testing Philosophy
- **Coverage Target**: 100% coverage where feasible
- **Test Comprehensiveness**: Ensure test cases identified is comprehensive and explores a variety of test cases.
- **Output Format**: CSV table for easy import to test management tools
- **Framework**: Jest with TypeScript support
- **Organization**: Mirror `/src` structure in `/tests`

### Test Suite Types
- **Sanity**: Focused verification of recently changed or newly added functionality to confirm the build is stable enough for deeper testing.
- **Smoke**: Minimal critical-path checks that validate system startup and highest-risk business flows.
- **Feature**: Focused coverage for one feature area and directly related dependencies.
- **Full Regression**: Broad codebase-wide coverage including happy path, negative, edge, validation, auth, and error handling.

When generating test cases, always align depth and breadth with the selected suite type:
- Sanity: small targeted set for changed areas and immediate defect-prone paths.
- Smoke: small high-value set only.
- Feature: comprehensive for selected feature boundary.
- Full Regression: comprehensive across the requested scope or entire codebase.

## Output Format
All test plans are generated as CSV tables with the following columns:
- **ID**: Unique test case identifier (TC-001, TC-002, etc.)
- **Title**: Descriptive test case name
- **Test Type**: Category of the test (Happy Path, Unhappy Path, Data Validation, Edge Case, Authorization, etc.)
- **Test Suite Type**: Suite classification for execution strategy (Sanity, Smoke, Feature, Full Regression)
- **Preconditions**: Setup requirements before test execution
- **Test Steps**: Sequential steps to execute the test
- **Expected Results**: What should happen when test passes
- **Actual Results**: To be filled during test execution
- **Test Data**: Input values and mock data used

---

## Input Section

**Function Name:** 
```
[Enter the name of the function or feature to test]
Search the entire src/ folder to identify functions that need test coverage.
Use semantic search across the codebase to find relevant functions.
```

**Suite Type:**
- [ ] Sanity
- [ ] Smoke
- [ ] Feature
- [ ] Full Regression

**Split Output Into Categories:**
- [ ] Yes
- [ ] No

If the user has not specified split preference, ask before generating:
- "Do you want the test cases split into separate category files (for example auth, feature/domain, infrastructure), or kept in one combined CSV?"

If the user has not specified suite type, ask before generating:
- "Which suite type do you want: sanity, smoke, feature, or full regression?"

**File Location:**
```
[Enter the file path where the function is located]
Explore src/ directory structure including:
- src/controller/ - HTTP request handlers
- src/services/ - Business logic layer
- src/dao/ - Database access layer
- src/middleware/ - Request processing
- src/repositories/ - Data repositories
- src/mappers/ - Data transformation functions
- src/Auth/ - Authentication/Authorization
- src/routes/ - Route definitions
- src/dto/ - Data transfer objects
```

**Function Type:**
- [ ] Controller Method (handles HTTP requests)
- [ ] Service Method (business logic)
- [ ] DAO/Repository Method (database operations)
- [ ] Middleware (request processing)
- [ ] Utility/Helper Function
- [ ] Mapper (data transformation)

**Description:**
```
[Brief description of what the function does and its role in the MVC architecture]
```

**Parameters:**
```
[List each parameter with its type and description]
```

**Return Type:**
```
[Specify the return type with description]
```

---

## CSV Output Format

Generate test cases using this exact CSV format:

```csv
ID,Title,Test Type,Test Suite Type,Preconditions,Test Steps,Expected Results,Actual Results,Test Data
TC-001,Test name,Happy Path,Smoke,Prerequisites,Step 1; Step 2; Step 3,Expected outcome,,Input: value1; Mock: value2
TC-002,Test name,Unhappy Path,Full Regression,Prerequisites,Step 1; Step 2; Step 3,Expected outcome,,Input: value1; Mock: value2
```

### CSV Guidelines:
- Use semicolons (;) to separate multiple items within a single field
- Wrap fields containing commas in quotes ("field with, comma")
- ID format: TC-### (TC-001, TC-002, etc.)
- Test Type values: Happy Path, Unhappy Path, Data Validation, Edge Case, Authorization & Security, Error Handling
- Test Suite Type values: Sanity, Smoke, Feature, Full Regression
- Test Steps should be numbered and sequential
- Keep Expected Results concise but complete
- Leave Actual Results empty (for manual test execution)
- Include all relevant test data (inputs, mocks, expected outputs)
- Record technique traceability only inside the `Test Data` field using `Technique: <name>`

### CSV Schema Safety Guardrails (Mandatory)

The output must always remain valid 9-column CSV with this exact header:

```csv
ID,Title,Test Type,Test Suite Type,Preconditions,Test Steps,Expected Results,Actual Results,Test Data
```

Hard constraints:
- Never append free text after the 9th column.
- Never add an extra `Technique` column.
- Never modify, reorder, or rename header columns.
- If adding metadata (for example technique), include it inside `Test Data` only.
- Keep `Actual Results` empty unless explicitly asked to populate execution outcomes.

Valid technique placement example:

```csv
TC-001,Valid user login,Happy Path,Smoke,User exists,1. Send login request; 2. Verify response,Returns 200 and token,,"Input: email=user@example.com; password=Password123!; Technique: Use Case Testing"
```

Invalid patterns (forbidden):
- `...,"Input: ..."; Technique: Use Case Testing`  (text outside the 9th field)
- `...,Actual Results,Test Data,Technique` (extra column)
- Any row with more or fewer than 9 CSV columns

Post-edit validation (required before finalizing):
- Confirm header exactly matches the canonical 9-column header.
- Confirm every data row parses to exactly 9 columns.
- Confirm all `Technique:` tags appear only within `Test Data`.
- Confirm split files and consolidated file use identical schema.

When split output is selected:
- Keep the same CSV schema in every file.
- Keep IDs globally unique across files where possible.
- Use clear file naming based on category (for example, auth-test-cases.csv, job-roles-test-cases.csv, infrastructure-test-cases.csv).

---

## Test Case Categories to Cover

**Happy Path (Success Cases):**
- Normal execution with valid inputs
- All common use cases

**Unhappy Path (Failure Cases):**
- Invalid user credentials
- Failed operations and error scenarios
- Expected exceptions and error messages
- Graceful failure handling

**Edge Cases & Boundaries:**
- Empty/null/undefined values
- Maximum/minimum values
- Special characters and unicode
- Boundary conditions

**Error Handling:**
- Invalid inputs and validation failures
- Database/service failures
- Authorization and authentication failures
- HTTP error responses (400, 401, 403, 404, 500)

**Data Validation:**
- Type mismatches
- Required field validation
- Format validation (email, date, etc.)
- Business rule violations

**Authorization & Security:**
- Role-based access control
- Token validation and expiration
- Unauthorized access attempts
- Permission enforcement

---

## Test Design Techniques (Mandatory)

When generating test cases, explicitly apply the following techniques:
- Equivalence Partitioning
- Boundary Value Analysis
- Decision Tables
- Error Guessing
- Risk Based Testing
- Use Case Testing

### How To Apply Per Technique

**Equivalence Partitioning:**
- Identify valid and invalid input classes for each field and behavior.
- Add representative tests for each partition rather than redundant values.

**Boundary Value Analysis:**
- Include min-1, min, min+1 and max-1, max, max+1 where boundaries are defined.
- For string/date constraints, include empty, just-inside, and just-outside boundaries.

**Decision Tables:**
- For multi-condition logic (for example role + token validity + payload shape), derive combinations and expected outcomes.
- Cover each decision rule at least once with clear expected status/result.

**Error Guessing:**
- Add tests for realistic mistakes and malformed inputs based on implementation patterns.
- Include malformed headers, missing fields, corrupted tokens, unexpected types, and null/undefined payloads.

**Risk Based Testing:**
- Prioritize high-impact and high-likelihood risks first (auth, security, critical business paths, data integrity).
- Mark highest-priority tests as Smoke where appropriate.

**Use Case Testing:**
- Derive end-to-end user journeys and alternate flows from feature behavior.
- Include successful primary flow and at least one alternative/failure flow per major use case.

### Technique Coverage Rules

- For Feature and Full Regression suites: include at least one test case per listed technique.
- For Sanity suites: apply Risk Based Testing and Use Case Testing as mandatory; include Decision Tables where auth/permission logic is touched.
- For Smoke suites: apply Risk Based Testing and Use Case Testing as mandatory; include other techniques where practical.
- Record the applied technique in the `Test Data` field using `Technique: <name>` for traceability.
- If a technique is not applicable, state `Technique: N/A - <reason>` in at least one relevant row.

---

## Test Plan Re-Evaluation Workflow

Use this step-by-step process whenever the codebase changes and test plans may be outdated.

### Re-Evaluation Triggers

Re-evaluate test plans when any of the following occurs:
- New endpoint, service, middleware, DAO, mapper, or DTO is added.
- Existing logic, validation rules, auth behavior, or error handling changes.
- Database schema, seed behavior, or integration contracts change.
- A defect is found that indicates a missing or weak test case.

### Step-By-Step Re-Evaluation Plan

1. Confirm scope and suite strategy.
- Ask whether the update is Sanity, Smoke, Feature, or Full Regression.
- Ask whether output should be split or consolidated.

2. Detect and map code changes.
- Compare changed files and identify impacted modules in src and tests.
- Classify each impacted area by type: controller, service, DAO/repository, middleware, mapper, auth, route, DTO, or infrastructure.

3. Build an impact matrix.
- Map each code change to affected behaviors, inputs, outputs, and risks.
- Mark risk level as High, Medium, or Low based on user impact, security impact, and failure likelihood.

4. Re-apply test design techniques.
- Re-run Equivalence Partitioning, Boundary Value Analysis, Decision Tables, Error Guessing, Risk Based Testing, and Use Case Testing against changed areas.
- Add new cases where coverage gaps are found.
- Retire or de-prioritize obsolete tests where behavior no longer exists.

5. Update CSV test plan rows.
- Preserve existing IDs where test intent is unchanged.
- Create new IDs only for net-new test intents.
- Update Title, Test Type, Test Suite Type, Preconditions, Test Steps, Expected Results, and Test Data as needed.
- Ensure Test Data includes `Technique: <name>` for each row.

6. Validate quality gates.
- Verify all changed logic paths are covered by at least one relevant test.
- Verify high-risk paths are represented in Sanity/Smoke or top-priority Feature coverage.
- Verify auth and validation changes include negative and boundary tests.

7. Validate organization and consistency.
- If split output is selected, ensure each file uses identical schema and clear category naming.
- Ensure IDs remain unique across generated files where possible.
- Ensure no duplicate rows with identical intent and steps.

8. Validate CSV structure and field integrity.
- Verify exact header match: `ID,Title,Test Type,Test Suite Type,Preconditions,Test Steps,Expected Results,Actual Results,Test Data`.
- Verify every row has exactly 9 columns when parsed as CSV.
- Verify `Technique:` appears only inside `Test Data` and nowhere else.

9. Produce re-evaluation summary.
- Provide a concise delta report with: added tests, updated tests, removed tests, and residual risks.
- Call out any assumptions or unknowns that may require user confirmation.

### Re-Evaluation Output Checklist

Before finalizing updated test plans, confirm:
- Suite type and split preference were confirmed.
- Impacted modules were identified and mapped.
- All six design techniques were re-applied.
- High-risk changes received prioritized Sanity/Smoke coverage.
- CSV schema is valid and consistent in all output files.
- Every row parses to exactly 9 columns; no trailing out-of-column metadata exists.
- Summary of changes and residual risk is included.

---

## Split Recommendation Guidance

When asking about splitting output, include this rationale in concise form:
- Improves ownership by allowing teams to own specific suites.
- Speeds targeted execution for impacted areas.
- Reduces triage time by grouping failures by domain.
- Lowers merge conflicts compared with one large CSV.
- Maintains scalability as new features are added.

If user selects split output, also ask for preferred categories if not obvious:
- "Which categories do you want (for example auth, job roles, infrastructure)?"

If user selects non-split output:
- Generate one consolidated CSV and include all selected coverage scope.

---

## Example CSV Output

```csv
ID,Title,Test Type,Test Suite Type,Preconditions,Test Steps,Expected Results,Actual Results,Test Data
TC-001,Valid user login,Happy Path,Smoke,User exists in database; User account is active,1. Send POST request to /auth/login; 2. Include email and password in request body; 3. Verify response,Returns 200 status; Returns JWT token; Returns userId and role,,Input: email=user@example.com; password=Password123; Expected: token contains user claims
TC-002,Invalid password,Unhappy Path,Feature,User exists in database; User account is active,1. Send POST request to /auth/login; 2. Include correct email but wrong password; 3. Check response status,Returns 401 Unauthorized; Returns error message,,Input: email=user@example.com; password=WrongPassword; Expected: error
TC-003,Non-existent user,Unhappy Path,Feature,User does not exist in database,1. Send POST request to /auth/login; 2. Include non-existent email; 3. Check response,Returns 401 Unauthorized; Returns error message,,Input: email=nonexistent@example.com; password=Password123; Expected: error
TC-004,Empty email field,Data Validation,Full Regression,User database populated,1. Send POST request to /auth/login; 2. Submit with email field empty; 3. Check validation,Returns 400 Bad Request; Returns validation error,,Input: email=""; password=Password123; Expected: validation error message
TC-005,Invalid email format,Data Validation,Full Regression,User database populated,1. Send POST request to /auth/login; 2. Submit with invalid email format; 3. Check validation,Returns 400 Bad Request; Returns email format error,,Input: email=invalid.email; password=Password123; Expected: email validation error
TC-006,Sanity check for newly updated login validation,Data Validation,Sanity,Login validation rules were recently changed,1. Send POST request to /auth/login; 2. Submit payload known to pass current validation; 3. Confirm response shape,Returns expected success/validation behavior for the changed path,,Input: email=user@example.com; password=Password123!; Technique: Risk Based Testing
```