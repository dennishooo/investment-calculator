import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ProjectionResult, CalculatorParams } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InvestmentChartProps {
  projections: ProjectionResult;
  params: CalculatorParams;
}

export const InvestmentChart = ({
  projections,
  params,
}: InvestmentChartProps) => {
  const chartData = useMemo(() => {
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

  const options = useMemo(
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
          text: "Investment Growth Projection",
          font: {
            size: 16,
            weight: "bold" as const,
          },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          callbacks: {
            label: function (context: {
              dataset: { label?: string };
              parsed: { y: number };
            }) {
              const label = context.dataset.label || "";
              const value = formatCurrency(context.parsed.y);
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
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
      elements: {
        point: {
          radius: 3,
          hoverRadius: 6,
        },
      },
    }),
    []
  );

  const targetReachedMonth = projections.data.find(
    (row) => row.capital >= params.targetCapital
  )?.month;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="h-96 mb-4">
        <Line data={chartData} options={options} />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              projections.data[projections.data.length - 1]?.capital || 0
            )}
          </div>
          <div className="text-sm text-gray-600">Final Amount</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(
              projections.data[projections.data.length - 1]?.gains || 0
            )}
          </div>
          <div className="text-sm text-gray-600">Total Gains</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {targetReachedMonth
              ? `${targetReachedMonth} months`
              : "Not reached"}
          </div>
          <div className="text-sm text-gray-600">Time to Target</div>
        </div>
      </div>
    </div>
  );
};
