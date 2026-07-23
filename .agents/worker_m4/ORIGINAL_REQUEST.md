## 2026-07-23T19:27:01Z
You are a worker subagent assigned to Milestone 4: Passkit / Android Digital Wallet Integration.

Your working directory for metadata: `d:\2grow\mc-terminal\.agents\worker_m4`
Project directory: `d:\2grow\mc-terminal`

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Task Instructions**:
1. Create `progress.md` in `d:\2grow\mc-terminal\.agents\worker_m4\progress.md` with `Last visited: [timestamp]`.
2. Create helper `src/lib/passkit.ts`:
   - Builds a valid Passkit / Android / Apple Wallet pass structure or Google Wallet JWT link format.
   - Programmatically sets up pass fields:
     - Header: "MASTERCARD VIP ACCESS"
     - Secondary fields: Guest Name, Company, Position
     - Primary field: Event Title ("Executive Event 2026")
     - Barcode: `PKBarcodeFormatQR` / `QR_CODE` containing guest ID string.
     - Custom branding styling: background color `#0A0A0A` / `#000000`, foreground text `#FFFFFF`, label text `#FF5F00` / `#F79E1B`.
3. Create API route `/api/wallet/[guestId]/route.ts`:
   - Retrieves guest data via `getGuestById(guestId)`.
   - Generates Passkit pass buffer or Google Wallet JWT link.
   - Returns Response with `.pkpass` attachment (`Content-Type: application/vnd.apple.pkpass`, `Content-Disposition: attachment; filename="Mastercard_VIP_${guestId}.pkpass"`), or JSON payload containing direct Google Wallet Save URL.
4. Update `src/components/SuccessCard.tsx`:
   - Connect the "Save to Android Wallet" button to trigger window download or navigate to `/api/wallet/${guest.id}`.
5. Run `npm run build` and `npm run lint` to verify clean compilation with zero errors.
6. Write handoff report to `d:\2grow\mc-terminal\.agents\worker_m4\handoff.md`.
7. Send completion notification message to parent (`a8b74ab8-b37b-4368-93fc-4c6aeb79d29e`).
