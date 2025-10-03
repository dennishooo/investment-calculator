import type { CalculatorParams, ProjectionResult } from "../types";
import { formatCurrency } from "../utils/formatters";

interface GoalProgressProps {
  params: CalculatorParams;
  projections: ProjectionResult;
}

export const GoalProgress = ({ params, projections }: GoalProgressProps) => {
  // Find the final projection
  const finalProjection = projections.data[projections.data.length - 1];

  const progressPercentage = Math.min(
    (params.initialCapital / params.targetCapital) * 100,
    100
  );

  const monthsToTarget = projections.targetMonth;
  const yearsToTarget = monthsToTarget ? Math.floor(monthsToTarget / 12) : 0;
  const remainingMonths = monthsToTarget ? monthsToTarget % 12 : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Goal Progress Dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Status */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">Current Status</h4>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {formatCurrency(params.initialCapital)}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            {progressPercentage.toFixed(1)}% of target
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Projected Timeline */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">Time to Goal</h4>
          {monthsToTarget ? (
            <>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {yearsToTarget}y {remainingMonths}m
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {monthsToTarget} months total
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                On track to reach goal
              </div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-red-600 mb-1">∞</div>
              <div className="text-sm text-gray-500 mb-3">
                Goal not reachable
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Adjust parameters
              </div>
            </>
          )}
        </div>

        {/* Final Amount */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-700 mb-2">
            Projected Final Amount
          </h4>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {formatCurrency(finalProjection?.capital || 0)}
          </div>
          <div className="text-sm text-gray-500 mb-3">
            {finalProjection
              ? `${(
                  (finalProjection.capital / params.targetCapital) *
                  100
                ).toFixed(1)}% of target`
              : "No projection available"}
          </div>
          {finalProjection &&
            finalProjection.capital >= params.targetCapital && (
              <div className="flex items-center text-xs text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Target exceeded!
              </div>
            )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-semibold text-gray-800">
            {formatCurrency(params.monthlyInput)}
          </div>
          <div className="text-xs text-gray-500">Monthly Investment</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-semibold text-gray-800">
            {params.annualReturn}%
          </div>
          <div className="text-xs text-gray-500">Expected Return</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-semibold text-gray-800">
            {formatCurrency((monthsToTarget || 0) * params.monthlyInput)}
          </div>
          <div className="text-xs text-gray-500">Total Contributions</div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-lg font-semibold text-gray-800">
            {finalProjection
              ? formatCurrency(finalProjection.gains)
              : formatCurrency(0)}
          </div>
          <div className="text-xs text-gray-500">Investment Gains</div>
        </div>
      </div>
    </div>
  );
};
