# Greenback Shopper

A budget-friendly shopping app that helps you track expenses and find deals while staying within your budget.

## Features

- **Budget Management**: Set and track your shopping budget
- **Receipt Scanning**: Scan receipts to automatically track expenses
- **Deal Finder**: Find the best deals and sales in your area
- **Savings Tracker**: Monitor your savings over time
- **Multi-platform**: Works on iOS, Android, and Web

## Getting Started

### Web Version
Open `index.html` in your browser to use the web version.

### Mobile App (Expo)
```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## App Store Deployment

### iOS App Store
1. Build the app: `expo build:ios`
2. Upload to App Store Connect
3. Submit for review

### Google Play Store
1. Build the app: `expo build:android`
2. Upload to Google Play Console
3. Submit for review

## Project Structure

- `App.js` - React Native mobile app
- `index.html` - Web version entry point
- `js/app.js` - Web app JavaScript
- `css/styles.css` - Web app styles
- `assets/` - App icons and splash screens

## Configuration

The app is configured for both web and mobile deployment through:
- `package.json` - Dependencies and scripts
- `app.json` - Expo configuration for mobile apps
- `index.html` - Web app entry point

## Permissions

### Mobile App Permissions
- **Camera**: For scanning receipts and barcodes
- **Storage**: For saving scanned images

### Web App Permissions
- **Camera**: Optional, for enhanced scanning features
- **Local Storage**: For saving user data and preferences

## Development

This project uses:
- React Native with Expo for mobile development
- Vanilla JavaScript for the web version
- CSS3 for styling
- HTML5 for the web interface
