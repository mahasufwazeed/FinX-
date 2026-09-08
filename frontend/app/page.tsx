import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ArrowRight, Briefcase, Zap, Building2, UserCircle, CheckSquare, LockKeyhole, FileSpreadsheet } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col scroll-smooth">
      <header className="h-20 flex items-center justify-between px-6 lg:px-12 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">FINX</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <a href="#details">
            <Button>Get Started</Button>
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <div className="w-full flex-col items-center justify-center px-6 text-center py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
              <Zap size={16} />
              <span>The secure standard for B2B transactions</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight text-balance">
              Milestone-based
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> fiat escrow </span>
              for modern business
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-balance">
              Connect buyers and sellers with confidence. Fund milestones securely and release payment only when work is approved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a href="#details" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-lg px-8 gap-2">
                  See Entire Detail <ArrowRight size={20} />
                </Button>
              </a>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-lg px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div id="details" className="w-full py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How FINX Secures Your Business</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Discover the end-to-end milestone lifecycle. Every role interacts directly to ensure perfect security and transparency.
              </p>
            </div>

            {/* Step by step flow */}
            <div className="relative">
              {/* Vertical line connecting steps */}
              <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 -translate-x-1/2"></div>

              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start group">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">1. Corporate Originates Project</h3>
                    <p className="text-slate-600">The Corporate business establishes a contract detailing specific milestones, deadlines, and the overall fiat payment value. They deposit the initial funds securely.</p>
                  </div>
                  <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center z-10">
                    <Building2 size={20} className="text-blue-600" />
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold uppercase text-blue-600 block mb-2">Role Involved</span>
                      <p className="font-semibold text-slate-800">CORPORATE</p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start group">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 order-2 md:order-1">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold uppercase text-indigo-600 block mb-2">Role Involved</span>
                      <p className="font-semibold text-slate-800">VENDOR</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center z-10 order-1 md:order-2">
                    <UserCircle size={20} className="text-indigo-600" />
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-3">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">2. Vendor Starts Work</h3>
                    <p className="text-slate-600">The Vendor or Service Provider accepts the timeline. Seeing the funds safely locked in escrow, they complete the deliverables and upload proof of work.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start group">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">3. Project Manager Reviews</h3>
                    <p className="text-slate-600">A neutral assigned Project Manager audits the deliverables against the milestones. They flag revisions or cast their formal operational approval.</p>
                  </div>
                  <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center z-10">
                    <CheckSquare size={20} className="text-emerald-600" />
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold uppercase text-emerald-600 block mb-2">Role Involved</span>
                      <p className="font-semibold text-slate-800">PROJECT MANAGER</p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start group">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0 order-2 md:order-1">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold uppercase text-amber-600 block mb-2">Role Involved</span>
                      <p className="font-semibold text-slate-800">FINX ADMIN</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center z-10 order-1 md:order-2">
                    <LockKeyhole size={20} className="text-amber-600" />
                  </div>
                  <div className="md:w-1/2 md:pl-12 order-3">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">4. Admin Triggers Escrow</h3>
                    <p className="text-slate-600">Once approvals consolidate, FINX Admins oversee the cryptographic payload release logic resolving any ultimate disputes, routing the fiat safely.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start group">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">5. Finance Reconciliation</h3>
                    <p className="text-slate-600">The Finance Team automatically receives generated invoices and full transaction payloads closing the ledger loop for the Corporate buyer.</p>
                  </div>
                  <div className="absolute left-1/2 top-0 h-10 w-10 -translate-x-1/2 rounded-full bg-purple-100 border-4 border-white flex items-center justify-center z-10">
                    <FileSpreadsheet size={20} className="text-purple-600" />
                  </div>
                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold uppercase text-purple-600 block mb-2">Role Involved</span>
                      <p className="font-semibold text-slate-800">FINANCE</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-20 text-center">
              <Link href="/register">
                <Button size="lg" className="px-10 text-lg shadow-lg">Start Using FINX Today</Button>
              </Link>
            </div>

          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        <p>&copy; {new Date().getFullYear()} FINX Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
