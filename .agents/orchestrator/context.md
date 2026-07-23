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
