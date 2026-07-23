# Execution Plan — Premium Event Registration Next.js App

## Phase 0: Workspace Directory Cleanup & Project Initialization
- Dispatch worker to clear working directory (`d:\2grow\mc-terminal`), preserving the `.agents` folder.
- Initialize fresh Next.js App Router project using TypeScript, Tailwind CSS, App Router (`src/app`), ESLint, and PostCSS.
- Install dependencies: `firebase`, `resend`, `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`, `qrcode`, `@types/qrcode`, `pdfkit` / `@react-pdf/renderer`, `@html5-qrcode` (or `html5-qrcode`), `passkit-generator` / passkit structure tools.
- Prompt user for Firebase Config object and `RESEND_API_KEY`.

## Phase 1: Infrastructure & Mastercard Dark Theme (M1)
- Create dark, premium layout inspired by Mastercard's luxury identity (`#0A0A0A` background, warm amber/orange accent `#FF5F00` / `#EB001B`, dark glass cards, metallic subtle borders, luxury typography).
- Initialize Firebase client SDK in `src/lib/firebase.ts` reading from environment variables in `.env.local`.
- Create `.env.example` file listing required environment variables (`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `RESEND_API_KEY`, `HOSTESS_PASSWORD`).

## Phase 2: Frontend Registration Flow (M2)
- Root page `src/app/page.tsx`: Mobile-first responsive registration card with title "Mastercard Exclusive Event Registration".
- Registration form fields: First Name, Last Name, Company, Position, Email (with Zod validation schema).
- Submit action: client-side validation -> POST to `/api/register`.
- On success: render high-end Animated Success View with Framer Motion (Confetti / glowing checkmark, ticket summary card, guest QR code preview, "Download PDF Ticket" button, "Add to Android Wallet" button).

## Phase 3: Backend API, QR Code, PDF Ticket & Resend Email (M3)
- `POST /api/register` route handler (`src/app/api/register/route.ts`):
  - Validate payload with Zod.
  - Write guest document to Firestore `guests` collection (`id`, `firstName`, `lastName`, `company`, `position`, `email`, `createdAt`, `is_checked_in: false`, `checkedInAt: null`).
  - Generate Data URL / Buffer QR Code for guest ID.
  - Generate PDF ticket (using PDFKit or React-PDF) with guest details, event header, Mastercard styling, and embedded QR code.
  - Send confirmation email with Resend API attaching the PDF ticket.
  - Return JSON payload `{ success: true, guestId, pdfUrl, walletPassUrl }`.

## Phase 4: Passkit / Android Digital Wallet Integration (M4)
- Digital Wallet integration endpoint `/api/wallet/[guestId]` or `/api/wallet`:
  - Generate valid Passkit `.pkpass` / Google Wallet pass object or payload containing event title, guest name, company, position, barcode (QR_CODE format), and Mastercard theme primary colors (`#000000` / `#FF5F00`).
  - Provide direct user action on success screen to save/open pass in Android / Google Wallet.

## Phase 5: Hostess Scanner & Dashboard (M5)
- `/hostess` route and `/api/hostess/auth`:
  - Protected entry (Password modal / middleware checking cookie or header against `HOSTESS_PASSWORD` default "mastercard2026").
  - Scanner View: Large "Scan Guest QR Code" button launching full-screen camera QR scanner (`html5-qrcode` / `@html5-qrcode`).
  - Check-in Handler (`POST /api/hostess/checkin`):
    - Reads guest document from Firestore.
    - If `is_checked_in` is false: updates `is_checked_in: true`, `checkedInAt: timestamp`, returns status 200. Shows glowing GREEN success modal with guest Name, Company, Position, and timestamp.
    - If `is_checked_in` is true: returns status 400. Shows glowing RED error modal ("Already Checked In at <time>!").
    - If guest missing: shows RED error modal ("Invalid QR Code / Guest Not Found").
  - Dashboard Visitors Table: Real-time / polling list of all guests from Firestore showing Name, Company, Position, Status badge ("Visited" [Green] / "Vacant" [Gray]), and Check-in timestamp, with search filter.

## Phase 6: E2E Integration Testing & Verification (M6)
- Comprehensive test harness covering form submission, Firestore document creation, API response formats, hostess login & checkin state transitions, duplicate check-in prevention, and wallet link generation.
- Forensic Auditor integrity review verifying zero mock/hardcode shortcuts.
