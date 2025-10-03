import type { CalculatorParams } from "../types";

interface ParameterInputsProps {
  params: CalculatorParams;
  onUpdateParam: (key: keyof CalculatorParams, value: number | null) => void;
  onReset: () => void;
  onAutoCalculateTime: () => void;
}

export const ParameterInputs = ({
  params,
  onUpdateParam,
  onReset,
  onAutoCalculateTime,
}: ParameterInputsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
        <div>
          <label
            htmlFor="initialCapital"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Initial Capital ($)
          </label>
          <input
            id="initialCapital"
            type="number"
            value={params.initialCapital}
            onChange={(e) =>
              onUpdateParam("initialCapital", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="monthlyInput"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Monthly Input ($)
          </label>
          <input
            id="monthlyInput"
            type="number"
            value={params.monthlyInput}
            onChange={(e) =>
              onUpdateParam("monthlyInput", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="annualReturn"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Annual Return (%)
          </label>
          <input
            id="annualReturn"
            type="number"
            step="0.1"
            value={params.annualReturn}
            onChange={(e) =>
              onUpdateParam("annualReturn", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="targetCapital"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Capital ($)
          </label>
          <input
            id="targetCapital"
            type="number"
            value={params.targetCapital}
            onChange={(e) =>
              onUpdateParam("targetCapital", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="targetTimeFrame"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Target Time (months)
          </label>
          <input
            id="targetTimeFrame"
            type="number"
            value={params.targetTimeFrame || ""}
            onChange={(e) =>
              onUpdateParam(
                "targetTimeFrame",
                e.target.value ? parseFloat(e.target.value) : null
              )
            }
            placeholder="Auto-calculated"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Leave blank for auto-calculation
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset to Defaults
        </button>
        <button
          onClick={onAutoCalculateTime}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Auto-Calculate Target Time
        </button>
        <span className="ml-2 text-sm text-gray-500">
          Your settings are automatically saved
        </span>
      </div>
    </>
  );
};
