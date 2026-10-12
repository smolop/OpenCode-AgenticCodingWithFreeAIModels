"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CalculatorIcon,
  HouseIcon,
  TableIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  calculateAmortisationSchedule,
  calculateMortgage,
  formatCurrency,
  REPAYMENT_FREQUENCIES,
  type RepaymentFrequency,
} from "@/lib/mortgage";

type FieldKey = "propertyPrice" | "deposit" | "interestRate" | "termYears";
type CalculatorView = "calculator" | "amortisation";

function parseNumber(value: string): number {
  const trimmed = value.trim();
  return trimmed === "" ? Number.NaN : Number(trimmed);
}

export function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState("400000");
  const [deposit, setDeposit] = useState("80000");
  const [interestRate, setInterestRate] = useState("4.5");
  const [termYears, setTermYears] = useState("25");
  const [frequency, setFrequency] = useState<RepaymentFrequency>("monthly");
  const [view, setView] = useState<CalculatorView>("calculator");

  const propertyPriceNum = parseNumber(propertyPrice);
  const depositNum = parseNumber(deposit);
  const interestRateNum = parseNumber(interestRate);
  const termYearsNum = parseNumber(termYears);

  const errors: Partial<Record<FieldKey, string>> = {};

  if (!Number.isFinite(propertyPriceNum) || propertyPriceNum <= 0) {
    errors.propertyPrice = "Enter a loan amount above 0.";
  }
  if (!Number.isFinite(depositNum) || depositNum < 0) {
    errors.deposit = "Enter a deposit of 0 or more.";
  } else if (
    Number.isFinite(propertyPriceNum) &&
    depositNum >= propertyPriceNum
  ) {
    errors.deposit = "Deposit must be less than the property price.";
  }
  if (
    !Number.isFinite(interestRateNum) ||
    interestRateNum < 0 ||
    interestRateNum > 100
  ) {
    errors.interestRate = "Enter an interest rate between 0 and 100.";
  }
  if (
    !Number.isFinite(termYearsNum) ||
    !Number.isInteger(termYearsNum) ||
    termYearsNum < 1 ||
    termYearsNum > 40
  ) {
    errors.termYears = "Enter a whole number of years between 1 and 40.";
  }

  const isValid =
    !errors.propertyPrice &&
    !errors.deposit &&
    !errors.interestRate &&
    !errors.termYears;

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateMortgage({
      propertyPrice: propertyPriceNum,
      deposit: depositNum,
      annualInterestRate: interestRateNum,
      termYears: termYearsNum,
      frequency,
    });
  }, [
    isValid,
    propertyPriceNum,
    depositNum,
    interestRateNum,
    termYearsNum,
    frequency,
  ]);

  const schedule = useMemo(() => {
    if (!isValid) return null;
    return calculateAmortisationSchedule({
      propertyPrice: propertyPriceNum,
      deposit: depositNum,
      annualInterestRate: interestRateNum,
      termYears: termYearsNum,
      frequency,
    });
  }, [
    isValid,
    propertyPriceNum,
    depositNum,
    interestRateNum,
    termYearsNum,
    frequency,
  ]);

  const depositPercent =
    Number.isFinite(propertyPriceNum) &&
    propertyPriceNum > 0 &&
    Number.isFinite(depositNum)
      ? Math.round((depositNum / propertyPriceNum) * 100)
      : null;

  const { label: frequencyLabel, periodNoun } =
    REPAYMENT_FREQUENCIES[frequency];

  const termNoun = termYearsNum === 1 ? "year" : "years";

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(value) => {
          if (value) setView(value as CalculatorView);
        }}
        aria-label="Mortgage view"
        className="w-full sm:w-fit"
      >
        <ToggleGroupItem value="calculator" className="flex-1 sm:flex-none">
          <CalculatorIcon data-icon="inline-start" />
          Calculator
        </ToggleGroupItem>
        <ToggleGroupItem value="amortisation" className="flex-1 sm:flex-none">
          <TableIcon data-icon="inline-start" />
          Amortisation schedule
        </ToggleGroupItem>
      </ToggleGroup>

      {view === "calculator" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <HouseIcon className="size-5" />
              </span>
              <CardTitle>Your loan details</CardTitle>
              <CardDescription>
                Adjust the numbers — your repayments update instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field data-invalid={!!errors.propertyPrice}>
                  <FieldLabel htmlFor="property-price">Loan amount</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">€</InputGroupAddon>
                    <InputGroupInput
                      id="property-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={propertyPrice}
                      onChange={(event) => setPropertyPrice(event.target.value)}
                      aria-invalid={!!errors.propertyPrice}
                    />
                  </InputGroup>
                  <FieldError>{errors.propertyPrice}</FieldError>
                </Field>

                <Field data-invalid={!!errors.deposit}>
                  <FieldLabel htmlFor="deposit">Deposit</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">€</InputGroupAddon>
                    <InputGroupInput
                      id="deposit"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={deposit}
                      onChange={(event) => setDeposit(event.target.value)}
                      aria-invalid={!!errors.deposit}
                    />
                  </InputGroup>
                  {depositPercent !== null && !errors.deposit && (
                    <FieldDescription>
                      {depositPercent}% of the property price
                    </FieldDescription>
                  )}
                  <FieldError>{errors.deposit}</FieldError>
                </Field>

                <Field data-invalid={!!errors.interestRate}>
                  <FieldLabel htmlFor="interest-rate">Interest rate</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="interest-rate"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      step="any"
                      value={interestRate}
                      onChange={(event) => setInterestRate(event.target.value)}
                      aria-invalid={!!errors.interestRate}
                    />
                    <InputGroupAddon align="inline-end">%</InputGroupAddon>
                  </InputGroup>
                  <FieldError>{errors.interestRate}</FieldError>
                </Field>

                <Field data-invalid={!!errors.termYears}>
                  <FieldLabel htmlFor="loan-term">Loan term</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="loan-term"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={40}
                      step={1}
                      value={termYears}
                      onChange={(event) => setTermYears(event.target.value)}
                      aria-invalid={!!errors.termYears}
                    />
                    <InputGroupAddon align="inline-end">years</InputGroupAddon>
                  </InputGroup>
                  <FieldError>{errors.termYears}</FieldError>
                </Field>

                <Field>
                  <FieldTitle id="repayment-frequency">
                    Repayment frequency
                  </FieldTitle>
                  <ToggleGroup
                    type="single"
                    value={frequency}
                    onValueChange={(value) => {
                      if (value) setFrequency(value as RepaymentFrequency);
                    }}
                    aria-labelledby="repayment-frequency"
                    className="w-full"
                  >
                    <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                    <ToggleGroupItem value="fortnightly">
                      Fortnightly
                    </ToggleGroupItem>
                    <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                  </ToggleGroup>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                <CalculatorIcon className="size-5" />
              </span>
              <CardTitle>Your repayments</CardTitle>
              <CardDescription>
                {result
                  ? `${result.numberOfPayments} payments over ${termYearsNum} ${termNoun}.`
                  : "Correct the highlighted fields to see your results."}
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">{frequencyLabel}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                      {formatCurrency(result.repayment)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {periodNoun}
                    </span>
                  </div>
                  <Separator />
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Loan amount
                      </dt>
                      <dd className="font-heading text-lg font-medium">
                        {formatCurrency(result.loanAmount, 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Total interest
                      </dt>
                      <dd className="font-heading text-lg font-medium">
                        {formatCurrency(result.totalInterest, 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Total paid
                      </dt>
                      <dd className="font-heading text-lg font-medium">
                        {formatCurrency(result.totalPaid, 0)}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <Alert>
                  <TriangleAlertIcon />
                  <AlertTitle>Results paused</AlertTitle>
                  <AlertDescription>
                    Fix the highlighted inputs and your repayments will appear
                    here.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {view === "amortisation" && (
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <TableIcon className="size-5" />
            </span>
            <CardTitle>Amortisation schedule</CardTitle>
            <CardDescription>
              {schedule
                ? `${schedule.rows.length} payments over ${termYearsNum} ${termNoun} — interest and principal split for every ${periodNoun}.`
                : "Correct the highlighted fields to see your schedule."}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{frequencyLabel}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {schedule ? (
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 z-10 bg-background w-16">
                        No.
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Repayment
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Interest
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Principal
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Balance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedule.rows.map((row) => (
                      <TableRow key={row.paymentNumber}>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {row.paymentNumber}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.repayment)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.interest)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.principal)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(schedule.totalRepayment)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(schedule.totalInterest)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(schedule.totalPrincipal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(0)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <Alert>
                <TriangleAlertIcon />
                <AlertTitle>Schedule paused</AlertTitle>
                <AlertDescription>
                  Fix the highlighted inputs and your amortisation schedule will
                  appear here.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
