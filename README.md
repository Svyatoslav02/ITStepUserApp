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
