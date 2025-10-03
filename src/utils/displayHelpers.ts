import { type ProjectionRow, type RequiredReturnDisplay } from "../types";

export const getRequiredReturnDisplay = (
  row: ProjectionRow,
  isTargetReached: boolean
): RequiredReturnDisplay => {
  const requiredAnnualReturn =
    ((1 + row.requiredMonthlyReturn) ** 12 - 1) * 100;

  if (row.remainingMonths <= 0 || isTargetReached) {
    return {
      text: isTargetReached ? "Target reached!" : "-",
      className: isTargetReached ? "text-green-600" : "text-gray-500",
    };
  }

  if (requiredAnnualReturn > 300) {
    return { text: "Impossible", className: "text-red-600" };
  }

  if (requiredAnnualReturn < 0) {
    return { text: "No return needed", className: "text-green-600" };
  }

  let className: string;
  if (requiredAnnualReturn > 20) {
    className = "text-red-600";
  } else if (requiredAnnualReturn > 10) {
    className = "text-orange-600";
  } else {
    className = "text-blue-600";
  }

  return {
    text: (row.requiredMonthlyReturn * 100).toFixed(3) + "%",
    className,
  };
};
