# FINX — Saturday Demo Script (5–10 Minutes)

**Presenter:** Gowri Shankar (Backend) & Mahasuf (Frontend)  
**Product:** FINX — B2B Milestone-Based Fiat Escrow Platform  
**Target Environment:** Localhost (`http://localhost:3000` / `http://localhost:8080`)  
**Mode:** Razorpay Sandbox / Test Mode  

---

## 🎬 Demo Overview

This live demonstration presents a complete, zero-mock, real-time B2B fiat escrow transaction between a Corporate Buyer and a Service Vendor, backed by cryptographic signature verification, exact monetary arithmetic, double-entry escrow ledgering, and immutable audit logs.

---

## ⏱️ Step-by-Step Demo Sequence

### 1. Launch & Introduction (1 Minute)
* Open the browser at `http://localhost:3000`.
* Show the FINX landing page highlighting our core mission: **B2B Milestone-Based Fiat Escrow**.
* Explain the problem: B2B trust deficit where buyers risk upfront payments and vendors risk non-payment after delivery.

---

### 2. Corporate Buyer Sign-In & Dashboard (1 Minute)
* Navigate to `http://localhost:3000/login`.
* Sign in as a Corporate Buyer (e.g. `buyer@finx.com` or register a new Buyer).
* Show the Corporate Overview (`/corporate`) displaying real-time committed capital, active projects, and escrow balances.
* Point out the role-aware navigation bar dynamically configured for Corporate buyers.

---

### 3. Initiate a Real B2B Deal (1 Minute)
* Navigate to **Projects** (`/corporate/projects`).
* Click **Create Deal**.
* Fill in:
  - **Deal Title:** `Enterprise Cloud Migration & Kubernetes Hardening`
  - **Description:** `Production infrastructure migration to AWS EKS with Terraform`
  - **Assigned Vendor:** Select an existing registered vendor from the dropdown (loaded dynamically from `/api/deals/sellers`).
  - **Total Amount:** `₹10,000` (INR)
* Click **Submit Deal**.
* Highlight that the deal is created with status `DRAFT` / `PENDING_ACCEPTANCE`, backed by a UUID in Supabase PostgreSQL.

---

### 4. Vendor Sign-In & Deal Acceptance (1 Minute)
* Open an incognito window or log out, then sign in as the assigned Vendor.
* Navigate to **My Projects** (`/vendor/projects`).
* Show the newly assigned deal in `PENDING_ACCEPTANCE` state.
* Click **Accept Deal**.
* Point out that the deal transitions immediately to `ACTIVE`.
* Emphasize the IDOR security rule: unassigned vendors or unrelated third parties cannot accept or view this deal.

---

### 5. Corporate Creates a Milestone (1 Minute)
* Return to the Corporate session and refresh the deal page.
* Note that the deal is now `ACTIVE`.
* Click **Add Milestone**:
  - **Title:** `Milestone 1: Infrastructure as Code & VPC Peering`
  - **Amount:** `₹10,000`
  - **Due Date:** Select an upcoming date.
* Click **Create Milestone**.
* Milestone is assigned sequence `#1` with status `PENDING`.

---

### 6. Vendor Executes & Submits Deliverable (1 Minute)
* Switch back to the Vendor portal.
* In **Milestones** (`/vendor/milestones`), view Milestone 1 and click **Start Work**.
* Status transitions to `IN_PROGRESS`.
* In **Deliverables** (`/vendor/deliverables`), select the milestone:
  - Provide Deliverable URL / File Proof: `https://github.com/finx-demo/cloud-infra`
  - Description: `Terraform IaC scripts and Helm deployment charts verified on staging`
* Click **Submit Deliverable**.
* Milestone transitions to `UNDER_REVIEW`.

---

### 7. Corporate Review & Approval (1 Minute)
* Return to Corporate session.
* View Milestone 1 details (`/corporate/milestones/{milestoneId}`).
* Review the vendor's submitted deliverable proof.
* Click **Approve Deliverable**.
* Milestone transitions to `APPROVED`. Fund release is now authorized upon payment.

---

### 8. Razorpay Test Payment & Server-Side Verification (1.5 Minutes)
* Click **Fund Milestone / Pay Now**.
* Backend initiates Razorpay order (`/api/payments/create-order`) with idempotency key.
* The Razorpay Checkout modal pops up with the exact amount (`₹10,000.00`).
* Use Razorpay Test credentials (Card / NetBanking / UPI).
* Submit test payment.
* Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
* The backend verifies the HMAC-SHA256 signature against `RAZORPAY_KEY_SECRET`.
* Upon cryptographic verification:
  - Payment record status transitions to `SUCCESS`.
  - Escrow account balance is atomically credited with `₹10,000.00`.
  - Escrow ledger logs a `FUND` transaction with exact BigDecimal precision.

---

