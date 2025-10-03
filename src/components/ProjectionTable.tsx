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
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
            {projections.data.map((row) => {
              const progressPercentage =
                (row.capital / params.targetCapital) * 100;
              const isTargetReached = row.capital >= params.targetCapital;
              const requiredReturn = getRequiredReturnDisplay(
                row,
                isTargetReached
              );

              return (
                <tr
                  key={row.month}
                  className={
                    isTargetReached ? "bg-green-50" : "hover:bg-gray-50"
                  }
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.month}
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
                    <div className="flex items-center justify-end">
                      <span className="mr-2">
                        {progressPercentage.toFixed(1)}%
                      </span>
                      <div className="w-12 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isTargetReached ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min(progressPercentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
