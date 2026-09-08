import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ArrowRight, Briefcase, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-20 flex items-center justify-between px-6 lg:px-12 bg-white border-b border-slate-200">
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
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
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
            <Link href="/register">
              <Button size="lg" className="gap-2 w-full sm:w-auto text-lg px-8">
                Start Transacting <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left">
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Define Deals</h3>
            <p className="text-slate-600">Create structured agreements with clear milestones and deliverables agreed upon by both parties.</p>
          </div>
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Secure Funds</h3>
            <p className="text-slate-600">Buyers deposit funds into a secure escrow account to guarantee payment for sellers before work begins.</p>
          </div>
          <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Release on Approval</h3>
            <p className="text-slate-600">Funds are released automatically upon milestone approval, eliminating payment delays and disputes.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 mt-12 bg-white">
        <p>&copy; {new Date().getFullYear()} FINX Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
