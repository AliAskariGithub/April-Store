# April Store — Tech Stack & Environment Configuration Guide

This document provides a comprehensive overview of the technology stack, architectural layers, and step-by-step instructions for acquiring all required environment keys and API credentials.

---

## 1. Architectural & Technology Stack

| Category | Technology | Version | Purpose & Description |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | `15.4.9` (App Router) | High-performance React framework providing Server-Side Rendering (SSR), Static Site Generation (SSG), and secure backend API Routes (`/app/api/*`). |
| **UI Library** | [React](https://react.dev/) | `19.2.1` | Concurrent rendering engine, server components, hooks, and declarative state orchestration. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.9.3` | End-to-end static type safety across data contracts, UI component props, hooks, and API handlers. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `v4.1.11` | Utility-first styling engine integrated via PostCSS `@tailwindcss/postcss`. Zero CSS runtime overhead. |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) | `12.23.24` | Fluid micro-interactions, modal dialog entries, cart drawer slide-overs, and page transitions. |
| **Icons** | [Lucide React](https://lucide.dev/) | `0.553.0` | Accessible, tree-shakeable SVG icon collection consistent across storefront and admin views. |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | `2.0.8` | Toast notification system for cart events, wishlist updates, and order confirmations. |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | `5.0.15` | Lightweight reactive global store with local storage persistence (`cartStore`, `wishlistStore`, `currencyStore`, `adminAuthStore`). |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | `7.87.0` / `3.24.2` | Type-safe form controls, instant field validation, and checkout schema parsing. |
| **AI & Vision OCR** | [@google/genai](https://www.npmjs.com/package/@google/genai) | `2.4.0` | Official Google GenAI SDK for Gemini 2.5/1.5 Flash models powering style chat, smart search, and receipt verification. |
| **Cloud Database & Auth** | [Firebase Web SDK](https://firebase.google.com/) | `12.18.0` | Modular Firestore database, Firebase Authentication, and Firebase Storage with local fallback. |
| **Payments** | Cash on Delivery & Direct Bank Transfer | Built-in | Frictionless checkout with AI-powered multimodal receipt vision verification. |
| **CMS** | [Sanity Studio](https://www.sanity.io/) | `v3` / `next-sanity` | Headless Content Management System for managing products, categories, and inventory. |
| **Utilities** | `clsx`, `tailwind-merge`, `cva` | Latest | Robust dynamic CSS class composition and design-system variant management. |

---

## 2. Artificial Intelligence Engine Details

The platform integrates **Google Gemini** using the modern `@google/genai` TypeScript SDK:

1. **AI Style Concierge (`/api/ai/chat`)**
   - Model: `gemini-2.5-flash`
   - Purpose: Conversational personal stylist, product advisor, sizing consultant, and order policy guide.
2. **Smart Semantic Search (`/api/ai/search`)**
   - Model: `gemini-2.5-flash`
   - Purpose: Natural language catalog query interpretation (e.g., *"evening cocktail dress under $150"* or *"minimalist desk organizer"*), returning matched product IDs and filters.
3. **Bank Transfer Receipt Verification Vision OCR (`/api/ai/verify-receipt`)**
   - Model: `gemini-2.5-flash` (Multimodal Vision)
   - Purpose: Parses uploaded bank transfer transaction screenshots (Meezan Bank, HBL, Standard Chartered, SadaPay, NayaPay, JazzCash, EasyPaisa, etc.) to extract transfer amounts, transaction IDs, timestamps, and validity status.

---

## 3. Environment Variables Reference Matrix

| Variable Name | Required? | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | Server-side only | Authenticates requests to the Google Gemini API. **Never expose to the browser.** |
| `APP_URL` | Optional | Server-side | Base deployment URL (e.g. `http://localhost:3000`) for absolute links and metadata. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Optional | Client & Server | Firebase Web API key for Firestore and Authentication. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Optional | Client & Server | Firebase Auth domain (e.g. `your-project.firebaseapp.com`). |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Optional | Client & Server | Firebase Cloud project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional | Client & Server | Google Cloud Storage bucket for uploads. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Optional | Client & Server | Firebase cloud messaging sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Optional | Client & Server | Firebase web app registration ID. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional | Client & Server | Sanity CMS Project ID. |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional | Client & Server | Sanity dataset name (`production`). |
| `SANITY_API_TOKEN` | Optional | Server-side only | Sanity write token for syncing products from admin/API to Sanity CMS. |

> **Note on Fallbacks:** If Firebase environment variables are omitted, the application automatically runs in resilient **Local Persistence Mode**, safely storing catalog edits, cart items, wishlists, and orders in the browser's persistent storage.

---

## 4. How & Where to Get Your API Keys (Step-by-Step)

### 4.1. Google Gemini API Key (`GEMINI_API_KEY`)

The Gemini API powers all AI capabilities, including style recommendations, search, and multimodal receipt OCR.

- **Direct Portal Link:** [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Instructions:**
  1. Sign in with your Google Account at [Google AI Studio](https://aistudio.google.com/).
  2. Click on **"Get API key"** in the left navigation sidebar or top menu.
  3. Click **"Create API key"** (choose an existing Google Cloud project or generate a new project automatically).
  4. Copy the generated string (starts with `AIzaSy...`).
  5. Add it to `.env.local`:
     ```env
     GEMINI_API_KEY="AIzaSyYourGeneratedGeminiKeyHere"
     ```

---

### 4.2. Firebase Web Configuration (`NEXT_PUBLIC_FIREBASE_*`)

Firebase provides cloud-hosted database persistence (Cloud Firestore) and user authentication (including Google sign-in).

- **Direct Portal Link:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Instructions:**
  1. Navigate to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"** (or select your existing project).
  2. In your Project Overview screen, click the **Web icon (`</>`)** to register a new Web App.
  3. Name your web app (e.g., `April Store Web`).
  4. Firebase will display your `firebaseConfig` object.
  5. In Firebase console:
     - Enable **Firestore Database** in production mode.
     - Enable **Authentication** (Google provider and Email/Password).

---

### 4.3. Sanity Studio CMS Configuration (`NEXT_PUBLIC_SANITY_*` & `SANITY_API_TOKEN`)

Sanity powers the headless CMS for managing products and content via `/studio`.

- **Direct Portal Link:** [https://www.sanity.io/manage](https://www.sanity.io/manage)
- **Instructions:**
  1. Log in to [Sanity Manage](https://www.sanity.io/manage) and open your project.
  2. Copy your **Project ID** and dataset name (`production`).
  3. Under **API** > **Tokens**, create an **API token** with `Editor` or `Administrator` permissions.
  4. Add them to `.env.local`:
     ```env
     NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
     NEXT_PUBLIC_SANITY_DATASET="production"
     NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"
     SANITY_API_TOKEN="sk_your_token_here"
     ```

---

## 5. Sample `.env.local` File

```env
# Google Gemini API Key (Server-Side)
GEMINI_API_KEY="AIzaSyExampleGeminiApiKeyHere"

# Base Application URL
APP_URL="http://localhost:3000"

# Firebase Client Configuration (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

# Sanity Studio CMS Configuration (Optional)
NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"
SANITY_API_TOKEN=""
```
