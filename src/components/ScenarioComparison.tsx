import { useState } from "react";
import type { CalculatorParams } from "../types";
import { calculateProjections } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

interface ScenarioComparisonProps {
  baseParams: CalculatorParams;
}

export const ScenarioComparison = ({ baseParams }: ScenarioComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scenario2, setScenario2] = useState<CalculatorParams>({
    ...baseParams,
    annualReturn: baseParams.annualReturn + 2, // 2% higher return
  });

  const baseProjections = calculateProjections(baseParams);
  const scenario2Projections = calculateProjections(scenario2);

  const updateScenario2 = (
    key: keyof CalculatorParams,
    value: number | null
  ) => {
    setScenario2((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Compare Scenarios
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Scenario Comparison
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Scenario */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">Current Scenario</h4>
          <div className="space-y-2 text-sm">
            <div>
              Initial Capital: {formatCurrency(baseParams.initialCapital)}
            </div>
            <div>Monthly Input: {formatCurrency(baseParams.monthlyInput)}</div>
            <div>Annual Return: {baseParams.annualReturn}%</div>
            <div>Target: {formatCurrency(baseParams.targetCapital)}</div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <div className="font-medium text-blue-800">Results:</div>
            <div className="text-sm text-blue-700">
              Target reached in: {baseProjections.targetMonth || "Never"} months
            </div>
            {baseProjections.targetMonth && (
              <div className="text-sm text-blue-700">
                Final amount:{" "}
                {formatCurrency(
                  baseProjections.data[baseProjections.targetMonth - 1]
                    ?.capital || 0
                )}
              </div>
            )}
          </div>
        </div>

        {/* Alternative Scenario */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">
            Alternative Scenario
          </h4>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="scenario2-initial"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Initial Capital ($)
              </label>
              <input
                id="scenario2-initial"
                type="number"
                value={scenario2.initialCapital}
                onChange={(e) =>
                  updateScenario2(
                    "initialCapital",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="scenario2-monthly"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Monthly Input ($)
              </label>
              <input
                id="scenario2-monthly"
                type="number"
                value={scenario2.monthlyInput}
                onChange={(e) =>
                  updateScenario2(
                    "monthlyInput",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label
                htmlFor="scenario2-return"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Annual Return (%)
              </label>
              <input
                id="scenario2-return"
                type="number"
                step="0.1"
                value={scenario2.annualReturn}
                onChange={(e) =>
                  updateScenario2(
                    "annualReturn",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded">
            <div className="font-medium text-green-800">Results:</div>
            <div className="text-sm text-green-700">
              Target reached in: {scenario2Projections.targetMonth || "Never"}{" "}
              months
            </div>
            {scenario2Projections.targetMonth && (
              <div className="text-sm text-green-700">
                Final amount:{" "}
                {formatCurrency(
                  scenario2Projections.data[
                    scenario2Projections.targetMonth - 1
                  ]?.capital || 0
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      {baseProjections.targetMonth && scenario2Projections.targetMonth && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">Comparison Summary</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Time Difference:</span>
              <div className="font-medium">
                {Math.abs(
                  baseProjections.targetMonth - scenario2Projections.targetMonth
                )}{" "}
                months
                {scenario2Projections.targetMonth < baseProjections.targetMonth
                  ? " faster"
                  : " slower"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Better Scenario:</span>
              <div className="font-medium">
                {scenario2Projections.targetMonth < baseProjections.targetMonth
                  ? "Alternative"
                  : "Current"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Improvement:</span>
              <div className="font-medium">
                {(
                  (Math.abs(
                    baseProjections.targetMonth -
                      scenario2Projections.targetMonth
                  ) /
                    baseProjections.targetMonth) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
