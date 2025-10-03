import {
  type ProjectionRow,
  type CalculatorParams,
  type ProjectionResult,
} from "../types";
import { MAX_MONTHS, MAX_ITERATIONS, TOLERANCE } from "../constants";

export const calculateFinalAmountFromPoint = (
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

export const calculateRequiredMonthlyReturn = (
  currentCapital: number,
  monthlyInput: number,
  targetCapital: number,
  remainingMonths: number
): number => {
  if (remainingMonths <= 0) return 0;
  if (currentCapital >= targetCapital) return 0;

  let low = -0.1;
  let high = 0.5;
  let iterations = 0;

  while (high - low > TOLERANCE && iterations < MAX_ITERATIONS) {
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

export const autoCalculateTargetTime = (
  params: CalculatorParams
): number | null => {
  const { initialCapital, monthlyInput, annualReturn, targetCapital } = params;

  if (!initialCapital || !targetCapital || !annualReturn) {
    return null;
  }

  const monthlyReturnRate = annualReturn / 100 / 12;
  let currentCapital = initialCapital;
  let month = 0;

  while (month < MAX_MONTHS && currentCapital < targetCapital) {
    month++;
    currentCapital += monthlyInput;
    currentCapital = currentCapital * (1 + monthlyReturnRate);
  }

  return currentCapital >= targetCapital ? month : null;
};

export const calculateProjections = (
  params: CalculatorParams
): ProjectionResult => {
  const { initialCapital, monthlyInput, annualReturn, targetCapital } = params;
  let { targetTimeFrame } = params;

  if (!targetTimeFrame) {
    targetTimeFrame = autoCalculateTargetTime(params);
  }

  const monthlyReturnRate = annualReturn / 100 / 12;
  const data: ProjectionRow[] = [];
  let currentCapital = initialCapital;
  let month = 0;
  let targetReached = false;
  let targetMonth: number | null = null;

  const maxMonths =
    targetTimeFrame && targetTimeFrame > 0 ? targetTimeFrame : MAX_MONTHS;

  while (month < maxMonths) {
    month++;
    const capitalBeforeReturn = currentCapital + monthlyInput;
    const monthlyReturnAmount = capitalBeforeReturn * monthlyReturnRate;
    currentCapital = capitalBeforeReturn + monthlyReturnAmount;

    if (!targetReached && currentCapital >= targetCapital) {
      targetReached = true;
      targetMonth = month;
    }

    const remainingMonths =
      targetTimeFrame && targetTimeFrame > 0 ? targetTimeFrame - month : 0;
    const requiredMonthlyReturn =
      remainingMonths > 0
        ? calculateRequiredMonthlyReturn(
            currentCapital,
            monthlyInput,
            targetCapital,
            remainingMonths
          )
        : 0;

    const futureDate = getFutureDate(month);

    data.push({
      month,
      futureDate,
      capital: currentCapital,
      totalContributions: initialCapital + monthlyInput * month,
      monthlyReturn: monthlyReturnAmount,
      gains: currentCapital - (initialCapital + monthlyInput * month),
      requiredMonthlyReturn,
      remainingMonths,
    });

    if (
      targetReached &&
      targetTimeFrame &&
      targetTimeFrame > 0 &&
      month >= targetTimeFrame
    ) {
      break;
    }
  }

  return { data, targetMonth, autoCalculatedTime: targetTimeFrame };
};

const getFutureDate = (monthsFromNow: number): Date => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setMonth(futureDate.getMonth() + monthsFromNow);
  return futureDate;
};
