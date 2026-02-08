"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Transaction, TransactionType } from "@prisma/client";
import {
  createTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { TRANSACTION_CATEGORIES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"] as const),
  category: z.string().min(1, "Category is required"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date(),
  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSuccess?: () => void;
}

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type as TransactionType,
          category: transaction.category,
          amount: transaction.amount.toString(),
          date: transaction.date,
          description: transaction.description || "",
        }
      : {
          type: "EXPENSE",
          amount: "",
          date: new Date(),
          description: "",
        },
  });

  const selectedType = watch("type");
  const selectedCategory = watch("category");
  const selectedDate = watch("date");

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    try {
      const finalCategory =
        selectedCategory === "custom" ? customCategory : selectedCategory;

      if (!finalCategory) {
        toast.error("Please enter a category");
        setIsLoading(false);
        return;
      }

      const payload = {
        type: data.type as TransactionType,
        category: finalCategory,
        amount: parseFloat(data.amount),
        date: data.date,
        description: data.description,
      };

      if (transaction) {
        await updateTransaction(transaction.id, payload);
        toast.success("Transaction updated successfully");
      } else {
        await createTransaction(payload);
        toast.success("Transaction created successfully");
      }

      reset();
      setShowCategoryInput(false);
      setCustomCategory("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save transaction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-slate-700 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select defaultValue={selectedType} onValueChange={(value) => setValue("type", value as TransactionType)}>
              <SelectTrigger id="type" className="border-slate-600 bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-slate-600 bg-slate-800 text-white">
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-400">{errors.type.message}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {showCategoryInput ? (
              <Input
                autoFocus
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter category"
                className="border-slate-600 bg-slate-800 text-white"
                onBlur={() => {
                  if (customCategory) {
                    setValue("category", customCategory);
                    setShowCategoryInput(false);
                  }
                }}
              />
            ) : (
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCategoryInput(true);
                  } else {
                    setValue("category", value);
                  }
                }}
              >
                <SelectTrigger id="category" className="border-slate-600 bg-slate-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-600 bg-slate-800 text-white">
                  {TRANSACTION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Custom Category</SelectItem>
                </SelectContent>
              </Select>
            )}
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <Input
                {...register("amount")}
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="border-slate-600 bg-slate-800 pl-7 pr-3 text-white placeholder-slate-500"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 bg-slate-800 text-left text-white hover:bg-slate-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMM dd, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="border-slate-600 bg-slate-800 p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue("date", date)}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-xs text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              {...register("description")}
              id="description"
              placeholder="Add a note..."
              className="border-slate-600 bg-slate-800 text-white placeholder-slate-500"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading
              ? "Saving..."
              : transaction
                ? "Update Transaction"
                : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