### 9. Fiat Escrow Release & Double-Release Protection (1 Minute)
* Navigate to **Escrow** (`/corporate/escrow`).
* Show the active Escrow Account holding `₹10,000.00` with the `FUND` ledger entry.
* Click **Release Funds to Vendor**.
* Backend verifies that Milestone 1 is approved and eligible for release.
* Escrow balance decreases to `₹0.00`, and a `RELEASE` ledger entry is appended.
* Click release again to demonstrate: **Double-release is rejected with HTTP 400 Bad Request**! The exact same milestone can never be released twice.

---

### 10. Admin Dashboard & Immutable Audit Trail (1 Minute)
* Log out and log in as Platform Administrator (`admin@finx.com` / `Admin@Finx2026!`).
* Open **Admin Overview** (`/admin`):
  - View live systemic totals: Gross Project Value, Total Funds Deposited, Funds Released, and User Directory.
* Open **Projects** (`/admin/projects`):
  - Show the live directory of all deals across the platform.
* Open **Audit Logs** (`/admin/audit-logs`):
  - Show the chronological, append-only log of every single action taken during the demo:
    - `[USER_LOGIN]`
    - `[DEAL_CREATED]`
    - `[DEAL_ACCEPTED]`
    - `[MILESTONE_CREATED]`
    - `[MILESTONE_STARTED]`
    - `[DELIVERABLE_SUBMITTED]`
    - `[MILESTONE_APPROVED]`
    - `[PAYMENT_CREATED]`
    - `[PAYMENT_VERIFIED]`
    - `[ESCROW_FUNDED]`
    - `[ESCROW_RELEASED]`
  - Emphasize that no passwords, JWT tokens, or Razorpay secrets are ever logged.

---

## 🎯 Demo Summary & Value Proposition

* **Zero Mock Data:** Every single balance, deal, milestone, and ledger entry was persisted in Supabase PostgreSQL.
* **Cryptographic Security:** Razorpay HMAC-SHA256 signature verified server-side.
* **IDOR & Role Isolation:** Corporate and Vendor permissions are strictly validated in Spring Security.
* **Financial Integrity:** Zero floating-point arithmetic; strict double-entry ledgering prevents double-release.

---

## 💼 Investor & Judge Defense Q&A

### 1. Problem: How does FINX solve payment trust between businesses?
In traditional B2B service contracts, buyers fear paying upfront before seeing deliverables, while vendors fear delivering work before receiving payment. FINX solves this by introducing a milestone-based fiat escrow: the buyer deposits funds into a secure escrow account that is locked upon agreement. The vendor sees the funded milestone and executes with confidence, knowing the capital is reserved. Funds are only disbursed once the buyer inspects and approves the deliverable.

### 2. Solution: How does milestone-based escrow work?
Instead of a single lump-sum transfer, a deal is decomposed into sequential deliverables (e.g. Design -> Development -> Deployment). Each milestone is individually funded via Razorpay, held in the deal's dedicated escrow account, and unlocked sequentially. If a dispute arises on Milestone 2, Milestone 1 has already been settled, and Milestone 3 is not yet exposed.

### 3. Differentiation: Why is FINX better than paying through a normal payment gateway?
Standard payment gateways (Stripe, Razorpay, PayPal) provide binary immediate payouts: once charged, the funds belong to the seller, and buyers must resort to hostile credit card chargebacks. FINX introduces conditional programmatic custody: payments are verified and held in escrow ledgers, requiring explicit deliverable approval and dispute arbitration before any release occurs.

### 4. Security: How are funds and approvals protected?
- **Server-Side Verification:** Razorpay HMAC-SHA256 signatures are calculated server-side; client manipulation is impossible.
- **Idempotency & Double-Release Protection:** Milestones can only be released once; subsequent requests are rejected with HTTP 400.
- **IDOR Protection:** Spring Security and entity ownership validation guarantee third-party buyers or vendors cannot inspect or touch foreign deals.
- **Strict Decimal Precision:** All balances use SQL `DECIMAL(15, 2)` and Java `BigDecimal` to eliminate floating-point rounding errors.

### 5. Revenue: Where does FINX make money?
- **Transaction Fee:** 1.5% - 2.5% take-rate on successfully settled milestone escrow releases.
- **SaaS Subscriptions:** Corporate tier with advanced multi-tier approval hierarchies, enterprise ERP reconciliation, and custom legal contracts.
- **Float Interest:** Yield on aggregated treasury reserves held in compliant partner escrow accounts.

### 6. Scalability: How can the system support more businesses and transactions?
- **Stateless Architecture:** Next.js frontend and Spring Boot microservice scale horizontally behind a load balancer.
- **Distributed Caching & Queuing:** Redis handles rate-limiting, session management, and asynchronous notification events.
- **Relational Integrity:** Supabase PostgreSQL with HikariCP connection pooling maintains strict ACID guarantees for concurrent financial mutations.

