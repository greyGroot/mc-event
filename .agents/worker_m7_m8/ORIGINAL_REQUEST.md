## 2026-07-24T06:30:30Z
<USER_REQUEST>
You are the Worker subagent for Milestone 7 (Environment & Git Setup) and Milestone 8 (Official Google Wallet Integration) for the Premium Event Registration Next.js App.

Working Directory for your metadata/handoff: d:\2grow\mc-event\.agents\worker_m7_m8\
Target Project Root: d:\2grow\mc-event

## Objectives

### Milestone 7: Environment & Git Branch Setup
1. Execute `git status` and checkout a new branch named `feat/google-wallet-integration`. If it exists, checkout to it.
2. Read and validate `.env.local`. Ensure `GOOGLE_WALLET_PRIVATE_KEY` formatting is clean (convert literal `\n` into actual multiline RSA private key format if needed when loading in JS/TS or in `.env.local` so RSA signature signing succeeds). Check `GOOGLE_WALLET_ISSUER_ID` and `GOOGLE_WALLET_CLIENT_EMAIL`.

### Milestone 8: Google Wallet Integration
1. Install `google-auth-library` and `jsonwebtoken` (plus `@types/jsonwebtoken` if needed):
   `npm install google-auth-library jsonwebtoken`
   `npm install -D @types/jsonwebtoken`
2. Create script `scripts/setup-google-class.js`:
   - Authenticate with `google-auth-library` using `GOOGLE_WALLET_CLIENT_EMAIL` and `GOOGLE_WALLET_PRIVATE_KEY` with scope `https://www.googleapis.com/auth/wallet_object.issuer`.
   - Define class ID: `${GOOGLE_WALLET_ISSUER_ID}.mastercard_event_ticket_class`
   - Send REST POST request to `https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass` (or using googleapis / fetch with access token).
   - Base class schema MUST include Mastercard branding (Primary hex color e.g. `#0A0A0A` / `#FF5F00`, Issuer Name "Mastercard VIP Events", Event Title "Mastercard Exclusive Event", Logo image URL if available).
   - Gracefully handle 409 Conflict if class already exists.
   - Run the script (`node scripts/setup-google-class.js`) to verify class creation!
3. Update `src/lib/passkit.ts`:
   - Add a function `generateGoogleWalletJwt(guest: Guest)`:
     - Constructs JWT claims with `iss` (client email), `aud: "google"`, `origins: ["http://localhost:3000"]`, `typ: "savetowallet"`.
     - Payload `eventTicketObjects`: array containing object with ID `${GOOGLE_WALLET_ISSUER_ID}.${guest.id}`, `classId`, guest name, event name, hex background color, and `barcode: { type: "QR_CODE", value: guest.id }`.
     - Signs payload into JWT using `jsonwebtoken.sign(claims, privateKey, { algorithm: "RS256" })`.
   - Preserve existing Apple Wallet `.pkpass` generation functionality intact!
4. Update `src/app/api/wallet/[guestId]/route.ts`:
   - Check request search params for `format=google` (or `?format=google`).
   - When `format=google`, fetch guest by `guestId` (or format details), generate signed Google Wallet JWT via `generateGoogleWalletJwt`, and return a 302 redirect: `NextResponse.redirect(`https://pay.google.com/gp/v/save/${signedJwt}`)`.
   - Retain existing `.pkpass` route behavior when `format` is omitted or not `google`.
5. Run build (`npm run build`) to verify zero TypeScript or lint errors.

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Completion & Report
Write `handoff.md` and `progress.md` in `d:\2grow\mc-event\.agents\worker_m7_m8\` documenting commands executed, test/build outputs, code changes made, and verification evidence. Then call send_message to notify the orchestrator.
</USER_REQUEST>
