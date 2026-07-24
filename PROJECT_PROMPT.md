# Premium Event Registration: Core Architecture & Native Wallet Plan

This document serves as the core blueprint and execution prompt for the multi-agent team. It outlines the overarching goals, system architecture, user flows, and the specific execution plan for finalizing the Official Google Wallet integration and Playwright E2E testing.

## 1. Project Goal
Build an end-to-end Next.js (App Router) Proof of Concept (PoC) for a **Premium Event Registration application**. The system must feature a mobile-first, high-end UI, a seamless registration flow, QR/PDF ticket generation, email delivery, and 100% native Apple and Google Wallet integration. It also includes a protected dashboard for event hostesses to scan QR codes and manage guest check-ins.

## 2. System Architecture
- **Frontend Core**: Next.js 14+ (App Router), React 19.
- **Styling & UI**: Tailwind CSS (v4), Framer Motion (for premium micro-animations and glassmorphism effects), Lucide React (icons).
- **Backend & API**: Next.js Serverless API Routes (`/api/register`, `/api/wallet/*`, etc.).
- **Database**: Firebase Firestore (server-side admin integration) for storing guest data and check-in statuses.
- **Email Delivery**: Resend API for sending custom HTML, dark-themed VIP confirmation emails with PDF attachments.
- **Wallet Integration**: 
  - **Apple Wallet**: Local `.pkpass` generation using `passkit-generator`.
  - **Google Wallet**: Official Google Wallet REST API / JWT generation using Google Cloud Service Account credentials (`GOOGLE_WALLET_ISSUER_ID`, `GOOGLE_WALLET_PRIVATE_KEY`, etc.).
- **E2E Testing**: Playwright for cross-browser end-to-end flow validation.

## 3. User Flows

### A. Guest Registration Flow
1. **Landing**: Guest visits the home page (`/`) and experiences a premium, dark-themed UI.
2. **Form Submission**: Guest enters their First Name, Last Name, Company, Position, and Email.
3. **Processing**: 
   - Backend saves the guest to Firestore with `is_checked_in: false`.
   - Backend generates a PDF ticket containing a unique QR code.
   - Backend uses Resend to email the PDF ticket, an Apple Wallet download link, and a Google Wallet native save link to the guest.
4. **Success State**: Guest is transitioned to the Success UI, displaying their details, a QR code preview, and distinct buttons to download the PDF, add to Apple Wallet, or add to Google Wallet.

### B. Hostess Check-In Flow
1. **Access**: Hostess navigates to `/hostess` and enters a secure password.
2. **Dashboard**: Hostess sees a real-time list of all registered guests and their check-in status (Vacant / Visited).
3. **Scanning**: Hostess clicks "Scan QR Code", opening a full-screen camera overlay.
4. **Validation**: The hostess scans a guest's QR code (from a PDF or digital wallet pass). The system instantly validates the ID against Firestore, marks the guest as checked-in, and visually updates the dashboard.

## 4. Key Technical Challenges
- **Native Google Wallets**: Local `.pkpass` files imported into Google Wallet drop QR codes due to strict security validations. **Solution:** Since the Service Account is now provided, we will use the official Google Wallet SDK/JWT signing to issue a native, cryptographically secure pass.
- **Reliable QR Scanning**: Ensuring the browser-based `html5-qrcode` scanner maintains the correct aspect ratio and handles mirrored laptop webcams without distorting the QR code geometry.

---

## 5. Execution Plan: Official Google Wallet & E2E Testing

The multi-agent team must execute the following two phases to finalize the PoC:

### Phase 1: Official Google Wallet Integration
We will implement the official Google Wallet JWT signing flow using the provided service account keys in `.env.local`.
- **`package.json`**: Install `google-auth-library` and `jsonwebtoken`.
- **`scripts/setup-google-class.js`**: Create a one-off node script that uses the Service Account to communicate with the Google Wallet REST API to create the base `EventTicketClass` (e.g., `mastercard.executive.event.2026`) under the new Issuer ID.
- **`src/lib/passkit.ts`**: 
  - Retain the `.pkpass` generation logic for Apple Wallet.
  - Update `generateGoogleWalletJwtUrl` to properly sign the JSON payload into a JWT using the `GOOGLE_WALLET_PRIVATE_KEY` and the `GOOGLE_WALLET_CLIENT_EMAIL`.
- **`src/app/api/wallet/[guestId]/route.ts`**: 
  - Ensure that requesting `?format=google` triggers a redirect to `https://pay.google.com/gp/v/save/${signedJwt}`.

### Phase 2: End-to-End (E2E) Testing
Introduce Playwright to automate testing of all critical user flows.
- **`package.json`**: Install `@playwright/test` and generate testing scripts.
- **`playwright.config.ts`**: Configure the Next.js local web server and multi-browser testing (Chromium, WebKit, Mobile Safari).
- **`tests/registration.spec.ts`**: Test form validation, successful submission, and UI transition to the Success Card.
- **`tests/hostess.spec.ts`**: Test the `/hostess` dashboard authentication, layout rendering, and visitor table load.
- **`tests/api.spec.ts`**: Verify `/api/register` payload validation logic.
