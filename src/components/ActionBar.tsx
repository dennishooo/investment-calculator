import type { CalculatorParams, ProjectionResult } from "../types";
import { exportToCSV } from "../utils/csvExport";

interface ActionBarProps {
  params: CalculatorParams;
  projections: ProjectionResult;
  onReset: () => void;
  onAutoCalculateTime: () => void;
}

export const ActionBar = ({
  params,
  projections,
  onReset,
  onAutoCalculateTime,
}: ActionBarProps) => {
  const handleExportCSV = () => {
    exportToCSV(projections, params);
  };

  const handleShareLink = () => {
    const shareData = {
      initialCapital: params.initialCapital,
      monthlyInput: params.monthlyInput,
      annualReturn: params.annualReturn,
      targetCapital: params.targetCapital,
      targetTimeFrame: params.targetTimeFrame,
    };

    const encodedData = btoa(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Share link copied to clipboard!");
      })
      .catch(() => {
        prompt("Copy this link to share your calculation:", shareUrl);
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      >
        Reset to Defaults
      </button>

      <button
        onClick={onAutoCalculateTime}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Auto-Calculate Target Time
      </button>

      <button
        onClick={handleExportCSV}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
      >
        📊 Export CSV
      </button>

      <button
        onClick={handleShareLink}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
      >
        🔗 Share Link
      </button>

      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        🖨️ Print
      </button>

      <span className="flex items-center text-sm text-gray-500">
        💾 Your settings are automatically saved
      </span>
    </div>
  );
};
