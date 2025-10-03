import { useMemo } from "react";
import { useCalculatorParams } from "./hooks/useCalculatorParams";
import { calculateProjections, autoCalculateTargetTime } from "./utils";
import {
  ParameterInputs,
  TargetSummary,
  ProjectionTable,
  EnhancedChart,
  ScenarioComparison,
  ActionBar,
  GoalProgress,
} from "./components";

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
      <div className="max-w-7xl mx-auto p-3 sm:p-6 bg-white min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
          Investment Growth Calculator
        </h1>

        <ParameterInputs params={params} onUpdateParam={updateParam} />

        <ActionBar
          params={params}
          projections={projections}
          onReset={resetToDefaults}
          onAutoCalculateTime={autoCalculateTime}
        />

        <GoalProgress params={params} projections={projections} />

        <TargetSummary params={params} projections={projections} />

        <EnhancedChart projections={projections} params={params} />

        <ScenarioComparison baseParams={params} />

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
