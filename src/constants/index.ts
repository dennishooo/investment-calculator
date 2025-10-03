import { type CalculatorParams } from "../types";

export const defaultValues: CalculatorParams = {
  initialCapital: 10000,
  monthlyInput: 500,
  annualReturn: 7,
  targetCapital: 100000,
  targetTimeFrame: null,
};

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const STORAGE_KEY = "investmentCalculatorParams";
export const MAX_MONTHS = 600;
export const MAX_ITERATIONS = 100;
export const TOLERANCE = 0.000001;
