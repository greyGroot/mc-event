# Context & Technical Architecture — Premium Event Registration

## Technology Stack
- **Framework**: Next.js 14/15 (App Router, React 18/19, TypeScript)
- **Styling**: Tailwind CSS, Lucide React Icons, Framer Motion
- **Form & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Database**: Firebase Firestore (`firebase/firestore`, `firebase/app`)
- **Email Delivery**: Resend SDK (`resend`)
- **QR Code**: `qrcode` DataURL / Canvas generator
- **PDF Generation**: `pdfkit` / `@react-pdf/renderer`
- **Hostess Scanner**: `@html5-qrcode` / `html5-qrcode` camera video stream decoder
- **Digital Wallet**: `passkit-generator` / Passkit PKPass payload builder for Android / Apple / Google Wallet

## Theme System (Mastercard Luxury Aesthetic)
- Primary Dark Background: `#0A0A0A` / `#121212`
- Accent Primary: Mastercard Orange `#FF5F00` / Mastercard Red `#EB001B` / Amber `#F79E1B`
- Card Container: Dark glassmorphism `rgba(255, 255, 255, 0.04)` with subtle metallic borders `rgba(255, 95, 0, 0.2)`
- Typography: Sleek sans-serif with golden/amber gradients for headings.

## Data Schema (Firestore `guests` collection)
```typescript
interface Guest {
  id: string; // unique guest ID / uuid
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  createdAt: string; // ISO string or Firestore Timestamp
  is_checked_in: boolean; // default: false
  checkedInAt: string | null; // ISO string when hostess scans QR code
}
```

## Security & Protection
- `/hostess` route protected by password entry / cookie check matching `HOSTESS_PASSWORD` (default fallback: `mastercard2026`).
- API routes validate request bodies using Zod schemas.

## System Context & Architecture — Google Wallet & Playwright E2E

## Google Wallet Integration Architecture
- Key Environment Variables in `.env.local`:
  - `GOOGLE_WALLET_ISSUER_ID`: Google Pay & Wallet Console Issuer ID (e.g. `3388000000022301234`)
  - `GOOGLE_WALLET_CLIENT_EMAIL`: Service account email
  - `GOOGLE_WALLET_PRIVATE_KEY`: Service account RSA private key (PEM format with `\n`)
- Base Class Definition Script: `scripts/setup-google-class.js`
  - Auth: `google.auth.GoogleAuth` with `https://www.googleapis.com/auth/wallet_object.issuer` scope
  - Class ID: `${GOOGLE_WALLET_ISSUER_ID}.mastercard_event_ticket_class`
  - REST API endpoint: `https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass`
  - Branding: Hex color `#0A0A0A` / `#FF5F00`, Mastercard logo & title.
- JWT Signing (`src/lib/passkit.ts`):
  - Uses `jsonwebtoken` `jwt.sign(claims, privateKey, { algorithm: 'RS256' })`
  - Claims structure:
    - `iss`: service account email
    - `aud`: `google`
    - `origins`: `['http://localhost:3000']` (or origin URL)
    - `typ`: `savetowallet`
    - `payload`: `{ eventTicketObjects: [ { id: "${GOOGLE_WALLET_ISSUER_ID}.${guestId}", classId: "...", hexBackgroundColor: "#0A0A0A", logo: {...}, barcode: { type: "QR_CODE", value: guestId }, ... } ] }`
- Redirect API Handler (`src/app/api/wallet/[guestId]/route.ts`):
  - Handles `GET ?format=google`
  - Returns `NextResponse.redirect('https://pay.google.com/gp/v/save/' + jwt)`

## Playwright E2E Architecture
- Config: `playwright.config.ts`
  - Test directory: `tests`
  - `webServer`: `npm run dev` or `npm run start` (port 3000, `reuseExistingServer: !process.env.CI`)
  - Devices: Desktop Chrome, Desktop Safari / WebKit, Mobile Safari
- Test Specs:
  - `tests/registration.spec.ts`: Test client registration form validation, submission, and UI transition to success state.
  - `tests/hostess.spec.ts`: Test hostess dashboard login, auth protection, and visitor table load.
  - `tests/api.spec.ts`: Direct API test calls to `/api/register` verifying payload validation.
