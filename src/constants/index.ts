import { type CalculatorParams } from "../types";

export const defaultValues: CalculatorParams = {
  initialCapital: 1000000,
  monthlyInput: 40000,
  annualReturn: 50,
  targetCapital: 20000000,
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
