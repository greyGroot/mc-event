# Original User Request

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
