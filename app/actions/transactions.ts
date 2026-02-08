"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { TransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function createTransaction(
  data: {
    amount: number;
    type: TransactionType;
    category: string;
    date: Date;
    description?: string;
  }
) {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Ensure user exists in database
    await db.user.upsert({
      where: { clerkId: session.userId },
      update: {},
      create: {
        clerkId: session.userId,
        email: session.sessionClaims?.email as string || `user-${session.userId}@clerk.local`,
        name: session.sessionClaims?.name as string || null,
      },
    });

    const transaction = await db.transaction.create({
      data: {
        amount: new Decimal(Math.abs(data.amount)),
        type: data.type,
        category: data.category,
        date: data.date,
        description: data.description || null,
        userId: session.userId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { 
      success: true, 
      data: {
        ...transaction,
        amount: parseFloat(transaction.amount.toString()),
      }
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

export async function updateTransaction(
  id: string,
  data: {
    amount: number;
    type: TransactionType;
    category: string;
    date: Date;
    description?: string;
  }
) {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transaction = await db.transaction.update({
      where: { id },
      data: {
        amount: new Decimal(Math.abs(data.amount)),
        type: data.type,
        category: data.category,
        date: data.date,
        description: data.description || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { 
      success: true, 
      data: {
        ...transaction,
        amount: parseFloat(transaction.amount.toString()),
      }
    };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.transaction.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw new Error("Failed to delete transaction");
  }
}

export async function getBalance() {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId: session.userId },
      select: { amount: true, type: true },
    });

    let balance = new Decimal(0);
    for (const tx of transactions) {
      if (tx.type === "INCOME") {
        balance = balance.plus(tx.amount);
      } else {
        balance = balance.minus(tx.amount);
      }
    }

    return balance.toNumber();
  } catch (error) {
    console.error("Error getting balance:", error);
    throw new Error("Failed to get balance");
  }
}

export async function getIncomeAndExpense() {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId: session.userId },
      select: { amount: true, type: true },
    });

    let income = new Decimal(0);
    let expense = new Decimal(0);

    for (const tx of transactions) {
      if (tx.type === "INCOME") {
        income = income.plus(tx.amount);
      } else {
        expense = expense.plus(tx.amount);
      }
    }

    return { income: income.toNumber(), expense: expense.toNumber() };
  } catch (error) {
    console.error("Error getting income and expense:", error);
    throw new Error("Failed to get income and expense");
  }
}

export async function getTransactions(
  filters?: {
    category?: string;
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId: session.userId,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.startDate && {
          date: { gte: filters.startDate },
        }),
        ...(filters?.endDate && {
          date: { lte: filters.endDate },
        }),
      },
      orderBy: { date: "desc" },
    });

    // Convert Decimal to number for serialization
    return transactions.map(tx => ({
      ...tx,
      amount: parseFloat(tx.amount.toString()),
    }));
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw new Error("Failed to get transactions");
  }
}

export async function getMonthlyTrend() {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: { userId: session.userId },
      select: { amount: true, type: true, date: true },
    });

    // Group by month
    const monthlyData: Record<
      string,
      { income: Decimal; expense: Decimal }
    > = {};

    for (const tx of transactions) {
      const monthKey = tx.date.toISOString().slice(0, 7); // YYYY-MM

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: new Decimal(0), expense: new Decimal(0) };
      }

      if (tx.type === "INCOME") {
        monthlyData[monthKey].income = monthlyData[monthKey].income.plus(
          tx.amount
        );
      } else {
        monthlyData[monthKey].expense = monthlyData[monthKey].expense.plus(
          tx.amount
        );
      }
    }

    // Convert to array format for charts
    const result = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { income, expense }]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        income: parseFloat(income.toString()),
        expense: parseFloat(expense.toString()),
        net: income.minus(expense).toNumber(),
      }));

    return result;
  } catch (error) {
    console.error("Error getting monthly trend:", error);
    throw new Error("Failed to get monthly trend");
  }
}

export async function getCategoryBreakdown() {
  const session = await auth();
  
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId: session.userId,
        type: "EXPENSE",
      },
      select: { amount: true, category: true },
    });

    const categoryData: Record<string, Decimal> = {};

    for (const tx of transactions) {
      if (!categoryData[tx.category]) {
        categoryData[tx.category] = new Decimal(0);
      }
      categoryData[tx.category] = categoryData[tx.category].plus(tx.amount);
    }

    const result = Object.entries(categoryData)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toString()),
      }))
      .sort((a, b) => b.value - a.value);

    return result;
  } catch (error) {
    console.error("Error getting category breakdown:", error);
    throw new Error("Failed to get category breakdown");
  }
}
