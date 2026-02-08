import { DashboardStats } from "@/components/DashboardStats";
import { BalanceCard } from "@/components/BalanceCard";
import { IncomeExpenseCards } from "@/components/IncomeExpenseCards";
import { SpendingPieChart } from "@/components/SpendingPieChart";
import { MonthlyTrendChart } from "@/components/MonthlyTrendChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import {
  getBalance,
  getIncomeAndExpense,
  getTransactions,
  getCategoryBreakdown,
  getMonthlyTrend,
} from "@/app/actions/transactions";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  // Authentication is handled by middleware
  try {
    const balance = await getBalance();
    const { income, expense } = await getIncomeAndExpense();
    const transactions = await getTransactions();
    const categoryBreakdown = await getCategoryBreakdown();
    const monthlyTrend = await getMonthlyTrend();

    return (
      <div className="space-y-6">
        {/* Stat Cards */}
        <DashboardStats balance={balance} income={income} expense={expense} />

        {/* Balance & Income/Expense Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <BalanceCard balance={balance} />
          <div className="lg:col-span-2">
            <IncomeExpenseCards income={income} expense={expense} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingPieChart data={categoryBreakdown} />
          <MonthlyTrendChart data={monthlyTrend} />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />

        {/* FAB - Add Transaction */}
        <Link
          href="/transactions"
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
          aria-label="Add new transaction"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-400">Failed to load dashboard</p>
      </div>
    );
  }
}
