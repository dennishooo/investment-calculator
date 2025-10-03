import { useMemo } from "react";
import { useCalculatorParams } from "./hooks/useCalculatorParams";
import { calculateProjections, autoCalculateTargetTime } from "./utils";
import { ParameterInputs, TargetSummary, ProjectionTable } from "./components";

function App() {
  const { params, updateParam, resetToDefaults } = useCalculatorParams();

  const autoCalculateTime = () => {
    const calculatedTime = autoCalculateTargetTime(params);
    if (calculatedTime) {
      updateParam("targetTimeFrame", calculatedTime);
    }
  };

  const projections = useMemo(() => {
    return calculateProjections(params);
  }, [params]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Investment Growth Calculator
        </h1>

        <ParameterInputs
          params={params}
          onUpdateParam={updateParam}
          onReset={resetToDefaults}
          onAutoCalculateTime={autoCalculateTime}
        />

        <TargetSummary params={params} projections={projections} />

        <ProjectionTable params={params} projections={projections} />

        <div className="mt-4 text-sm text-gray-500">
          Showing monthly projections. Returns are compounded monthly. "Monthly
          Return" shows the dollar amount gained from investments that month.
          "Required Monthly Return" shows what return rate you need from that
          month onwards to reach your target on time. Green highlighting
          indicates target achievement.
        </div>
      </div>
    </div>
  );
}

export default App;
