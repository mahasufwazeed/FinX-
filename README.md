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

## ✅ Day 3 Milestone Engine Complete

- **Milestone APIs**: Connected directly to backend via `milestone.service.ts`
- **Vendors**: Can "Start", "Upload Deliverables", and "Submit" to PMs.
- **Project Managers**: Have dedicated deep-review pages (`/project-manager/reviews/[id]`). They can Approve or Reject (with enforced comments).
- **Corporate**: Track milestones natively.
- **Admin**: Has explicit pipeline tables identifying payloads awaiting escrow triggers.
- **Finance**: Master ledger table to view system financial flow.

## 🔜 Remaining Work For Friday
1. Develop Razorpay API injection keys for `CORPORATE` funding sequences.
2. Implement native blockchain or banking API integrations for `ADMIN` Escrow Triggers (`RELEASE_PENDING` -> `RELEASED`).
3. Refine PDF/Document viewing native modals instead of opening S3 tabs.
