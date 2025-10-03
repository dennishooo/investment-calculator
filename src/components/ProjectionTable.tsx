import type { CalculatorParams, ProjectionResult } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";
import { getRequiredReturnDisplay } from "../utils/displayHelpers";

interface ProjectionTableProps {
  params: CalculatorParams;
  projections: ProjectionResult;
}

export const ProjectionTable = ({
  params,
  projections,
}: ProjectionTableProps) => {
  // Helper function to determine milestones
  const getMilestone = (row: ProjectionResult["data"][0], index: number) => {
    const isYearMilestone = row.month % 12 === 0;
    const isTargetReached = row.capital >= params.targetCapital;
    const isFirstTargetReach =
      isTargetReached &&
      (index === 0 ||
        projections.data[index - 1]?.capital < params.targetCapital);
    const isHalfwayToTarget =
      row.capital >= params.targetCapital * 0.5 &&
      (index === 0 ||
        projections.data[index - 1]?.capital < params.targetCapital * 0.5);
    const isQuarterToTarget =
      row.capital >= params.targetCapital * 0.25 &&
      (index === 0 ||
        projections.data[index - 1]?.capital < params.targetCapital * 0.25);
    const isDoubleInitial =
      row.capital >= params.initialCapital * 2 &&
      (index === 0 ||
        projections.data[index - 1]?.capital < params.initialCapital * 2);
    const isBreakeven =
      row.gains >= 0 && (index === 0 || projections.data[index - 1]?.gains < 0);

    if (isFirstTargetReach)
      return {
        icon: "🎯",
        label: "Target Reached!",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (isHalfwayToTarget)
      return {
        icon: "🏃",
        label: "Halfway There!",
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    if (isQuarterToTarget)
      return {
        icon: "🚀",
        label: "25% Complete",
        color: "text-purple-600",
        bg: "bg-purple-100",
      };
    if (isDoubleInitial)
      return {
        icon: "💰",
        label: "Doubled Initial!",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    if (isBreakeven)
      return {
        icon: "📈",
        label: "Breakeven!",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
      };
    if (isYearMilestone)
      return {
        icon: "📅",
        label: `Year ${row.month / 12}`,
        color: "text-gray-600",
        bg: "bg-gray-100",
      };

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Monthly Projections
        </h3>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span>🎯</span>
            <span className="text-gray-600">Target</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🏃</span>
            <span className="text-gray-600">50%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🚀</span>
            <span className="text-gray-600">25%</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💰</span>
            <span className="text-gray-600">2x Initial</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📈</span>
            <span className="text-gray-600">Breakeven</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span className="text-gray-600">Year</span>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Capital
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contributions
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Return
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment Gains
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Required Monthly Return
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress to Target
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projections.data.map((row, index) => {
              const progressPercentage =
                (row.capital / params.targetCapital) * 100;
              const isTargetReached = row.capital >= params.targetCapital;
              const requiredReturn = getRequiredReturnDisplay(
                row,
                isTargetReached
              );
              const milestone = getMilestone(row, index);

              return (
                <tr
                  key={row.month}
                  className={
                    milestone
                      ? `${milestone.bg} border-l-4 border-l-blue-400`
                      : isTargetReached
                      ? "bg-green-50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{row.month}</span>
                      {milestone && (
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{milestone.icon}</span>
                          <span
                            className={`text-xs font-medium ${milestone.color}`}
                          >
                            {milestone.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(row.futureDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(row.capital)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(row.totalContributions)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm text-right ${
                      row.monthlyReturn >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(row.monthlyReturn)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm text-right ${
                      row.gains >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(row.gains)}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${requiredReturn.className}`}
                  >
                    {requiredReturn.text}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs">
                        {progressPercentage.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2.5 relative">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            progressPercentage >= 100
                              ? "bg-green-500"
                              : progressPercentage >= 75
                              ? "bg-blue-500"
                              : progressPercentage >= 50
                              ? "bg-yellow-500"
                              : progressPercentage >= 25
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(progressPercentage, 100)}%`,
                          }}
                        />
                        {/* Progress milestones markers */}
                        <div className="absolute top-0 left-1/4 w-0.5 h-2.5 bg-white opacity-50"></div>
                        <div className="absolute top-0 left-1/2 w-0.5 h-2.5 bg-white opacity-50"></div>
                        <div className="absolute top-0 left-3/4 w-0.5 h-2.5 bg-white opacity-50"></div>
                      </div>
                      {progressPercentage >= 100 && (
                        <span className="text-green-600 text-lg">✓</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Milestone Summary */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {projections.data.filter((row) => row.month % 12 === 0).length}
            </div>
            <div className="text-xs text-gray-600">Year Milestones</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {projections.targetMonth || "N/A"}
            </div>
            <div className="text-xs text-gray-600">Months to Target</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {projections.data.find(
                (row) => row.capital >= params.targetCapital * 0.5
              )?.month || "N/A"}
            </div>
            <div className="text-xs text-gray-600">Halfway Point</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {Math.max(
                ...projections.data.map(
                  (row) => (row.capital / params.targetCapital) * 100
                )
              ).toFixed(0)}
              %
            </div>
            <div className="text-xs text-gray-600">Max Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};
