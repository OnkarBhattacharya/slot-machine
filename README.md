# Slot Machine

Cross-platform slot machine game built with React and Capacitor for Web, Android, and iOS.

## Current State

- Core slot gameplay, economy, and progression loops are implemented.
- Critical-path feature integrations are in place:
  - Battle Pass integrated in app flow.
  - Prestige integrated (level-gated reset + payout/XP multipliers).
  - Near-miss detection with visual feedback integrated in slot spins.
  - Leaderboards enhanced with all-time, friends, and seasonal views.
- Data persistence is currently local-first (localStorage via storage utilities).
- Backend/server validation is not yet implemented (planned).
- Automated test suite is not yet implemented (planned).

## Feature Matrix

### Core Gameplay

- Reel-based slot machine with weighted symbol logic.
- Multi-game machine selection with distinct configs per machine.
- Bet tiers with configurable multipliers.
- Jackpot pool and free spins flow.
- Win animation, sound, vibration, and near-miss effects.

### Game Options (Machines)

- Machines available:
  - `classic` (unlock level 1)
  - `egyptian` (unlock level 5)
  - `ocean` (unlock level 10)
  - `space` (unlock level 15)
  - `neon` (unlock level 20)
- Each machine has independent:
  - Symbol weights.
  - Payout table.
  - Jackpot combo symbol.
  - Free-spin reward amount.
  - Multiplier chance/range.
- Machine upgrades increase payout via upgrade bonus and are persisted in local storage.
- Current selected machine is persisted and reused on next launch.

### Progression and Retention

- Level and XP system.
- Battle Pass with seasonal tiers, free/premium reward tracks, and reward claiming.
- Prestige system with permanent multipliers and badge display.
- Achievements and daily rewards.
- Story mode and mini-games.

### Social and Competition

- Leaderboards:
  - All-time leaderboard.
  - Friend leaderboard.
  - Seasonal leaderboard with season timer and season rewards.
- Social, guild, and tournament modules are present in app flow.

### Monetization

- Rewarded/interstitial/banner ad hooks via AdMob service.
- Coin and bundle purchase hooks via RevenueCat purchase service.
- Shop flow and VIP subscription hooks.

## Architecture

The app follows a modular client-side architecture:

- `src/App.jsx`
  - Orchestrates global game flow and screen/modals.
  - Coordinates economy updates, progression, and service calls.
- `src/components/`
  - UI modules by feature (slot machine, leaderboard, shop, battle pass, guild, etc.).
- `src/services/`
  - Domain services for features and integrations (purchase, ad, leaderboard, prestige, battle pass, events, machine metadata/config access, etc.).
- `src/utils/`
  - Shared logic and infrastructure (machine-specific game logic/config, storage, near-miss utilities, offline/perf helpers, sound).
- `src/hooks/`
  - Feature hooks (`usePhase5` currently present).

### Data Flow (Current)

1. UI actions in components trigger handlers in `App.jsx`.
2. `App.jsx` calls feature services and utility logic.
3. Most state is stored in React state and persisted with `Storage`.
4. Leaderboard/purchase online methods exist as stubs/hooks, but authoritative backend validation is still pending.

## Project Structure

```text
src/
  components/        # Feature UI components
  services/          # Business logic and integration services
  utils/             # Shared utilities and game logic
  hooks/             # React hooks
  App.jsx            # Main application container
  App.css            # Global app styles
```

Key files for the machine system:

- `src/components/MachineSelector.jsx`
- `src/services/slotMachineService.js`
- `src/utils/gameConfig.js`
- `src/utils/gameLogic.js`
- `src/components/SlotMachine.jsx`

## Tech Stack

- React 18
- react-scripts 5 (Create React App build pipeline)
- Capacitor 5
- `@capacitor-community/admob` (ad integration)
- `@revenuecat/purchases-capacitor` (IAP integration)

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (recommended)
- For mobile:
  - Android Studio (Android builds)
  - Xcode (iOS builds, macOS only)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally (web)

```bash
npm start
```

### 3. Build web bundle

```bash
npm run build
```

## Available Scripts

- `npm start`: Start development server.
- `npm run build`: Create production web build.
- `npm run init:capacitor`: Initialize Capacitor project.
- `npm run add:android`: Add Android platform.
- `npm run add:ios`: Add iOS platform.
- `npm run sync`: Sync web assets/plugins to native projects.
- `npm run open:android`: Open Android project in Android Studio.
- `npm run open:ios`: Open iOS project in Xcode.

## Environment and Configuration

### API Endpoint

`LeaderboardService` uses:

- `REACT_APP_API_ENDPOINT` (optional)
- Fallback default: `https://api.example.com`

Set it in `.env` for real backend usage:

```bash
REACT_APP_API_ENDPOINT=https://your-api-domain.com
```

### RevenueCat

Update API key placeholder in:

- `src/services/purchaseService.js`

### AdMob

Configure AdMob IDs in:

- `src/services/adService.js`
- Capacitor app config/native manifests as needed per platform

## Build and Deployment

## Web Deployment

1. Build:

```bash
npm run build
```

2. Deploy `build/` to your host (Netlify, Vercel, Firebase Hosting, etc.).

## Android Deployment

1. Build and sync:

```bash
npm run build
npm run sync
```

2. Open Android project:

```bash
npm run open:android
```

3. Configure signing and generate AAB/APK in Android Studio.

## iOS Deployment

1. Build and sync:

```bash
npm run build
npm run sync
```

2. Open iOS project:

```bash
npm run open:ios
```

3. Configure signing/capabilities and archive in Xcode.

## Known Gaps / Risks

- No server-authoritative spin or payout validation yet.
- Purchase verification and anti-cheat hardening are incomplete.
- No formal automated unit/integration/E2E test suite yet.
- State is still largely component-driven; unified global state store is planned.

## TODO Roadmap (Production Priority)

1. Backend integration (Firebase or custom Node.js API).
2. Security hardening:
   - Server-side validation for spins/purchases.
   - Request signing and rate limiting.
   - Anti-cheat anomaly detection.
3. Error boundary + robust service-level error handling.
4. Testing infrastructure (unit/component/integration).
5. State management consolidation (e.g., Zustand).
6. Performance optimization and bundle tuning.
7. Optional TypeScript migration.
8. Long-tail features: offerwall, bracket tournaments, spectator mode, localization, deeper customization.

See `ACTION_PLAN.md` for the detailed phased implementation plan.

## Troubleshooting

- If `react-scripts` is missing, run `npm install`.
- If mobile plugin imports warn/fail, verify plugin versions are compatible with Capacitor 5.
- If native builds fail after dependency changes, run:

```bash
npm run sync
```

and clean/rebuild in Android Studio/Xcode.

## License

MIT (if applicable for your distribution).
