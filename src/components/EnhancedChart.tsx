import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import type { ProjectionResult, CalculatorParams } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EnhancedChartProps {
  projections: ProjectionResult;
  params: CalculatorParams;
}

type ChartType = "line" | "bar" | "breakdown";

const getChartTitle = (type: ChartType): string => {
  switch (type) {
    case "line":
      return "Investment Growth Over Time";
    case "bar":
      return "Contributions vs Gains";
    case "breakdown":
      return "Final Portfolio Breakdown";
    default:
      return "Investment Analysis";
  }
};

export const EnhancedChart = ({ projections, params }: EnhancedChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("line");

  const lineChartData = useMemo(() => {
    const labels = projections.data.map((row) => formatDate(row.futureDate));
    const capitalData = projections.data.map((row) => row.capital);
    const contributionsData = projections.data.map(
      (row) => row.totalContributions
    );
    const gainsData = projections.data.map((row) => row.gains);
    const targetLine = projections.data.map(() => params.targetCapital);

    return {
      labels,
      datasets: [
        {
          label: "Total Capital",
          data: capitalData,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: false,
          tension: 0.1,
        },
        {
          label: "Total Contributions",
          data: contributionsData,
          borderColor: "rgb(16, 185, 129)",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
        {
          label: "Investment Gains",
          data: gainsData,
          borderColor: "rgb(168, 85, 247)",
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
        {
          label: "Target Goal",
          data: targetLine,
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  }, [projections, params.targetCapital]);

  const barChartData = useMemo(() => {
    const labels = projections.data
      .filter(
        (_, index) => index % Math.ceil(projections.data.length / 12) === 0
      )
      .map((row) => formatDate(row.futureDate));

    const filteredData = projections.data.filter(
      (_, index) => index % Math.ceil(projections.data.length / 12) === 0
    );

    return {
      labels,
      datasets: [
        {
          label: "Contributions",
          data: filteredData.map((row) => row.totalContributions),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 1,
        },
        {
          label: "Investment Gains",
          data: filteredData.map((row) => row.gains),
          backgroundColor: "rgba(168, 85, 247, 0.8)",
          borderColor: "rgb(168, 85, 247)",
          borderWidth: 1,
        },
      ],
    };
  }, [projections]);

  const breakdownData = useMemo(() => {
    const finalProjection = projections.data[projections.data.length - 1];
    if (!finalProjection) return { labels: [], datasets: [] };

    return {
      labels: ["Initial Capital", "Monthly Contributions", "Investment Gains"],
      datasets: [
        {
          data: [
            params.initialCapital,
            finalProjection.totalContributions - params.initialCapital,
            finalProjection.gains,
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(168, 85, 247, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(168, 85, 247)",
          ],
          borderWidth: 2,
        },
      ],
    };
  }, [projections, params.initialCapital]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        title: {
          display: true,
          text: getChartTitle(chartType),
          font: {
            size: 16,
            weight: "bold" as const,
          },
        },
        tooltip: {
          mode:
            chartType === "breakdown" ? ("point" as const) : ("index" as const),
          intersect: false,
          callbacks: {
            label: function (context: {
              dataset: { label?: string };
              label?: string;
              parsed: { y?: number } | number;
            }) {
              const label = context.dataset.label || context.label || "";
              const value =
                typeof context.parsed === "number"
                  ? context.parsed
                  : context.parsed.y || 0;
              return `${label}: ${formatCurrency(value)}`;
            },
          },
        },
      },
      scales:
        chartType === "breakdown"
          ? {}
          : {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Time Period",
                },
                ticks: {
                  maxTicksLimit: 12,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Amount (HKD)",
                },
                stacked: chartType === "bar",
                ticks: {
                  callback: function (value: string | number) {
                    return formatCurrency(Number(value));
                  },
                },
              },
            },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
    }),
    [chartType]
  );

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return <Line data={lineChartData} options={chartOptions} />;
      case "bar":
        return <Bar data={barChartData} options={chartOptions} />;
      case "breakdown":
        return <Doughnut data={breakdownData} options={chartOptions} />;
      default:
        return <Line data={lineChartData} options={chartOptions} />;
    }
  };

  const targetReachedMonth = projections.data.find(
    (row) => row.capital >= params.targetCapital
  )?.month;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Chart Type Selector */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Investment Visualization
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              chartType === "line"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📈 Growth
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              chartType === "bar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            📊 Comparison
          </button>
          <button
            onClick={() => setChartType("breakdown")}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              chartType === "breakdown"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            🥧 Breakdown
          </button>
        </div>
      </div>

      <div className="h-96 mb-4">{renderChart()}</div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">
            {formatCurrency(
              projections.data[projections.data.length - 1]?.capital || 0
            )}
          </div>
          <div className="text-xs text-gray-600">Final Amount</div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-green-600">
            {formatCurrency(
              projections.data[projections.data.length - 1]
                ?.totalContributions || 0
            )}
          </div>
          <div className="text-xs text-gray-600">Total Invested</div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-purple-600">
            {formatCurrency(
              projections.data[projections.data.length - 1]?.gains || 0
            )}
          </div>
          <div className="text-xs text-gray-600">Investment Gains</div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-red-600">
            {targetReachedMonth ? `${targetReachedMonth}m` : "Not reached"}
          </div>
          <div className="text-xs text-gray-600">Time to Target</div>
        </div>
      </div>
    </div>
  );
};
