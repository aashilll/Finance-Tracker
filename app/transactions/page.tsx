import { TransactionsPageClient } from "@/components/TransactionsPageClient";
import { getTransactions } from "@/app/actions/transactions";

export default async function TransactionsPage() {
  // Authentication is handled by middleware
  try {
    const transactions = await getTransactions();

    return <TransactionsPageClient initialTransactions={transactions} />;
  } catch (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-400">Failed to load transactions</p>
      </div>
    );
  }
}
