# Greenback Shopper — Prototype

This is a small static prototype of the Greenback Shopper main screen. It uses a dark theme with neon green accents. The main UI features:

- Top budget bar showing `$100.00 left`
- Large circular `TAP TO SCAN` button centered on the screen
- Bottom navigation bar with three items

Open `index.html` in a browser to view the prototype. For a better development experience you can run a simple static server, for example:

Using Python 3:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or using Node (if you have `http-server` installed):

```bash
npx http-server -c-1 .
```

Files added:

- `index.html`
- `css/styles.css`
- `js/app.js`

Expo React Native scaffold (optional):

Files added for Expo mobile prototype:

- `App.js` — React Native main app
- `package.json`, `app.json`, `babel.config.js`

To run the Expo prototype locally (optional):

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npx expo start
```

Then follow the QR / emulator options shown by Expo.
