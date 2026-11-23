# ITStepUserApp

React Native app built with Expo. To run it from a fresh clone:

1. Install Git and Node.js (npm is included with Node.js).
2. Clone the repository and open the client folder:

   ```bash
   git clone https://github.com/Svyatoslav02/ITStepUserApp.git
   cd ITStepUserApp/Client
   ```

3. Install the locked dependencies:

   ```bash
   npm ci
   ```

4. Copy `.env.example` to `.env` and put your own OpenWeather API key in `EXPO_PUBLIC_OPENWEATHER_API_KEY`. The app still starts without a key, but live weather will be unavailable.

   ```bash
   cp .env.example .env
   ```

5. Start Expo and scan the QR code with Expo Go:

   ```bash
   npx expo start
   ```

## Environment variable note

`.env` is local and must not be committed. Expo embeds `EXPO_PUBLIC_` values in the client bundle, so this weather key is visible to app users; do not use this mechanism for private credentials. A weather API key was previously committed in the repository history. Revoke that key and use a new one.

## Automated tests

Use Node.js 22, as in CI. From `Client`, install dependencies with `npm ci`, then run:

```bash
npm test
```

`npm run test:watch` reruns tests while editing. `npm run test:ci` runs once in CI mode and writes coverage to `Client/coverage/` (ignored by Git). Neither command starts Expo or requires an API key, emulator, or network connection during tests.

Tests live in `Client/__tests__/`, grouped into `services/`, `utils/`, and `components/`; `App.test.js` covers startup and favorite persistence through app state. Use `*.test.js` for new tests. The `jest-expo` preset matches Expo SDK 53, and React Native Testing Library tests component behavior. AsyncStorage uses its official in-memory mock; service requests in hook tests use Jest mocks. Tests do not read or change the device's saved data.

The initial suite checks saving/loading/removing favorites, duplicate prevention, malformed data and storage errors, city service results, place request errors and retry, stale responses, map/share actions, distances, and shared loading/error/empty views. Navigation and unrelated screens are mocked in the App tests; these are unit/component tests, not end-to-end device tests. Coverage reports the selected services, utilities and shared state components configured in `Client/jest.config.js`, not the entire application.

## Pull request checks and merge protection

`.github/workflows/ci.yml` runs the **Unit tests** job for PRs targeting `main` when opened, reopened, updated, or marked ready. It also supports merge queues. CI installs the lockfile with `npm ci`, runs `npm run test:ci`, and uploads coverage as the `test-coverage` artifact. Failures propagate to the PR's **Checks** tab; there is no `continue-on-error` or empty-suite bypass.

Repository settings are separate from the workflow file. A repository administrator must finish the following after pushing this branch:

1. Open a PR targeting `main` and confirm **CI / Unit tests** passes in **Checks**.
2. In **Settings → Branches**, edit the existing protection rule for `main` (or its existing ruleset under **Settings → Rules → Rulesets**).
3. Enable **Require status checks to pass before merging** and select **Unit tests**, provided by GitHub Actions. Keep existing review, code owner, and other protection requirements. Optionally require the branch to be up to date. Save the rule.
4. On a temporary PR branch, make one assertion fail and push it. Confirm that **Unit tests** fails and merge is blocked by that required check. Fix the assertion, push again, and confirm the check passes. Do not merge the intentional failure.

Until the actual PR run and required-check rule are verified on GitHub, the CI/merge-protection acceptance criteria are not fully validated. Do not close issue #46 based only on a local passing run.
