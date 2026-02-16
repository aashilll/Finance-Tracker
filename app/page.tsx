import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Lock } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  
  // If user is already signed in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-950/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">💰</span>
            <span>ExpenseTracker</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-slate-700"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                  Take Control of Your{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Finances
                  </span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                  Track your income and expenses effortlessly. Visualize your spending patterns with beautiful charts and gain insights into your financial habits.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                  asChild
                >
                  <Link href="/sign-up">
                    Start Free Today <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-600 text-white hover:bg-slate-700"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Right Side - Features Preview */}
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 space-y-4 group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Track Everything</h3>
                </div>
                <p className="text-slate-400">Log income and expenses with categories, dates, and descriptions.</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 space-y-4 group hover:border-cyan-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <BarChart3 className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Visualize Spending</h3>
                </div>
                <p className="text-slate-400">Beautiful charts show your spending breakdown and monthly trends.</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 space-y-4 group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Lock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Secure & Private</h3>
                </div>
                <p className="text-slate-400">Your data is encrypted and belongs only to you. No ads.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-2xl">💰</span>
              <span>ExpenseTracker</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 ExpenseTracker. Built with Next.js, Prisma & Clerk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
