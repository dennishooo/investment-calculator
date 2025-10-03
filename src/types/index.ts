export interface ProjectionRow {
  month: number;
  futureDate: Date;
  capital: number;
  totalContributions: number;
  monthlyReturn: number;
  gains: number;
  requiredMonthlyReturn: number;
  remainingMonths: number;
}

export interface CalculatorParams {
  initialCapital: number;
  monthlyInput: number;
  annualReturn: number;
  targetCapital: number;
  targetTimeFrame: number | null;
}

export interface ProjectionResult {
  data: ProjectionRow[];
  targetMonth: number | null;
  autoCalculatedTime: number | null;
}

export interface RequiredReturnDisplay {
  text: string;
  className: string;
}
