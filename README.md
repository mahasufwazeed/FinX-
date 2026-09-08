# FinX- Frontend Monorepo

## 🚀 Setup Instructions

FINX is a true monorepo structure. You only need to run ONE command to boot the entire stack natively!

1. Open a terminal in the ROOT of this project.
2. Run `npm install`
3. Run `npm run dev`

The `npm run dev` script uses NPM workspaces to boot the Next.js frontend on `localhost:3000` and the Express API on `localhost:8080`.

## 📦 Architecture

- **`frontend/`**: The Next.js 15+ React App (Tailwind, Zustand, Axios).
- **`backend/`**: Express.js + Typescript API strictly honoring the backend interface contracts.
- **`db/`**: The persistent filesystem JSON storage to prevent complex driver bugs on local windows.

## ✅ Day 4 Razorpay Escrow Injection Pipeline

- **Razorpay API Backend Collection**: Native endpoints created inside the express server (`/api/payments/orders` & `/api/payments/verify`) that exactly match the cryptographic spec. They lock JSON-DB arrays for the escrow duration.
- **Frontend Checkouts**: Connected precisely logic flow. A Corporate selects "Fund Securly", Razorpay window initiates securely!
- **Buyer Dashboards**: Global overview pipeline mapping funds locked into explicit vaults (`/corporate` and `/corporate/payments`).
- **Complete Test Suite Requirements Met**: `checkout.js` is perfectly injected only when interacted. Secure signatures mapped perfectly to Next.js Client components.

## 🔜 Remaining Work For Friday
1. Implement native blockchain or banking API integrations for `ADMIN` Escrow Triggers (`RELEASE_PENDING` -> `RELEASED`).
2. Final End-To-End Security Pentesting.
