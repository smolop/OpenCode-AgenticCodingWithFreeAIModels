export type CompoundFrequency =
  "annually" | "semiannually" | "quarterly" | "monthly" | "daily";

export const COMPOUND_FREQUENCIES: Record<
  CompoundFrequency,
  { label: string; periodsPerYear: number }
> = {
  annually: { label: "Annually", periodsPerYear: 1 },
  semiannually: { label: "Semi-annually", periodsPerYear: 2 },
  quarterly: { label: "Quarterly", periodsPerYear: 4 },
  monthly: { label: "Monthly", periodsPerYear: 12 },
  daily: { label: "Daily", periodsPerYear: 365 },
};

export type ContributionFrequency = "monthly" | "quarterly" | "annually";

export const CONTRIBUTION_FREQUENCIES: Record<
  ContributionFrequency,
  { label: string; periodsPerYear: number; periodNoun: string }
> = {
  monthly: { label: "Monthly", periodsPerYear: 12, periodNoun: "month" },
  quarterly: { label: "Quarterly", periodsPerYear: 4, periodNoun: "quarter" },
  annually: { label: "Annually", periodsPerYear: 1, periodNoun: "year" },
};

export interface CompoundInterestInputs {
  principal: number;
  contribution: number;
  annualInterestRate: number;
  years: number;
  compoundFrequency: CompoundFrequency;
  contributionFrequency: ContributionFrequency;
}

export interface CompoundYearRow {
  year: number;
  contributions: number;
  interest: number;
  balance: number;
}

export interface CompoundInterestResult {
  principal: number;
  finalBalance: number;
  totalContributions: number;
  regularContributions: number;
  totalInterest: number;
  schedule: CompoundYearRow[];
}

const MONTHS_PER_YEAR = 12;

export function calculateCompoundInterest(
  inputs: CompoundInterestInputs,
): CompoundInterestResult {
  const {
    principal,
    contribution,
    annualInterestRate,
    years,
    compoundFrequency,
    contributionFrequency,
  } = inputs;

  const { periodsPerYear } = COMPOUND_FREQUENCIES[compoundFrequency];
  const { periodsPerYear: contributionPeriodsPerYear } =
    CONTRIBUTION_FREQUENCIES[contributionFrequency];

  const nominalRate = annualInterestRate / 100;
  const effectiveAnnualRate =
    periodsPerYear === 0
      ? 0
      : Math.pow(1 + nominalRate / periodsPerYear, periodsPerYear) - 1;
  const monthlyRate =
    effectiveAnnualRate === 0
      ? 0
      : Math.pow(1 + effectiveAnnualRate, 1 / MONTHS_PER_YEAR) - 1;

  const monthsPerContribution = MONTHS_PER_YEAR / contributionPeriodsPerYear;
  const totalMonths = Math.round(years * MONTHS_PER_YEAR);

  const schedule: CompoundYearRow[] = [];
  let balance = principal;
  let regularContributions = 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (month % monthsPerContribution === 0) {
      balance += contribution;
      regularContributions += contribution;
    }

    balance = balance * (1 + monthlyRate);

    if (month % MONTHS_PER_YEAR === 0) {
      const totalContributions = principal + regularContributions;
      schedule.push({
        year: month / MONTHS_PER_YEAR,
        contributions: totalContributions,
        interest: balance - totalContributions,
        balance,
      });
    }
  }

  const totalContributions = principal + regularContributions;

  return {
    principal,
    finalBalance: balance,
    totalContributions,
    regularContributions,
    totalInterest: balance - totalContributions,
    schedule,
  };
}
