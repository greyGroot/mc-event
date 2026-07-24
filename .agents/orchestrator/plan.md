# Execution Plan — Google Wallet Integration & Playwright E2E Testing

## Phase 7: Environment & Version Control Setup (M7)
- Dispatch worker to check out git branch `feat/google-wallet-integration`.
- Validate syntax of `.env.local` to ensure variables like `GOOGLE_WALLET_PRIVATE_KEY` are properly escaped (replacing `\n` with real newlines or valid PEM format), `GOOGLE_WALLET_ISSUER_ID`, and `GOOGLE_WALLET_CLIENT_EMAIL`.

## Phase 8: Official Google Wallet Integration (M8)
- Install required NPM packages: `google-auth-library` and `jsonwebtoken` (and `@types/jsonwebtoken` if TypeScript requires it).
- Create `scripts/setup-google-class.js`:
  - Uses Google Auth Library / REST API to authenticate as service account.
  - Defines base `EventTicketClass` (`${GOOGLE_WALLET_ISSUER_ID}.mastercard_event_ticket_class`) with Mastercard branding (hex colors, title, logo imagery).
  - Handles 409 conflict gracefully if class already exists.
- Update `src/lib/passkit.ts`:
  - Add Google Wallet JWT generation using `jsonwebtoken` signed with `GOOGLE_WALLET_PRIVATE_KEY`.
  - Pass payload structure: `EventTicketObject` referencing `EventTicketClass`, incorporating guest ID, guest name, event details, and scannable QR code (`{ type: 'qrCode', value: guestId }`).
  - Retain Apple Wallet `.pkpass` logic intact.
- Update `src/app/api/wallet/[guestId]/route.ts`:
  - When query param `?format=google` is passed, generate Google Wallet JWT via `passkit.ts` / `generateGoogleWalletJwt(guest)`.
  - Redirect request to `https://pay.google.com/gp/v/save/${signedJwt}`.

## Phase 9: End-to-End (E2E) Testing with Playwright (M9)
- Install `@playwright/test`.
- Create `playwright.config.ts`:
  - Configure `webServer` to start Next.js dev server (`npm run dev` or `npm run start` on port 3000).
  - Configure test projects for Chromium, WebKit, Mobile Safari.
- Create `tests/registration.spec.ts`:
  - Test registration form validation (submitting empty form shows errors).
  - Test valid submission flow, API request mock/interception or real write, and transition to Success Card UI.
- Create `tests/hostess.spec.ts`:
  - Test dashboard authentication protection.
  - Test successful hostess login with password.
  - Test hostess layout rendering and visitor table load.
- Create `tests/api.spec.ts`:
  - Direct API tests for `/api/register` payload validation (missing fields, invalid email format, successful registration JSON payload).

## Phase 10: E2E Verification & Forensic Integrity Audit (M10)
- Execute `scripts/setup-google-class.js` and verify Google Wallet class creation.
- Run `npx playwright test` and verify all tests pass across configured browsers.
- Perform Forensic Integrity Audit to ensure zero mock shortcuts and complete genuine code.

