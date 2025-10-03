import { type CalculatorParams, type ProjectionResult } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface TargetSummaryProps {
  params: CalculatorParams;
  projections: ProjectionResult;
}

const getFutureDate = (monthsFromNow: number): Date => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setMonth(futureDate.getMonth() + monthsFromNow);
  return futureDate;
};

export const TargetSummary = ({ params, projections }: TargetSummaryProps) => {
  const { targetCapital, targetTimeFrame } = params;
  const { targetMonth } = projections;

  if (!targetMonth) return null;

  const years = Math.floor(targetMonth / 12);
  const monthsRemaining = targetMonth % 12;
  const targetDate = getFutureDate(targetMonth);

  if (targetTimeFrame && targetTimeFrame > 0) {
    if (targetMonth <= targetTimeFrame) {
      const monthsAhead = targetTimeFrame - targetMonth;
      return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            Target Achievement
          </h2>
          <p className="text-green-700">
            You will reach your target of {formatCurrency(targetCapital)} in{" "}
            {targetMonth} months ({years} years and {monthsRemaining} months) by{" "}
            {formatDate(targetDate)}
            {monthsAhead > 0
              ? ` - ${monthsAhead} months ahead of schedule!`
              : ""}
          </p>
        </div>
      );
    } else {
      return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            Target Achievement
          </h2>
          <p className="text-green-700">
            With current parameters, you will reach your target by{" "}
            {formatDate(targetDate)}, which is {targetMonth - targetTimeFrame}{" "}
            months later than your target of {targetTimeFrame} months.
          </p>
        </div>
      );
    }
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h2 className="text-lg font-semibold text-green-800 mb-2">
        Target Achievement
      </h2>
      <p className="text-green-700">
        You will reach your target of {formatCurrency(targetCapital)} in{" "}
        {targetMonth} months ({years} years and {monthsRemaining} months) by{" "}
        {formatDate(targetDate)}
      </p>
    </div>
  );
};
