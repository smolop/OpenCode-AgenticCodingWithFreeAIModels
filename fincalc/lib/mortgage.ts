export type RepaymentFrequency = "monthly" | "fortnightly" | "weekly";

export const REPAYMENT_FREQUENCIES: Record<
  RepaymentFrequency,
  { label: string; periodNoun: string; periodsPerYear: number }
> = {
  monthly: { label: "Monthly", periodNoun: "month", periodsPerYear: 12 },
  fortnightly: {
    label: "Fortnightly",
    periodNoun: "fortnight",
    periodsPerYear: 26,
  },
  weekly: { label: "Weekly", periodNoun: "week", periodsPerYear: 52 },
};

export interface MortgageInputs {
  propertyPrice: number;
  deposit: number;
  annualInterestRate: number;
  termYears: number;
  frequency: RepaymentFrequency;
}

export interface MortgageResult {
  loanAmount: number;
  repayment: number;
  totalPaid: number;
  totalInterest: number;
  numberOfPayments: number;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult {
  const { propertyPrice, deposit, annualInterestRate, termYears, frequency } =
    inputs;
  const { periodsPerYear } = REPAYMENT_FREQUENCIES[frequency];
  const loanAmount = propertyPrice - deposit;
  const numberOfPayments = termYears * periodsPerYear;
  const periodRate = annualInterestRate / 100 / periodsPerYear;

  const growth = Math.pow(1 + periodRate, numberOfPayments);
  const repayment =
    periodRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * periodRate * growth) / (growth - 1);

  const totalPaid = repayment * numberOfPayments;

  return {
    loanAmount,
    repayment,
    totalPaid,
    totalInterest: totalPaid - loanAmount,
    numberOfPayments,
  };
}

export interface AmortisationRow {
  paymentNumber: number;
  repayment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortisationSchedule {
  rows: AmortisationRow[];
  totalRepayment: number;
  totalInterest: number;
  totalPrincipal: number;
}

export function calculateAmortisationSchedule(
  inputs: MortgageInputs,
): AmortisationSchedule {
  const { propertyPrice, deposit, annualInterestRate, termYears, frequency } =
    inputs;
  const { periodsPerYear } = REPAYMENT_FREQUENCIES[frequency];
  const loanAmount = propertyPrice - deposit;
  const numberOfPayments = termYears * periodsPerYear;
  const periodRate = annualInterestRate / 100 / periodsPerYear;

  const growth = Math.pow(1 + periodRate, numberOfPayments);
  const repayment =
    periodRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * periodRate * growth) / (growth - 1);

  const rows: AmortisationRow[] = [];
  let balance = loanAmount;
  let totalRepayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (
    let paymentNumber = 1;
    paymentNumber <= numberOfPayments;
    paymentNumber++
  ) {
    const interest = balance * periodRate;
    const principal =
      paymentNumber === numberOfPayments ? balance : repayment - interest;
    const payment = principal + interest;

    balance = Math.max(balance - principal, 0);
    totalRepayment += payment;
    totalInterest += interest;
    totalPrincipal += principal;

    rows.push({
      paymentNumber,
      repayment: payment,
      interest,
      principal,
      balance,
    });
  }

  return { rows, totalRepayment, totalInterest, totalPrincipal };
}

export { formatCurrency } from "./format";
