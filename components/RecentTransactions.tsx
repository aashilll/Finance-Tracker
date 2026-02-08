import { currencyFormat } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import { format } from "date-fns";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h3>
      {recentTx.length === 0 ? (
        <p className="text-slate-400">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {recentTx.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-3"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{tx.category}</p>
                <p className="text-xs text-slate-400">
                  {format(tx.date, "MMM dd, yyyy")}
                </p>
              </div>
              <div
                className={`text-right font-semibold ${
                  tx.type === "INCOME" ? "text-green-400" : "text-red-400"
                }`}
              >
                {tx.type === "INCOME" ? "+" : "-"}
                {currencyFormat(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
