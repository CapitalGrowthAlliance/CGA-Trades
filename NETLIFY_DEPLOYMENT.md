# Netlify Deployment Guide

This project is configured for seamless deployment on Netlify as a **purely frontend application** interacting directly with Firebase client SDKs.

## Prerequisites

1.  A [Netlify](https://www.netlify.com/) account.
2.  A [Firebase](https://console.firebase.google.com/) project with Firestore and Authentication enabled.

## Deployment Steps

### 1. Connect to Netlify
- Push your code to a GitHub, GitLab, or Bitbucket repository.
- In the Netlify dashboard, click **"Add new site"** -> **"Import an existing project"**.
- Select your repository.

### 2. Configure Build Settings
Netlify should automatically detect the settings from `netlify.toml`, but ensure they match:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 3. Set Environment Variables
In the Netlify dashboard, go to **Site settings** -> **Environment variables** and add the following:

#### Firebase Client (Vite)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_ID` (usually `(default)`)
- `VITE_FIREBASE_DATABASE_URL`

#### Other
- `VITE_GEMINI_API_KEY` (for AI features)
- `VITE_MARKETS_API_KEY` (for market data)
- `NODE_ENV`: `production`

### 4. Deploy
Click **"Deploy site"**. Netlify will build your React app and host it as a static site.

## Local Development
To test the production build locally:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify dev`

## Troubleshooting
- **Blank Screen:** Ensure all `VITE_` variables are correctly set. Vite requires the `VITE_` prefix to expose variables to the client.
- **Firestore Connection:** Ensure your Firebase project's Firestore rules allow access from your deployed site's domain.
- **Firebase: Connection failed. The client is offline:** This error usually means your Firebase configuration is incorrect or missing in your environment variables. Double-check all `VITE_FIREBASE_*` variables.
