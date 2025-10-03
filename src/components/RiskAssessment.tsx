import { useMemo } from "react";
import type { CalculatorParams, ProjectionResult } from "../types";

interface RiskAssessmentProps {
  params: CalculatorParams;
  projections: ProjectionResult;
}

export const RiskAssessment = ({
  params,
  projections,
}: RiskAssessmentProps) => {
  const assessment = useMemo(() => {
    const {
      annualReturn,
      targetTimeFrame,
      initialCapital,
      monthlyInput,
      targetCapital,
    } = params;
    const finalProjection = projections.data[projections.data.length - 1];

    // Risk factors
    const isHighReturn = annualReturn > 8;
    const isShortTimeframe = (targetTimeFrame || 0) < 60; // Less than 5 years
    const isHighTarget =
      targetCapital >
      (initialCapital + monthlyInput * (targetTimeFrame || 0)) * 2;
    const dependsHeavilyOnGains = finalProjection
      ? finalProjection.gains / finalProjection.capital > 0.5
      : false;

    // Calculate risk score (0-100)
    let riskScore = 0;
    if (isHighReturn) riskScore += 30;
    if (isShortTimeframe) riskScore += 25;
    if (isHighTarget) riskScore += 25;
    if (dependsHeavilyOnGains) riskScore += 20;

    // Risk level
    let riskLevel: "Low" | "Medium" | "High" | "Very High";
    let riskColor: string;
    let riskBgColor: string;

    if (riskScore <= 25) {
      riskLevel = "Low";
      riskColor = "text-green-600";
      riskBgColor = "bg-green-50 border-green-200";
    } else if (riskScore <= 50) {
      riskLevel = "Medium";
      riskColor = "text-yellow-600";
      riskBgColor = "bg-yellow-50 border-yellow-200";
    } else if (riskScore <= 75) {
      riskLevel = "High";
      riskColor = "text-orange-600";
      riskBgColor = "bg-orange-50 border-orange-200";
    } else {
      riskLevel = "Very High";
      riskColor = "text-red-600";
      riskBgColor = "bg-red-50 border-red-200";
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (isHighReturn) {
      recommendations.push(
        `Your expected ${annualReturn}% return is optimistic. Consider more conservative estimates (5-7%).`
      );
    }

    if (isShortTimeframe) {
      recommendations.push(
        `Short timeframe increases risk. Consider extending your timeline for more stability.`
      );
    }

    if (isHighTarget) {
      recommendations.push(
        `Your target is ambitious. Consider increasing monthly contributions or extending timeline.`
      );
    }

    if (dependsHeavilyOnGains && finalProjection) {
      const gainsPercentage = (
        (finalProjection.gains / finalProjection.capital) *
        100
      ).toFixed(0);
      recommendations.push(
        `${gainsPercentage}% of your target depends on investment gains. Consider increasing contributions.`
      );
    }

    if (riskScore <= 25) {
      recommendations.push(
        `Your plan looks conservative and achievable. Great job on realistic expectations!`
      );
    }

    return {
      riskScore,
      riskLevel,
      riskColor,
      riskBgColor,
      recommendations,
      factors: {
        isHighReturn,
        isShortTimeframe,
        isHighTarget,
        dependsHeavilyOnGains,
      },
    };
  }, [params, projections]);

  return (
    <div
      className={`rounded-lg border p-4 sm:p-6 mb-6 ${assessment.riskBgColor}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Risk Assessment</h3>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${assessment.riskColor}`}>
            {assessment.riskScore}/100
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${assessment.riskColor} bg-white`}
          >
            {assessment.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Risk Factors:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            className={`flex items-center gap-2 ${
              assessment.factors.isHighReturn
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            <span>{assessment.factors.isHighReturn ? "⚠️" : "✅"}</span>
            <span className="text-sm">
              Expected Return ({params.annualReturn}%)
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              assessment.factors.isShortTimeframe
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            <span>{assessment.factors.isShortTimeframe ? "⚠️" : "✅"}</span>
            <span className="text-sm">
              Time Horizon ({Math.round((params.targetTimeFrame || 0) / 12)}{" "}
              years)
            </span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              assessment.factors.isHighTarget
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            <span>{assessment.factors.isHighTarget ? "⚠️" : "✅"}</span>
            <span className="text-sm">Target Ambition</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              assessment.factors.dependsHeavilyOnGains
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            <span>
              {assessment.factors.dependsHeavilyOnGains ? "⚠️" : "✅"}
            </span>
            <span className="text-sm">Dependency on Gains</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">💡 Recommendations:</h4>
        <ul className="space-y-1">
          {assessment.recommendations.map((rec, index) => (
            <li
              key={`rec-${index}-${rec.slice(0, 10)}`}
              className="text-sm text-gray-600 flex items-start gap-2"
            >
              <span className="text-blue-500 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
