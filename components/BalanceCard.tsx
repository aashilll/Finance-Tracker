"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
      <p className="text-sm font-medium text-slate-400">Total Balance</p>
      <p className={`mt-2 text-4xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
        <AnimatedCounter value={balance} prefix="$" />
      </p>
    </div>
  );
}
