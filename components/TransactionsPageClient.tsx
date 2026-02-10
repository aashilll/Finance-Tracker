"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@prisma/client";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Serialized transaction type with number instead of Decimal
type SerializedTransaction = Omit<Transaction, 'amount'> & { amount: number };

interface TransactionsPageClientProps {
  initialTransactions: SerializedTransaction[];
}

export function TransactionsPageClient({
  initialTransactions,
}: TransactionsPageClientProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<SerializedTransaction | null>(null);

  const handleEdit = (tx: SerializedTransaction) => {
    setSelectedTransaction(tx);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedTransaction(null);
    }
  };

  const handleSuccess = () => {
    // Refresh the page data to show new/updated transaction
    router.refresh();
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="mt-1 text-slate-400">
              Manage all your income and expenses
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedTransaction(null);
            setIsFormOpen(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <TransactionTable transactions={transactions} onEdit={handleEdit} />

      <TransactionForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        transaction={selectedTransaction}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
