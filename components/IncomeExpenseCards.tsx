"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";
import { TrendingDown, TrendingUp } from "lucide-react";

interface IncomeExpenseCardsProps {
  income: number;
  expense: number;
}

export function IncomeExpenseCards({
  income,
  expense,
}: IncomeExpenseCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-emerald-900/20 to-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Income</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              <AnimatedCounter value={income} prefix="$" />
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-emerald-400 opacity-20" />
        </div>
      </div>
      <div className="rounded-lg border border-slate-700 bg-gradient-to-br from-red-900/20 to-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Expenses</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              <AnimatedCounter value={expense} prefix="$" />
            </p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-400 opacity-20" />
        </div>
      </div>
    </div>
  );
}
