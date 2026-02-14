# Slot Machine

A high-performance, cross-platform slot machine game built with **React 18** and **Capacitor 5**, targeting Web, Android, and iOS.

## 🚀 Project Overview

The application features a modular architecture with comprehensive gameplay systems, economy loops, and cloud synchronization capabilities.

### Current Status
- **Core Gameplay**: Reel logic, weighted symbols, and multi-machine support.
- **Progression**: Level/XP system, Battle Pass, and Prestige (reset with multipliers).
- **Social**: Enhanced leaderboards (All-time, Friends, Seasonal).
- **Infrastructure**: Local-first storage with Firebase Option A (Auth, Firestore, Cloud Functions).
- **Quality Assurance**: Jest and React Testing Library suite for core components.

## ✨ Key Features

### Core Gameplay
- **Machine Variety**: Five distinct machines with level-gated unlocks:
  - `classic` (Lvl 1), `egyptian` (Lvl 5), `ocean` (Lvl 10), `space` (Lvl 15), `neon` (Lvl 20).
- **Advanced Logic**: Weighted symbol distributions, payout tables, and jackpot combinations unique to each machine.
- **Feedback Systems**: Near-miss detection, win animations, sound, and haptic feedback.

### Retention & Monetization
- **Progression Loops**: Seasonal Battle Pass, daily rewards, achievements, and story mode.
- **Social Competition**: Guilds, tournaments, and multi-view leaderboards.
- **Revenue Integration**:
  - **AdMob**: Rewarded, interstitial, and banner ads.
  - **RevenueCat**: In-app purchases for coin bundles and VIP subscriptions.

## 🏗️ Architecture

### Project Structure
```text
src/
├── components/   # Feature-specific UI (SlotMachine, MachineSelector, etc.)
├── services/     # Business logic (Purchase, Ad, Leaderboard, Security)
├── utils/        # Shared logic (GameConfig, GameLogic, Storage)
├── hooks/        # Custom React hooks (e.g., usePhase5)
└── App.jsx       # Main application orchestration
```

### Data Flow
1. **State Management**: Centralized using **Zustand** with persistence.
2. **Cloud Sync**: Firebase Option A enables server-side spin validation (`validateSpin`) and purchase verification (`verifyPurchase`) when enabled.
3. **Security**: Local data is hardened with **AES encryption** and **SHA-256 integrity hashes** via `SecurityService`.

## 🛠️ Tech Stack
- **Framework**: React 18
- **Platform**: Capacitor 5
- **Testing**: Jest / React Testing Library
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Monetization**: RevenueCat, AdMob

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Android Studio / Xcode (for mobile builds)

### Installation
```bash
npm install
```

### Essential Scripts
- `npm start`: Launch development server.
- `npm test`: Run tests in watch mode.
- `npm run build`: Generate production web bundle.
- `npm run sync`: Sync assets to native mobile projects.

## ⚙️ Configuration

### Environment Variables (.env)
| Key | Purpose |
| :--- | :--- |
| `REACT_APP_API_ENDPOINT` | Custom backend API URL |
| `REACT_APP_ENABLE_CLOUD_SYNC` | Enable/Disable Firebase integration |
| `REACT_APP_SECURITY_KEY` | AES encryption key |
| `REACT_APP_REQUEST_SIGNING_KEY` | Key for signing callable payloads |

### Security Hardening
The application includes local rate limiting (default 60 spins/min) and coin anomaly detection (`MAX_LOCAL_COIN_DELTA`) to prevent cheating before server-side validation.

## 📦 Deployment

### Web
1. `npm run build`
2. Deploy the `build/` directory to your hosting provider.

### Mobile
1. Build and Sync: `npm run build && npm run sync`
2. Open in IDE: `npm run open:android` or `npm run open:ios`
3. Configure signing and generate the release binary.

## 🚧 Roadmap & Risks

### Known Gaps
- Integration and E2E test coverage is pending.
- Anti-cheat hardening is ongoing.
- Performance validation on slow networks is in progress.

### TODO Roadmap
1. **Phase 1 (Integrated)**: Core features and enhanced leaderboards.
2. **Phase 2 (Infrastructure)**: Firebase backend and security hardening.
3. **Phase 3 (Optimization)**: Zustand consolidation and performance tuning.
4. **Future**: TypeScript migration, bracket tournaments, and localization.

## 📜 License
MIT
