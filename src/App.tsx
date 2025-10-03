import React, { useState, useEffect, useMemo } from 'react';

interface ProjectionRow {
  month: number;
  futureDate: Date;
  capital: number;
  totalContributions: number;
  monthlyReturn: number;
  gains: number;
  requiredMonthlyReturn: number;
  remainingMonths: number;
}

interface CalculatorParams {
  initialCapital: number;
  monthlyInput: number;
  annualReturn: number;
  targetCapital: number;
  targetTimeFrame: number | null;
}

const defaultValues: CalculatorParams = {
  initialCapital: 10000,
  monthlyInput: 500,
  annualReturn: 7,
  targetCapital: 100000,
  targetTimeFrame: null,
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function App() {
  const [params, setParams] = useState<CalculatorParams>(() => {
    const saved = localStorage.getItem('investmentCalculatorParams');
    if (saved) {
      try {
        return { ...defaultValues, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Could not parse saved values, using defaults');
        return defaultValues;
      }
    }
    return defaultValues;
  });

  useEffect(() => {
    localStorage.setItem('investmentCalculatorParams', JSON.stringify(params));
  }, [params]);

  const updateParam = (key: keyof CalculatorParams, value: number | null) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem('investmentCalculatorParams');
    setParams(defaultValues);
  };

  const getFutureDate = (monthsFromNow: number): Date => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setMonth(futureDate.getMonth() + monthsFromNow);
    return futureDate;
  };

  const formatDate = (date: Date): string => {
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'HKD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateFinalAmountFromPoint = (
    startingCapital: number,
    monthlyInput: number,
    monthlyRate: number,
    months: number
  ): number => {
    let amount = startingCapital;
    for (let i = 0; i < months; i++) {
      amount += monthlyInput;
      amount = amount * (1 + monthlyRate);
    }
    return amount;
  };

  const calculateRequiredMonthlyReturn = (
    currentCapital: number,
    monthlyInput: number,
    targetCapital: number,
    remainingMonths: number
  ): number => {
    if (remainingMonths <= 0) return 0;
    if (currentCapital >= targetCapital) return 0;

    let low = -0.1;
    let high = 0.5;
    const tolerance = 0.000001;
    const maxIterations = 100;
    let iterations = 0;

    while (high - low > tolerance && iterations < maxIterations) {
      iterations++;
      const mid = (low + high) / 2;
      const finalAmount = calculateFinalAmountFromPoint(
        currentCapital,
        monthlyInput,
        mid,
        remainingMonths
      );
      
      if (finalAmount < targetCapital) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
  };

  const autoCalculateTargetTime = (): number | null => {
    const { initialCapital, monthlyInput, annualReturn, targetCapital } = params;

    if (!initialCapital || !targetCapital || !annualReturn) {
      return null;
    }

    const monthlyReturnRate = annualReturn / 100 / 12;
    let currentCapital = initialCapital;
    let month = 0;

    while (month < 600 && currentCapital < targetCapital) {
      month++;
      currentCapital += monthlyInput;
      currentCapital = currentCapital * (1 + monthlyReturnRate);
    }

    return currentCapital >= targetCapital ? month : null;
  };

  const autoCalculateTime = () => {
    const calculatedTime = autoCalculateTargetTime();
    if (calculatedTime) {
      setParams(prev => ({ ...prev, targetTimeFrame: calculatedTime }));
    }
  };

  const projections = useMemo(() => {
    const { initialCapital, monthlyInput, annualReturn, targetCapital } = params;
    let { targetTimeFrame } = params;

    if (!targetTimeFrame) {
      targetTimeFrame = autoCalculateTargetTime();
    }

    const monthlyReturnRate = annualReturn / 100 / 12;
    const data: ProjectionRow[] = [];
    let currentCapital = initialCapital;
    let month = 0;
    let targetReached = false;
    let targetMonth: number | null = null;

    const maxMonths = targetTimeFrame && targetTimeFrame > 0 ? targetTimeFrame : 600;

    while (month < maxMonths) {
      month++;
      const capitalBeforeReturn = currentCapital + monthlyInput;
      const monthlyReturnAmount = capitalBeforeReturn * monthlyReturnRate;
      currentCapital = capitalBeforeReturn + monthlyReturnAmount;
      
      if (!targetReached && currentCapital >= targetCapital) {
        targetReached = true;
        targetMonth = month;
      }

      const remainingMonths = targetTimeFrame && targetTimeFrame > 0 ? targetTimeFrame - month : 0;
      const requiredMonthlyReturn = remainingMonths > 0 ? 
        calculateRequiredMonthlyReturn(currentCapital, monthlyInput, targetCapital, remainingMonths) : 0;

      const futureDate = getFutureDate(month);

      data.push({
        month,
        futureDate,
        capital: currentCapital,
        totalContributions: initialCapital + (monthlyInput * month),
        monthlyReturn: monthlyReturnAmount,
        gains: currentCapital - (initialCapital + (monthlyInput * month)),
        requiredMonthlyReturn,
        remainingMonths,
      });

      if (targetReached && targetTimeFrame && targetTimeFrame > 0 && month >= targetTimeFrame) {
        break;
      }
    }

    return { data, targetMonth, autoCalculatedTime: targetTimeFrame };
  }, [params]);

  const renderSummary = () => {
    const { targetCapital, targetTimeFrame } = params;
    const { targetMonth } = projections;

    if (!targetMonth) return null;

    const years = Math.floor(targetMonth / 12);
    const monthsRemaining = targetMonth % 12;
    const targetDate = getFutureDate(targetMonth);

    if (targetTimeFrame && targetTimeFrame > 0) {
      if (targetMonth <= targetTimeFrame) {
        const monthsAhead = targetTimeFrame - targetMonth;
        return (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Target Achievement</h2>
            <p className="text-green-700">
              You will reach your target of {formatCurrency(targetCapital)} in {targetMonth} months 
              ({years} years and {monthsRemaining} months) by {formatDate(targetDate)}
              {monthsAhead > 0 ? ` - ${monthsAhead} months ahead of schedule!` : ''}
            </p>
          </div>
        );
      } else {
        return (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Target Achievement</h2>
            <p className="text-green-700">
              With current parameters, you will reach your target by {formatDate(targetDate)}, 
              which is {targetMonth - targetTimeFrame} months later than your target of {targetTimeFrame} months.
            </p>
          </div>
        );
      }
    }

    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Target Achievement</h2>
        <p className="text-green-700">
          You will reach your target of {formatCurrency(targetCapital)} in {targetMonth} months 
          ({years} years and {monthsRemaining} months) by {formatDate(targetDate)}
        </p>
      </div>
    );
  };

  const getRequiredReturnDisplay = (row: ProjectionRow, isTargetReached: boolean) => {
    const requiredAnnualReturn = ((1 + row.requiredMonthlyReturn) ** 12 - 1) * 100;
    
    if (row.remainingMonths <= 0 || isTargetReached) {
      return {
        text: isTargetReached ? 'Target reached!' : '-',
        className: isTargetReached ? 'text-green-600' : 'text-gray-500',
      };
    }

    if (requiredAnnualReturn > 100) {
      return { text: 'Impossible', className: 'text-red-600' };
    }
    
    if (requiredAnnualReturn < 0) {
      return { text: 'No return needed', className: 'text-green-600' };
    }

    const className = requiredAnnualReturn > 20 
      ? 'text-red-600' 
      : requiredAnnualReturn > 10 
        ? 'text-orange-600' 
        : 'text-blue-600';

    return {
      text: (row.requiredMonthlyReturn * 100).toFixed(3) + '%',
      className,
    };
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Investment Growth Calculator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Capital ($)
            </label>
            <input
              type="number"
              value={params.initialCapital}
              onChange={(e) => updateParam('initialCapital', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Input ($)
            </label>
            <input
              type="number"
              value={params.monthlyInput}
              onChange={(e) => updateParam('monthlyInput', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Return (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={params.annualReturn}
              onChange={(e) => updateParam('annualReturn', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Capital ($)
            </label>
            <input
              type="number"
              value={params.targetCapital}
              onChange={(e) => updateParam('targetCapital', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Time (months)
            </label>
            <input
              type="number"
              value={params.targetTimeFrame || ''}
              onChange={(e) => updateParam('targetTimeFrame', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Auto-calculated"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">Leave blank for auto-calculation</div>
          </div>
        </div>

        <div className="mb-6">
          <button 
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset to Defaults
          </button>
          <button 
            onClick={autoCalculateTime}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Auto-Calculate Target Time
          </button>
          <span className="ml-2 text-sm text-gray-500">Your settings are automatically saved</span>
        </div>

        {renderSummary()}

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
                  const progressPercentage = (row.capital / params.targetCapital) * 100;
                  const isTargetReached = row.capital >= params.targetCapital;
                  const requiredReturn = getRequiredReturnDisplay(row, isTargetReached);
                  
                  return (
                    <tr 
                      key={row.month}
                      className={isTargetReached ? 'bg-green-50' : 'hover:bg-gray-50'}
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
                      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${row.monthlyReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(row.monthlyReturn)}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${row.gains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(row.gains)}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${requiredReturn.className}`}>
                        {requiredReturn.text}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        <div className="flex items-center justify-end">
                          <span className="mr-2">{progressPercentage.toFixed(1)}%</span>
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${isTargetReached ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
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

        <div className="mt-4 text-sm text-gray-500">
          Showing monthly projections. Returns are compounded monthly. "Monthly Return" shows the dollar amount gained from investments that month. "Required Monthly Return" shows what return rate you need from that month onwards to reach your target on time. Green highlighting indicates target achievement.
        </div>
      </div>
    </div>
  );
}

export default App;