import { useState, useMemo } from "react";
import type { CalculatorParams, ProjectionResult } from "../types";
import { formatCurrency } from "../utils/formatters";

interface InflationAdjustmentProps {
  params: CalculatorParams;
  projections: ProjectionResult;
}

export const InflationAdjustment = ({
  params,
  projections,
}: InflationAdjustmentProps) => {
  const [inflationRate, setInflationRate] = useState(3); // Default 3% inflation
  const [isExpanded, setIsExpanded] = useState(false);

  const inflationAdjustedData = useMemo(() => {
    const finalProjection = projections.data[projections.data.length - 1];
    if (!finalProjection) return null;

    const years = finalProjection.month / 12;
    const inflationMultiplier = Math.pow(1 + inflationRate / 100, years);

    return {
      nominalValue: finalProjection.capital,
      realValue: finalProjection.capital / inflationMultiplier,
      purchasingPowerLoss:
        finalProjection.capital - finalProjection.capital / inflationMultiplier,
      targetRealValue: params.targetCapital / inflationMultiplier,
      inflationMultiplier,
      years,
    };
  }, [projections, params.targetCapital, inflationRate]);

  if (!inflationAdjustedData) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Inflation Impact Analysis
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="inflationRate"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Expected Annual Inflation Rate (%)
        </label>
        <input
          id="inflationRate"
          type="number"
          step="0.1"
          value={inflationRate}
          onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Nominal Value</h4>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(inflationAdjustedData.nominalValue)}
          </div>
          <div className="text-sm text-green-700">Future dollar amount</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">
            Real Value (Today's Purchasing Power)
          </h4>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(inflationAdjustedData.realValue)}
          </div>
          <div className="text-sm text-orange-700">
            Adjusted for {inflationRate}% inflation
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">
                Purchasing Power Loss
              </h4>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(inflationAdjustedData.purchasingPowerLoss)}
              </div>
              <div className="text-sm text-red-700">
                Due to {inflationRate}% inflation over{" "}
                {inflationAdjustedData.years.toFixed(1)} years
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">
                Target Real Value
              </h4>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(inflationAdjustedData.targetRealValue)}
              </div>
              <div className="text-sm text-blue-700">
                Your target in today's money
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">
                Inflation Multiplier
              </h4>
              <div className="text-xl font-bold text-purple-600">
                {inflationAdjustedData.inflationMultiplier.toFixed(2)}x
              </div>
              <div className="text-sm text-purple-700">
                Price increase factor
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              💡 What This Means
            </h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>
                • Your {formatCurrency(inflationAdjustedData.nominalValue)} will
                have the purchasing power of{" "}
                {formatCurrency(inflationAdjustedData.realValue)} in today's
                money
              </p>
              <p>
                • You'll lose{" "}
                {formatCurrency(inflationAdjustedData.purchasingPowerLoss)} in
                purchasing power due to inflation
              </p>
              <p>
                • Consider increasing your target or return rate to maintain
                purchasing power
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
