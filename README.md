# 🎰 Slot Machine Game

A feature-rich, cross-platform slot machine game built with React and Capacitor, featuring multiple themed machines, mini-games, and deep progression systems.

## 🚀 Current Status: Phase 7 Complete ✅
The project has successfully implemented core gameplay, engagement features, and monetization structures. 

### ✅ Key Features
- **Core Gameplay**: Smooth slot animations, coin-based economy, and responsive design for Web, Android, and iOS.
- **Themed Machines**: 4 unique themes (Classic, Ocean, Vegas, Space) with unlock and upgrade systems (up to 5 levels, increasing payouts by 20%).
- **Mini-Games**: Scratch Cards, Coin Flip (Double-or-Nothing), Wheel of Fortune, and Card Higher/Lower games.
- **Progression Systems**:
  - **Battle Pass**: 10-tier seasonal system with free and premium ($9.99) tracks.
  - **Prestige System**: 10 levels of prestige (unlocks at level 100) with permanent XP and coin multipliers (up to 3.0x).
  - **Story Mode**: 5 campaign levels with boss battles and progressive rewards.
  - **Level/XP System**: Gain XP from every spin to unlock new features.
- **Engagement & Monetization**:
  - **Live Events**: Daily Happy Hour (1.5x rewards) and Weekend Bonuses (2x multipliers).
  - **Near-Miss System**: Intelligent animation system to increase excitement on close losses.
  - **Social**: Friend leaderboards, seasonal competitions (30-day), and guild/club functionality.
  - **Ads/IAP**: Rewarded video ads (AdMob) and In-App Purchases (RevenueCat).

## 🟢 Strengths (The "Goods")
- **Modular Architecture**: Clean separation of concerns with reusable utility functions.
- **High Engagement**: Multiple retention loops (Story, Prestige, Battle Pass) significantly increase session length and D30 retention.
- **Cross-Platform**: Unified codebase for web and mobile deployment.

## 🔴 Critical Issues (The "Bads")
- **State Management Fragmentation**: Current implementation uses fragmented state; needs migration to a unified store like **Zustand**.
- **Security Vulnerabilities**: Lack of server-side validation makes local storage and win calculations susceptible to manipulation.
- **Missing Backend Integration**: Leaderboards and sync features are currently local-only; requires a centralized API for real-time functionality.
- **Testing Infrastructure**: Zero unit, integration, or E2E tests currently exist.

## 📝 TODOs & Future Roadmap
- [ ] **Backend Integration**: Implement Firebase or Node.js API for cloud saves and real-time leaderboards.
- [ ] **Security**: Move win calculations and purchase validation to the server.
- [ ] **State Management**: Refactor core state using Zustand for better maintainability.
- [ ] **Testing**: Implement Jest (Unit) and Cypress (E2E) testing suites.
- [ ] **Localization**: Add multi-language support (i18n).
- [ ] **Customization**: Allow users to unlock and customize slot symbols and animated backgrounds.
- [ ] **Social Enhancements**: Bracket-style tournaments and cooperative guild challenges.

## 🛠 Setup & Deployment
- **Install**: `npm install`
- **Run Web**: `npm start`
- **Mobile Build**: `npm run build && npm run sync`
# 🎰 Slot Machine Game

Cross-platform slot machine game for Web, Android, and iOS with monetization.

## Features
- 🎮 Smooth slot machine animations
- 💰 Coin-based economy
- 📺 Rewarded video ads (AdMob)
- 🛒 In-app purchases
- 💾 Local storage for progress
- 📱 Responsive design

## Setup

### 1. Install Dependencies
```bash
npm install
npm install @capacitor-community/admob
npm install @revenuecat/purchases-capacitor
```

### 2. Run Web Version
```bash
npm start
```

### 3. Build for Mobile

#### Initialize Capacitor
```bash
npm run build
npm run init:capacitor
# Enter app name and ID when prompted
```

#### Add Platforms
```bash
npm run add:android
npm run add:ios
```

#### Sync and Open
```bash
npm run sync
npm run open:android  # For Android
npm run open:ios      # For iOS
```

## Monetization Setup

### AdMob
1. Create account at https://admob.google.com
2. Create app and ad units (Rewarded Video, Banner)
3. Update `capacitor.config.json` with your App ID
4. Update ad unit IDs in `src/services/adService.js`

### In-App Purchases (RevenueCat)
1. Create account at https://revenuecat.com
2. Configure products in App Store Connect / Google Play Console
3. Add products to RevenueCat dashboard
4. Update API key in `src/services/purchaseService.js`

### Product IDs
- `coins_500` - 500 coins ($0.99)
- `coins_1500` - 1500 coins ($2.99)
- `coins_5000` - 5000 coins ($7.99)
- `coins_15000` - 15000 coins ($19.99)

## Game Mechanics

### Symbols & Payouts
- 💎💎💎 = 500 coins
- 7️⃣7️⃣7️⃣ = 1000 coins
- 🍒🍒🍒 = 100 coins
- 🍋🍋🍋 = 80 coins
- 🍊🍊🍊 = 80 coins
- 🍇🍇🍇 = 80 coins

### Bet Amount
- 10 coins per spin

### Free Coins
- Watch ad: +100 coins
- Starting balance: 1000 coins

## Build for Production

### Web
```bash
npm run build
# Deploy 'build' folder to hosting (Netlify, Vercel, etc.)
```

### Android
1. Open Android Studio: `npm run open:android`
2. Update signing config in `android/app/build.gradle`
3. Build > Generate Signed Bundle/APK

### iOS
1. Open Xcode: `npm run open:ios`
2. Configure signing & capabilities
3. Product > Archive

## Configuration Files

### Android Permissions (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID"/>
```

### iOS Permissions (`ios/App/App/Info.plist`)
```xml
<key>NSUserTrackingUsageDescription</key>
<string>We use tracking to show you personalized ads</string>
```

## Deployment

### Web Hosting
- Netlify: Drag & drop 'build' folder
- Vercel: Connect GitHub repo
- Firebase Hosting: `firebase deploy`

### App Stores
- Google Play: Upload AAB file
- Apple App Store: Upload via Xcode

## Monetization Tips
1. Show rewarded ads when coins < 50
2. Offer daily login bonuses
3. Add limited-time coin sale events
4. Implement achievement system
5. Add social sharing for bonus coins

## License
MIT
