## 2026-07-23T19:23:01Z
You are a worker subagent assigned to Milestone 3: Backend API, QR Code, PDF Ticket & Resend Email Integration.

Your working directory for metadata: `d:\2grow\mc-terminal\.agents\worker_m3`
Project directory: `d:\2grow\mc-terminal`

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Task Instructions**:
1. Create `progress.md` in `d:\2grow\mc-terminal\.agents\worker_m3\progress.md` with `Last visited: [timestamp]`.
2. Create helper `src/lib/qrcode.ts`:
   - Functions `generateQRCodeDataUrl(text: string)` and `generateQRCodeBuffer(text: string)` using `qrcode` library.
3. Create helper `src/lib/pdf.ts`:
   - Function `generatePDFTicketBuffer(guest: Guest, qrDataUrl: string)`:
   - Uses `pdfkit` (or `@react-pdf/renderer`) to programmatically create a luxury VIP Ticket PDF.
   - Includes Mastercard branding, VIP title, guest details (Name, Company, Position, Guest ID), event date/location, and embedded QR code image.
4. Create helper `src/lib/resend.ts`:
   - Function `sendTicketEmail(guest: Guest, pdfBuffer: Buffer)`:
   - Initializes Resend client using `process.env.RESEND_API_KEY`.
   - Sends confirmation email to `guest.email` with PDF ticket attached (`filename: ticket_${guest.id}.pdf`).
   - Handles missing API key gracefully with detailed warning logs while allowing the registration process to succeed.
5. Create helper `src/lib/db.ts`:
   - Firestore database operations helper with genuine Firestore integration (`db` from `@/lib/firebase`).
   - `saveGuest(guestData: RegistrationInput)`: saves document to `guests` collection with `is_checked_in: false` and `checkedInAt: null`. Handles runtime errors gracefully.
6. Refactor `/api/register/route.ts` (POST):
   - Validates input body with Zod.
   - Saves guest to Firestore `guests` collection.
   - Generates QR code and PDF ticket buffer.
   - Attempts Resend email delivery with attached PDF ticket.
   - Returns `{ success: true, guestId: guest.id, guest, qrCodeDataUrl }`.
7. Create `/api/ticket/[guestId]/route.ts` (GET):
   - Retrieves guest details by guestId.
   - Generates and returns PDF ticket as a downloadable response (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Mastercard_VIP_Ticket_${guestId}.pdf"`).
8. Run `npm run build` and `npm run lint` to verify 0 errors.
9. Write handoff report to `d:\2grow\mc-terminal\.agents\worker_m3\handoff.md`.
10. Send completion notification message to parent.
