# 🚀 Setup Guide

## Step 1 — Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" → Follow the steps
3. Go to **Project Settings** → **Your Apps** → Click **</>** (Web)
4. Register your app and copy the `firebaseConfig` object

## Step 2 — Enable Firebase Services
In Firebase Console:
- **Authentication** → Get Started → Enable **Email/Password**
- **Firestore Database** → Create database → Start in test mode
- **Hosting** → Get Started → Follow the steps

## Step 3 — Add Your Firebase Config
Open `assets/js/firebase.js` and replace:
```
YOUR_API_KEY            → your apiKey
YOUR_PROJECT_ID         → your projectId
YOUR_MESSAGING_SENDER_ID → your messagingSenderId
YOUR_APP_ID             → your appId
```

## Step 4 — Add Your Hosting URL
Open `assets/js/forgot-password.js` and replace:
```
YOUR_HOSTING_URL  →  https://YOUR_PROJECT_ID.web.app
```

## Step 5 — Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

## Step 6 — Set Custom Action URL
1. Go to Firebase Console → Authentication → Templates
2. Click **Password reset** → Edit (pencil icon)
3. Scroll to **Customize action URL**
4. Set it to: `https://YOUR_PROJECT_ID.web.app/action.html`
5. Click Save

## Step 7 — Add Authorized Domain
1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Click **Add domain**
3. Add: `YOUR_PROJECT_ID.web.app` (already there by default ✅)
4. Add: `localhost` (for local testing)

## ✅ Done! Your flow:
```
forgot-password.html  →  sends reset email
Email link            →  action.html (redirects)
reset-password.html   →  user sets new password
login.html            →  user logs in
```
