# DoodyFree — Next.js on Vercel + Firebase Starter

## 1) Create Firebase project
- Console → Add project → enable **Firestore** + **Authentication** (Email/Password).
- Create a **Web app** to get client config (API key etc.).

## 2) Set security rules
- Firestore rules: deploy `firestore.rules` (edit as you need).

## 3) Clone & install
```bash
npm install
npm run dev
```

## 4) Environment variables
Copy `.env.example` → `.env.local` and fill values:
- NEXT_PUBLIC_FB_* from your Web app
- FB_ADMIN_* from your Service Account (server only). In Vercel env, keep the PRIVATE KEY with \n escapes.

## 5) Bootstrap an admin user
- Sign up in your app with the email you want as admin (build a minimal sign-in page or use Firebase Console Users).
- Call POST `/api/auth/set-claims` with body `{ "email": "you@example.com", "claims": { "admin": true, "role": "admin" } }`
  (Use curl or a REST client just once.)

## 6) Deploy to Vercel
- Push to GitHub, import in Vercel, add the same env vars.
- Deploy. Visit `/customers` and `/employees`.