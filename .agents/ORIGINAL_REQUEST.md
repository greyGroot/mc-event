# Original User Request

## 2026-07-23T19:05:43Z

<USER_REQUEST>
# Teamwork Project Prompt — Draft

> Status: Step 9 — Assemble and Validate (Ready for launch — awaiting user approval)
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

End-to-end Next.js (App Router) PoC for a Premium Event Registration application featuring a registration form, QR/PDF ticket generation, Android Wallet (Passkit) integration, email delivery, and a scanner dashboard for hostesses.

Working directory: `d:\2grow\mc-terminal` 
Integrity mode: demo

## Instructions for Team
*Before starting Step 1, please clear the working directory of its current contents to ensure a clean slate for the new Next.js project.*

## Requirements

### R1. Infrastructure & Base Setup
Set up the Next.js project structure, Tailwind CSS, and Firebase client. Create a premium, dark-themed global layout imitating Mastercard's exclusive style.
*Constraint: Firebase must be directly integrated, no database mocking. Pause execution to ask the user for the Firebase config object to set up `.env.local`.*

### R2. Frontend Registration Flow
Build a mobile-first responsive registration form (First Name, Last Name, Company, Position) on the root page using `react-hook-form` and `zod`.
On submit, save guest to Firestore `guests` collection and show a premium success screen with framer-motion animations.

### R3. Backend API (Tickets & Emails)
Create `/api/register` to handle form submissions. Generate a QR code based on guest ID and a basic PDF ticket (name + QR code). Send an email via Resend API with the PDF attached.
*Constraint: Pause execution to ask the user for the `RESEND_API_KEY`.*

### R4. Hostess Scanner & Dashboard
Create a `/hostess` route protected by hardcoded password middleware. Include a big button to scan the QR code via mobile camera to check guests in and update Firebase accordingly with visual success/fail screens. Include a table displaying the list of all visitors and their status (visited or vacant).

### R5. Android Wallet Integration (Passkit)
Integrate with passkit (or the applicable Google Wallet integration) so that after user registration, they can add their ticket to their Android Wallet. This ticket must have a custom design and display the generated QR code.

## Acceptance Criteria

### Infrastructure & Base
- [ ] Next.js app builds and runs successfully.
- [ ] Visual inspection confirms a dark-themed, premium layout.
- [ ] Firebase client is correctly initialized with the provided environment variables.

### Registration Flow
- [ ] Form validation prevents empty or invalid submissions.
- [ ] The layout scales appropriately for mobile-first responsive viewing.
- [ ] Submitting a valid form adds a document to the `guests` collection in Firestore with `is_checked_in: false`.
- [ ] The success screen renders with framer-motion animations post-submission.

### Backend APIs & Digital Wallet
- [ ] Submitting the registration form invokes `/api/register`.
- [ ] A PDF containing the guest's name and QR code is successfully generated.
- [ ] An email with the attached PDF is sent via the Resend API.
- [ ] The system generates a custom-designed digital wallet ticket (Passkit/Android Wallet) displaying the QR code, allowing the user to add it to their device.

### Hostess Scanner & Dashboard
- [ ] Navigating to `/hostess` without the correct password restricts access.
- [ ] The route displays a large scan button and a table of visitors indicating "visited" or "vacant" status.
- [ ] Scanning a guest QR code for the first time updates their Firebase status to visited/true and shows a green success indicator.
- [ ] Scanning a guest QR code that has already been checked in shows a red error indicator.
</USER_REQUEST>

## 2026-07-24T06:29:40Z

<USER_REQUEST>
# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Execute via teamwork_preview

Build an end-to-end Next.js (App Router) Proof of Concept (PoC) for a Premium Event Registration application. The system features a mobile-first, high-end UI, QR/PDF ticket generation, email delivery, Apple Wallet support, and requires finalizing 100% native Google Wallet integration along with Playwright E2E testing.

Working directory: d:\2grow\mc-event
Integrity mode: development

## Requirements

### R0. Environment & Version Control Setup
- Checkout a new separate branch for this work (e.g., `feat/google-wallet-integration`).
- Validate the syntax of `.env.local` to ensure variables like `GOOGLE_WALLET_PRIVATE_KEY` are correctly formatted and free of escaping errors.

### R1. Official Google Wallet Integration
Implement the official Google Wallet JWT signing flow using the provided service account keys in `.env.local` (`GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_PRIVATE_KEY`, `GOOGLE_WALLET_CLIENT_EMAIL`).
- Install `google-auth-library` and `jsonwebtoken`.
- Create a node script `scripts/setup-google-class.js` to define the base `EventTicketClass` via the Google Wallet REST API. Ensure the base class incorporates Mastercard branding (e.g., brand colors, logo imagery if available).
- Update `src/lib/passkit.ts` to properly sign the JSON payload into a JWT for Google Wallet, while retaining Apple Wallet `.pkpass` logic. The Google Wallet pass object must include a scannable QR code representing the guest ID.
- Update `src/app/api/wallet/[guestId]/route.ts` so that requesting `?format=google` triggers a redirect to `https://pay.google.com/gp/v/save/${signedJwt}`.

### R2. End-to-End (E2E) Testing
Introduce Playwright to automate testing of critical user flows.
- Install `@playwright/test` and configure `playwright.config.ts` for Next.js local web server and multi-browser testing (Chromium, WebKit, Mobile Safari).
- Create `tests/registration.spec.ts` to test form validation, submission, and UI transition to the Success Card.
- Create `tests/hostess.spec.ts` to test dashboard authentication, layout rendering, and visitor table load.
- Create `tests/api.spec.ts` to verify `/api/register` payload validation logic.

## Acceptance Criteria

### Google Wallet Integration
- [ ] `scripts/setup-google-class.js` executes successfully and creates the `EventTicketClass` without authentication errors.
- [ ] Navigating to `/api/wallet/[guestId]?format=google` for a valid guest returns a redirect to the correct `pay.google.com` JWT save URL.

### E2E Testing
- [ ] Running `npx playwright test` executes all test suites (`registration.spec.ts`, `hostess.spec.ts`, `api.spec.ts`) and passes successfully across the configured browsers.
</USER_REQUEST>
