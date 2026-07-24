## 2026-07-24T06:43:34Z
<USER_REQUEST>
You are the Worker subagent for Milestone 9 (Playwright End-to-End Testing Setup & Test Suite Implementation) for the Premium Event Registration Next.js App.

Working Directory for your metadata/handoff: d:\2grow\mc-event\.agents\worker_m9\
Target Project Root: d:\2grow\mc-event

## Objectives

### Milestone 9: Playwright E2E Setup & Test Suite Implementation
1. Install `@playwright/test`:
   `npm install -D @playwright/test`
   And run `npx playwright install chromium webkit` (or install dependencies) if needed.
2. Create `playwright.config.ts`:
   - `testDir: './tests'`
   - `fullyParallel: true`
   - `use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' }`
   - Configure projects for:
     - `chromium` (Desktop Chrome)
     - `webkit` (Desktop Safari)
     - `Mobile Safari` (iPhone 12 or Mobile Safari device profile)
   - Configure `webServer`:
     `command: 'npm run dev'`, `url: 'http://localhost:3000'`, `reuseExistingServer: !process.env.CI`, `timeout: 120 * 1000`.
3. Create `tests/registration.spec.ts`:
   - Test 1 (Form Validation): Navigate to `/`, attempt to click submit button without filling fields. Verify validation error messages appear for First Name, Last Name, Company, Position, Email.
   - Test 2 (Valid Submission & Success Card Transition): Navigate to `/`, fill out fields (`John`, `Doe`, `Mastercard Inc`, `VP Engineering`, `john.doe.e2e@example.com`), click submit. Wait for network/UI transition. Verify Success Card appears with recipient name, company, QR ticket preview, "Download PDF Ticket" button, and "Add to Android Wallet" / "Google Wallet" button.
4. Create `tests/hostess.spec.ts`:
   - Test 1 (Auth Protection & Modal): Navigate to `/hostess`. Verify authentication password prompt/modal is displayed and protected content is hidden.
   - Test 2 (Invalid & Valid Auth): Enter wrong password, verify failure feedback. Enter correct password (`mastercard2026`), verify successful login.
   - Test 3 (Dashboard Layout & Visitors Table): Once logged in, verify Hostess dashboard layout, QR camera scanner section, and Visitors table (columns: Guest Name, Company, Position, Status badge, Check-in Time) render properly.
5. Create `tests/api.spec.ts`:
   - Direct API testing using Playwright's `request` context (`request.post('/api/register', ...)`):
   - Test 1: Send empty body `{}` to `/api/register`. Verify HTTP status 400 and error validation details.
   - Test 2: Send payload with invalid email e.g. `{ firstName: 'Test', lastName: 'User', company: 'MC', position: 'Dev', email: 'invalid-email' }`. Verify HTTP status 400.
   - Test 3: Send valid registration payload to `/api/register`. Verify HTTP status 200 and response JSON contains `{ success: true, guestId: expect.any(String) }`.
6. Run the Playwright tests (`npx playwright test`) and verify all test suites pass cleanly across all configured browsers!

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Completion & Report
Write `handoff.md` and `progress.md` in `d:\2grow\mc-event\.agents\worker_m9\` documenting test command outputs, files created, test suites verified, and pass logs. Then call send_message to notify the orchestrator.
</USER_REQUEST>
