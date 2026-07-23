## 2026-07-23T19:31:01Z

You are a worker subagent assigned to Milestone 5: Hostess Scanner & Dashboard, Protected Auth & Visitor Table.

Your working directory for metadata: `d:\2grow\mc-terminal\.agents\worker_m5`
Project directory: `d:\2grow\mc-terminal`

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Task Instructions**:
1. Create `progress.md` in `d:\2grow\mc-terminal\.agents\worker_m5\progress.md` with `Last visited: [timestamp]`.
2. Create middleware / auth protection mechanism:
   - Create `src/middleware.ts` or password login modal/gate for `/hostess`.
   - Protects access to `/hostess` route requiring password match against `process.env.HOSTESS_PASSWORD` (default fallback `"mastercard2026"`).
   - If unauthenticated, displays sleek password access screen or redirects to password prompt.
3. Create API routes:
   - `POST /api/hostess/checkin`:
     - Receives `{ guestId, password }`.
     - Validates password.
     - Retrieves guest from Firestore `guests` collection.
     - If `is_checked_in == false`: updates document in Firestore to `is_checked_in = true` and `checkedInAt = new Date().toISOString()`. Returns 200 `{ success: true, alreadyCheckedIn: false, guest }`.
     - If `is_checked_in == true`: returns 400 `{ success: false, alreadyCheckedIn: true, guest, error: "Guest already checked in" }`.
     - If guest not found: returns 404 `{ success: false, error: "Guest not found" }`.
   - `GET /api/hostess/guests`:
     - Receives password query / auth header.
     - Fetches all documents from Firestore `guests` collection.
     - Returns `{ guests: Array<Guest> }`.
4. Create components:
   - `src/components/HostessScanner.tsx`:
     - Large, prominent "Scan QR Code" action button.
     - Integrates camera scanner utilizing `html5-qrcode` / `Html5QrcodeScanner`.
     - Displays full-screen glowing GREEN success overlay on valid first check-in (Guest Name, Company, Position, Check-in Time).
     - Displays full-screen glowing RED error overlay on already checked-in or invalid QR code.
   - `src/components/HostessDashboard.tsx`:
     - Executive dark table listing all registered guests.
     - Status column displaying badges: "Visited" (Glowing Green) vs "Vacant" (Muted Gray).
     - Search & filter bar (by name, company, position, or status).
     - Auto-refreshes / updates guest list after scan.
5. Build `/hostess` route (`src/app/hostess/page.tsx`):
   - Combines Password Gate, HostessScanner, and HostessDashboard with tab/view toggles.
6. Run `npm run build` and `npm run lint` to verify clean output with 0 errors.
7. Write handoff report to `d:\2grow\mc-terminal\.agents\worker_m5\handoff.md`.
8. Send completion notification message to parent (`a8b74ab8-b37b-4368-93fc-4c6aeb79d29e`).
