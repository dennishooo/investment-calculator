import type { ProjectionResult, CalculatorParams } from "../types";
import { formatDate } from "./formatters";

export const exportToCSV = (
  projections: ProjectionResult,
  params: CalculatorParams
) => {
  const headers = [
    "Month",
    "Date",
    "Total Capital",
    "Total Contributions",
    "Monthly Return",
    "Investment Gains",
    "Required Monthly Return (%)",
    "Progress to Target (%)",
    "Remaining Months",
  ];

  const rows = projections.data.map((row) => [
    row.month.toString(),
    formatDate(row.futureDate),
    row.capital.toFixed(2),
    row.totalContributions.toFixed(2),
    row.monthlyReturn.toFixed(2),
    row.gains.toFixed(2),
    (row.requiredMonthlyReturn * 100).toFixed(3),
    ((row.capital / params.targetCapital) * 100).toFixed(1),
    row.remainingMonths.toString(),
  ]);

  const csvContent = [
    `Investment Calculator Export - ${new Date().toLocaleDateString()}`,
    `Initial Capital: ${params.initialCapital}`,
    `Monthly Input: ${params.monthlyInput}`,
    `Annual Return: ${params.annualReturn}%`,
    `Target Capital: ${params.targetCapital}`,
    `Target Timeframe: ${params.targetTimeFrame || "Auto-calculated"} months`,
    "", // Empty line
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `investment-projection-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
