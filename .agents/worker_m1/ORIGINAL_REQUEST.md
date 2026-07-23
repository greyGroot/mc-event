## 2026-07-23T19:12:53Z

You are a worker subagent assigned to Milestone 1: Infrastructure, Mastercard Luxury Dark Theme & Firebase Client Setup.

Your working directory for metadata: `d:\2grow\mc-terminal\.agents\worker_m1`
Project directory: `d:\2grow\mc-terminal`

**MANDATORY INTEGRITY WARNING**:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

**Task Instructions**:
1. Create `progress.md` in `d:\2grow\mc-terminal\.agents\worker_m1\progress.md` with `Last visited: [timestamp]`.
2. Configure Tailwind CSS (`tailwind.config.ts` or `tailwind.config.js`) and `src/app/globals.css` with Mastercard luxury theme variables:
   - Primary dark background: `#0A0A0A` / `#121212`
   - Mastercard Orange accent: `#FF5F00`
   - Mastercard Red accent: `#EB001B`
   - Mastercard Gold/Amber glow: `#F79E1B`
   - Dark glassmorphism card classes, glowing border effects, luxury font headers.
3. Update `src/app/layout.tsx` to apply the Mastercard dark theme globally, including a sleek navigation header with Mastercard brand circles/logo and event title ("Mastercard Private Event Registration"), and a refined dark footer.
4. Create `src/types/index.ts` defining standard project TypeScript types:
   - `Guest` (`id`, `firstName`, `lastName`, `company`, `position`, `email`, `createdAt`, `is_checked_in`, `checkedInAt`)
   - `RegistrationInput` (`firstName`, `lastName`, `company`, `position`, `email`)
   - `CheckInResult` (`success`, `alreadyCheckedIn`, `guest`, `error`)
5. Create `src/lib/firebase.ts`:
   - Initialize Firebase App using `initializeApp` with config read from `process.env.NEXT_PUBLIC_FIREBASE_*`.
   - Export `db` (Firestore instance via `getFirestore(app)`).
   - Ensure safe runtime check (if `getApps().length === 0`).
6. Run `npm run build` to verify clean compilation with 0 TypeScript/ESLint errors.
7. Write your handoff report to `d:\2grow\mc-terminal\.agents\worker_m1\handoff.md` with:
   - Observation
   - Logic Chain
   - Caveats
   - Conclusion
   - Verification Method & Build Output
8. Send notification message to parent (`a8b74ab8-b37b-4368-93fc-4c6aeb79d29e`).
