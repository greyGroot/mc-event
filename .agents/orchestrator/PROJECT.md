# Project: Premium Event Registration Next.js App

## Architecture
- Framework: Next.js (App Router) in `src/app`
- Database: Firebase Firestore (`guests` collection)
- UI/Theme: Tailwind CSS, Mastercard luxury dark aesthetic, Framer Motion
- Services: Resend API for emails, PDFKit / React-PDF for ticket PDFs, QR Code generator, Passkit / Google Wallet generator, HTML5-QRCode camera scanner.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 0 | Workspace Cleanup & Next.js Init | Clear `d:\2grow\mc-terminal` (except `.agents`), init Next.js App Router project & install dependencies | none | DONE |
| 1 | Infrastructure & Theme | Mastercard dark theme, global layout, Firebase client init (`src/lib/firebase.ts`) | M0 | DONE |
| 2 | Registration Form & Success UI | Mobile-first responsive registration form (`/`), Zod validation, Framer Motion success view | M1 | DONE |
| 3 | Backend API, QR, PDF & Email | `/api/register`, Firestore guest write, QR code gen, PDF ticket gen, Resend email sending | M1, M2 | DONE |
| 4 | Android Wallet / Passkit Integration | Passkit / Google Wallet pass generator endpoint & UI button on success screen | M3 | DONE |
| 5 | Hostess Scanner & Dashboard | `/hostess` route, password auth, camera QR check-in, real-time visitor table | M1, M3 | DONE |
| 6 | E2E Testing & Forensic Audit | End-to-end integration tests & Forensic Auditor verification | M0-M5 | DONE |

## Interface Contracts
### Client ↔ `/api/register`
- Request: `POST /api/register` with `{ firstName, lastName, company, position, email }`
- Response: `{ success: true, guestId, qrCodeDataUrl, pdfTicketUrl, walletPassUrl }`

### Hostess ↔ `/api/hostess/checkin`
- Request: `POST /api/hostess/checkin` with `{ guestId, password }`
- Response:
  - 200 OK: `{ success: true, alreadyCheckedIn: false, guest: { id, name, company, position, checkedInAt } }`
  - 400 Bad Request: `{ success: false, alreadyCheckedIn: true, guest: { ... }, error: "Already checked in at <time>" }`
  - 404 Not Found: `{ success: false, error: "Guest not found" }`

### Hostess ↔ `/api/hostess/guests`
- Request: `GET /api/hostess/guests?password=...`
- Response: `{ guests: Array<Guest> }`

## Code Layout
```
d:\2grow\mc-terminal\
├── .agents/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── hostess/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── register/
│   │       │   └── route.ts
│   │       ├── wallet/
│   │       │   └── [guestId]/
│   │       │       └── route.ts
│   │       └── hostess/
│   │           ├── checkin/
│   │           │   └── route.ts
│   │           └── guests/
│   │               └── route.ts
│   ├── components/
│   │   ├── RegistrationForm.tsx
│   │   ├── SuccessCard.tsx
│   │   ├── HostessScanner.tsx
│   │   ├── HostessDashboard.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── qrcode.ts
│   │   ├── pdf.ts
│   │   ├── resend.ts
│   │   └── passkit.ts
│   └── types/
│       └── index.ts
├── .env.example
├── .env.local
├── package.json
└── tailwind.config.js
```
