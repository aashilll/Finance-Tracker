"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction, TransactionType } from "@prisma/client";
import { toast } from "sonner";
import { deleteTransaction } from "@/app/actions/transactions";
import { currencyFormat } from "@/lib/utils";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";
import { TRANSACTION_CATEGORIES } from "@/lib/utils";

// Serialized transaction type with number instead of Decimal
type SerializedTransaction = Omit<Transaction, 'amount'> & { amount: number };

interface TransactionTableProps {
  transactions: SerializedTransaction[];
  onEdit: (transaction: SerializedTransaction) => void;
}

export function TransactionTable({
  transactions,
  onEdit,
}: TransactionTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | TransactionType>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const categories = Array.from(new Set(transactions.map((tx) => tx.category)));

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || tx.type === filterType;
    const matchesCategory =
      filterCategory === "ALL" || tx.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      router.refresh(); // Refresh to show updated list
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:flex-row">
        <Input
          placeholder="Search by description or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-slate-600 bg-slate-900 text-white placeholder-slate-500"
        />
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-full border-slate-600 bg-slate-900 text-white sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-slate-600 bg-slate-800 text-white">
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full border-slate-600 bg-slate-900 text-white sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-slate-600 bg-slate-800 text-white">
            <SelectItem value="ALL">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-700 hover:bg-slate-800/50">
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Category</TableHead>
              <TableHead className="text-slate-300">Description</TableHead>
              <TableHead className="text-right text-slate-300">Amount</TableHead>
              <TableHead className="text-right text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableCell colSpan={5} className="py-8 text-center text-slate-400">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx) => (
                <TableRow 
                  key={tx.id} 
                  className="border-slate-700 hover:bg-slate-800/70 transition-colors duration-150 cursor-pointer"
                >
                  <TableCell className="text-slate-300">
                    {format(tx.date, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-slate-300">{tx.category}</TableCell>
                  <TableCell className="max-w-xs truncate text-slate-400">
                    {tx.description || "-"}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === "INCOME" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {currencyFormat(tx.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(tx)}
                        className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors duration-150"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(tx.id)}
                        disabled={isDeleting === tx.id}
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400">
        Showing {filtered.length} of {transactions.length} transactions
      </p>
    </div>
  );
}
