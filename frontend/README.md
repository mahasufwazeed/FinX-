# FINX Frontend - Tuesday Foundation

FINX is a B2B milestone-based fiat escrow platform connecting Buyers, Sellers, and Admins.

## Stack
- Next.js 15+ (App Router)
- React 19
- Tailwind CSS v4
- React Hook Form + Zod
- Axios
- Lucide React

## Project Structure
- `/app`: Next.js App Router dynamic & static pages.
- `/components/auth`: Authentication logic (Providers).
- `/components/ui`: Common generic UI components like Buttons and Inputs.
- `/components/layout`: Primary structural layouts (Dashboard, Sidebar).
- `/hooks`: React hooks.
- `/lib`: Axios setup & utility scripts.
- `/services`: Interface with REST APIs.
- `/types`: Domain contracts and shared typing.

## Getting Started

1. Ensure Node.js 18+ is installed.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy local environment variables:
   Ensure `.env.local` is present with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Remaining work for Wednesday
- Integrate real backend functionality (Razorpay processing, escrow transaction workflows).
- Build the concrete UI tools for Deal setup, Milestone tracking, and Payment status dashboards.
- Finalize error boundary integrations.

## Features Implemented
- Strict Role-Based Routing (Buyer, Seller, Admin)
- Full App Foundation & Directory Layout
- Responsive Modern Auth UI and State Handlers
- Modern Dashboard interfaces per role (B2B SaaS Theme)
- Axios token automatic refresh system configuration
