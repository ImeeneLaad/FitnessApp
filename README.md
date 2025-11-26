# DrovaGo - React Native App

A modern React Native application built with Expo for seamless cross-platform development.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo Go app on your mobile device

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Install the **Expo Go** app on your mobile device
   - Scan the QR code that appears in your terminal or browser
   - The app will load on your device

## 📱 Running the App

### Using Expo Go (Recommended)

1. Start the development server:
   ```bash
   npm start
   ```

2. Open Expo Go on your mobile device

3. Scan the QR code:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app to scan the QR code

4. The app will load automatically on your device

### Alternative Commands

- **Web version:** `npm run web`
- **Android emulator:** `npm run android` (requires Android Studio)
- **iOS simulator:** `npm run ios` (macOS only)

## 🛠 Development

### Project Structure

```
DrovaGo/
├── App.js              # Main application component
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── assets/             # Images and static files
└── node_modules/       # Dependencies
```

### Key Features

- **Modern UI Design**: Clean, professional interface with cards and navigation
- **Tab Navigation**: Home, Trips, and Profile sections
- **Responsive Layout**: Works on all screen sizes
- **Cross-platform**: Runs on iOS and Android

### Customization

- Edit `App.js` to modify the main application logic
- Update `app.json` to change app metadata and configuration
- Add new components in separate files and import them

## 📦 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run eject` - Eject from Expo (not recommended)

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npm start -- --reset-cache
   ```

2. **Expo Go not connecting:**
   - Ensure your device and computer are on the same network
   - Try using tunnel mode: `npm start --tunnel`

3. **Dependencies issues:**
   ```bash
   rm -rf node_modules
   npm install
   ```

## 📱 App Features

- **Home Screen**: Welcome message, feature cards, and quick stats
- **Navigation**: Tab-based navigation between sections
- **Modern Design**: Clean UI with shadows, rounded corners, and proper spacing
- **Responsive**: Adapts to different screen sizes

## 🚀 Next Steps

To extend the app, consider adding:

- Real navigation with React Navigation
- State management with Redux or Context API
- API integration for real data
- Authentication system
- Push notifications
- Offline support

## 📄 License

This project is open source and available under the MIT License. 