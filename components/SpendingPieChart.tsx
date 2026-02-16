"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpendingPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

export function SpendingPieChart({ data }: SpendingPieChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50">
        <p className="text-slate-400">No expense data available</p>
      </div>
    );
  }

  // Custom label renderer - hide on mobile, show short version on desktop
  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    if (isMobile) return null; // Hide labels on mobile
    const percentage = (percent * 100).toFixed(0);
    // Truncate long category names
    const shortName = name.length > 10 ? name.substring(0, 8) + "..." : name;
    return `${shortName} ${percentage}%`;
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
      <h3 className="mb-4 text-base sm:text-lg font-semibold text-white">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={!isMobile}
            label={renderLabel}
            outerRadius={isMobile ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend for mobile */}
      {isMobile && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-slate-300 truncate">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
