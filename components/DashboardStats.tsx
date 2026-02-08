"use client";

import { AnimatedCounter } from "@/components/AnimatedCounter";

interface DashboardStatsProps {
  balance: number;
  income: number;
  expense: number;
}

export function DashboardStats({
  balance,
  income,
  expense,
}: DashboardStatsProps) {
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Balance"
        value={balance}
        color="text-blue-400"
        prefix="$"
      />
      <StatCard
        label="Total Income"
        value={income}
        color="text-emerald-400"
        prefix="$"
      />
      <StatCard
        label="Total Expenses"
        value={expense}
        color="text-red-400"
        prefix="$"
      />
      <StatCard
        label="Savings Rate"
        value={savingsRate}
        color="text-purple-400"
        suffix="%"
        decimals={1}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function StatCard({ label, value, color, prefix, suffix, decimals = 2 }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </p>
    </div>
  );
}
