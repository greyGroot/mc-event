# Passkit Integration & E2E Testing Plan

## 1. Passkit.com Integration
We will replace the local `.pkpass` generator with REST API calls to Passkit.com to ensure 100% native wallet support on both Android and iOS without warnings.

### Proposed Changes
- **src/lib/passkit.ts**: 
  - Remove `passkit-generator` and `node-forge`.
  - Add logic to authenticate with the Passkit.com REST API.
  - Implement a function to enroll guests into a Passkit Tier/Program and return the Smart Pass URL.
- **src/app/api/wallet/[guestId]/route.ts**: 
  - Update to redirect the user to their unique Passkit URL (which dynamically serves Apple or Google Wallet).
- **package.json**: Uninstall local pass generator dependencies.

## 2. End-to-End (E2E) Testing
We will introduce Playwright to automate testing of all critical user flows.

### Proposed Changes
- **package.json**: Install `@playwright/test` and generate standard testing scripts.
- **playwright.config.ts**: Configure the Next.js local web server and multi-browser testing (Chromium, Firefox, WebKit).
- **tests/registration.spec.ts**: 
  - Test missing required fields validation.
  - Test successful form submission and state transition to the Success UI.
- **tests/hostess.spec.ts**: 
  - Test that `/hostess` dashboard renders correctly.
  - Verify that the camera scanner component and visitor table load without crashing.
- **tests/api.spec.ts**:
  - Verify that the `/api/register` route validates input.

---

## User Action Required Before Execution
To execute the Passkit portion of this plan, please set up a free account on passkit.com, create a project, and add your API keys to `.env.local`:
- `PASSKIT_API_KEY`
- `PASSKIT_API_SECRET`
- `PASSKIT_TIER_ID`
