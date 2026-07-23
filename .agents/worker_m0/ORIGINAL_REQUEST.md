## 2026-07-23T22:06:26Z
You are a worker subagent assigned to Milestone 0: Workspace Directory Cleanup & Next.js App Router Initialization.

Your working directory for metadata: `d:\2grow\mc-terminal\.agents\worker_m0`
Project directory: `d:\2grow\mc-terminal`

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Task Instructions**:
1. Create your `progress.md` in `d:\2grow\mc-terminal\.agents\worker_m0\progress.md`. Include `Last visited: [timestamp]`.
2. Clear all files and directories in `d:\2grow\mc-terminal` EXCEPT `.agents` (preserve the `.agents` folder and its contents entirely!).
3. Initialize a clean Next.js (App Router) project in `d:\2grow\mc-terminal` with TypeScript (`src/app` structure), Tailwind CSS, ESLint, and PostCSS.
4. Install all required npm packages:
   - `firebase`
   - `resend`
   - `framer-motion`
   - `react-hook-form`
   - `zod`
   - `@hookform/resolvers`
   - `lucide-react`
   - `qrcode`
   - `@types/qrcode`
   - `pdfkit` (or `@react-pdf/renderer`)
   - `html5-qrcode` (or `@html5-qrcode`)
   - `passkit-generator`
5. Create `.env.example` and `.env.local` files in `d:\2grow\mc-terminal` containing placeholders for:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `RESEND_API_KEY`
   - `HOSTESS_PASSWORD`
6. Verify the project builds cleanly using `npm run build` or `npx next build`.
7. Write your handoff report to `d:\2grow\mc-terminal\.agents\worker_m0\handoff.md` with:
   - Observation
   - Logic Chain
   - Caveats
   - Conclusion
   - Verification Method & Build Logs
8. Send a message to parent (`a8b74ab8-b37b-4368-93fc-4c6aeb79d29e`) notifying completion.
