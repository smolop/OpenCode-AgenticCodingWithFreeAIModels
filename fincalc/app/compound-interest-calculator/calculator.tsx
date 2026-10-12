"use client";

import { useMemo, useState } from "react";
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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
  ChartLineIcon,
  PiggyBankIcon,
  TableIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  calculateCompoundInterest,
  COMPOUND_FREQUENCIES,
  CONTRIBUTION_FREQUENCIES,
  type CompoundFrequency,
  type ContributionFrequency,
} from "@/lib/compound-interest";
import { formatCurrency } from "@/lib/format";

type FieldKey = "principal" | "contribution" | "interestRate" | "years";
type CalculatorView = "calculator" | "growth" | "chart";

const chartConfig = {
  contributions: { label: "Contributions", color: "var(--chart-1)" },
  interest: { label: "Interest", color: "var(--chart-2)" },
} satisfies ChartConfig;

const compactCurrency = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

function parseNumber(value: string): number {
  const trimmed = value.trim();
  return trimmed === "" ? Number.NaN : Number(trimmed);
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [contribution, setContribution] = useState("200");
  const [interestRate, setInterestRate] = useState("5");
  const [years, setYears] = useState("10");
  const [compoundFrequency, setCompoundFrequency] =
    useState<CompoundFrequency>("monthly");
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>("monthly");
  const [view, setView] = useState<CalculatorView>("calculator");

  const principalNum = parseNumber(principal);
  const contributionNum = parseNumber(contribution);
  const interestRateNum = parseNumber(interestRate);
  const yearsNum = parseNumber(years);

  const errors: Partial<Record<FieldKey, string>> = {};

  if (!Number.isFinite(principalNum) || principalNum < 0) {
    errors.principal = "Enter a starting balance of 0 or more.";
  }
  if (!Number.isFinite(contributionNum) || contributionNum < 0) {
    errors.contribution = "Enter a contribution of 0 or more.";
  }
  if (
    !errors.principal &&
    !errors.contribution &&
    principalNum === 0 &&
    contributionNum === 0
  ) {
    errors.principal = "Add a starting balance or a regular contribution.";
  }
  if (
    !Number.isFinite(interestRateNum) ||
    interestRateNum < 0 ||
    interestRateNum > 100
  ) {
    errors.interestRate = "Enter an interest rate between 0 and 100.";
  }
  if (
    !Number.isFinite(yearsNum) ||
    !Number.isInteger(yearsNum) ||
    yearsNum < 1 ||
    yearsNum > 50
  ) {
    errors.years = "Enter a whole number of years between 1 and 50.";
  }

  const isValid =
    !errors.principal &&
    !errors.contribution &&
    !errors.interestRate &&
    !errors.years;

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateCompoundInterest({
      principal: principalNum,
      contribution: contributionNum,
      annualInterestRate: interestRateNum,
      years: yearsNum,
      compoundFrequency,
      contributionFrequency,
    });
  }, [
    isValid,
    principalNum,
    contributionNum,
    interestRateNum,
    yearsNum,
    compoundFrequency,
    contributionFrequency,
  ]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { year: 0, contributions: result.principal, interest: 0 },
      ...result.schedule.map((row) => ({
        year: row.year,
        contributions: row.contributions,
        interest: row.interest,
      })),
    ];
  }, [result]);

  const { label: compoundLabel } = COMPOUND_FREQUENCIES[compoundFrequency];
  const { label: contributionLabel, periodNoun } =
    CONTRIBUTION_FREQUENCIES[contributionFrequency];

  const yearNoun = yearsNum === 1 ? "year" : "years";

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(value) => {
          if (value) setView(value as CalculatorView);
        }}
        aria-label="Compound interest view"
        className="w-full sm:w-fit"
      >
        <ToggleGroupItem value="calculator" className="flex-1 sm:flex-none">
          <CalculatorIcon data-icon="inline-start" />
          Calculator
        </ToggleGroupItem>
        <ToggleGroupItem value="growth" className="flex-1 sm:flex-none">
          <TableIcon data-icon="inline-start" />
          Growth schedule
        </ToggleGroupItem>
        <ToggleGroupItem value="chart" className="flex-1 sm:flex-none">
          <ChartLineIcon data-icon="inline-start" />
          Growth chart
        </ToggleGroupItem>
      </ToggleGroup>

      {view === "calculator" && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <PiggyBankIcon className="size-5" />
                </span>
                <CardTitle>Your savings plan</CardTitle>
                <CardDescription>
                  Adjust the numbers — your projection updates instantly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field data-invalid={!!errors.principal}>
                    <FieldLabel htmlFor="initial-balance">
                      Starting balance
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">€</InputGroupAddon>
                      <InputGroupInput
                        id="initial-balance"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={principal}
                        onChange={(event) => setPrincipal(event.target.value)}
                        aria-invalid={!!errors.principal}
                      />
                    </InputGroup>
                    <FieldError>{errors.principal}</FieldError>
                  </Field>

                  <Field data-invalid={!!errors.contribution}>
                    <FieldLabel htmlFor="regular-contribution">
                      Regular contribution
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">€</InputGroupAddon>
                      <InputGroupInput
                        id="regular-contribution"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={contribution}
                        onChange={(event) =>
                          setContribution(event.target.value)
                        }
                        aria-invalid={!!errors.contribution}
                      />
                    </InputGroup>
                    {!errors.contribution && (
                      <FieldDescription>
                        Added every {periodNoun}
                      </FieldDescription>
                    )}
                    <FieldError>{errors.contribution}</FieldError>
                  </Field>

                  <Field>
                    <FieldTitle id="contribution-frequency">
                      Contribution frequency
                    </FieldTitle>
                    <ToggleGroup
                      type="single"
                      value={contributionFrequency}
                      onValueChange={(value) => {
                        if (value)
                          setContributionFrequency(
                            value as ContributionFrequency,
                          );
                      }}
                      aria-labelledby="contribution-frequency"
                      className="w-full"
                    >
                      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                      <ToggleGroupItem value="quarterly">
                        Quarterly
                      </ToggleGroupItem>
                      <ToggleGroupItem value="annually">
                        Annually
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </Field>

                  <Field data-invalid={!!errors.interestRate}>
                    <FieldLabel htmlFor="interest-rate">
                      Interest rate
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="interest-rate"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step="any"
                        value={interestRate}
                        onChange={(event) =>
                          setInterestRate(event.target.value)
                        }
                        aria-invalid={!!errors.interestRate}
                      />
                      <InputGroupAddon align="inline-end">%</InputGroupAddon>
                    </InputGroup>
                    <FieldError>{errors.interestRate}</FieldError>
                  </Field>

                  <Field>
                    <FieldTitle id="compound-frequency">
                      Compound frequency
                    </FieldTitle>
                    <ToggleGroup
                      type="single"
                      value={compoundFrequency}
                      onValueChange={(value) => {
                        if (value)
                          setCompoundFrequency(value as CompoundFrequency);
                      }}
                      aria-labelledby="compound-frequency"
                      className="w-full"
                    >
                      <ToggleGroupItem value="annually">
                        Annually
                      </ToggleGroupItem>
                      <ToggleGroupItem value="quarterly">
                        Quarterly
                      </ToggleGroupItem>
                      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
                      <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                    </ToggleGroup>
                  </Field>

                  <Field data-invalid={!!errors.years}>
                    <FieldLabel htmlFor="time-horizon">Time horizon</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="time-horizon"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={50}
                        step={1}
                        value={years}
                        onChange={(event) => setYears(event.target.value)}
                        aria-invalid={!!errors.years}
                      />
                      <InputGroupAddon align="inline-end">
                        years
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError>{errors.years}</FieldError>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <CalculatorIcon className="size-5" />
                </span>
                <CardTitle>Your projection</CardTitle>
                <CardDescription>
                  {result
                    ? `Final balance after ${yearsNum} ${yearNoun}, compounding ${compoundLabel.toLowerCase()}.`
                    : "Correct the highlighted fields to see your projection."}
                </CardDescription>
                <CardAction>
                  <Badge variant="secondary">{contributionLabel}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                        {formatCurrency(result.finalBalance)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        final balance
                      </span>
                    </div>
                    <Separator />
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Starting balance
                        </dt>
                        <dd className="font-heading text-lg font-medium">
                          {formatCurrency(result.principal, 0)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Total contributions
                        </dt>
                        <dd className="font-heading text-lg font-medium">
                          {formatCurrency(result.totalContributions, 0)}
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
                    </dl>
                  </div>
                ) : (
                  <Alert>
                    <TriangleAlertIcon />
                    <AlertTitle>Results paused</AlertTitle>
                    <AlertDescription>
                      Fix the highlighted inputs and your projection will appear
                      here.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {view === "growth" && (
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <TableIcon className="size-5" />
            </span>
            <CardTitle>Growth schedule</CardTitle>
            <CardDescription>
              {result
                ? `${result.schedule.length} ${yearNoun} of deposits and growth, compounding ${compoundLabel.toLowerCase()}.`
                : "Correct the highlighted fields to see your schedule."}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{contributionLabel}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 z-10 w-16 bg-background">
                        Year
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Contributions
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Interest
                      </TableHead>
                      <TableHead className="sticky top-0 z-10 bg-background text-right">
                        Balance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.schedule.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {row.year}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.contributions)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(row.interest)}
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
                        {formatCurrency(result.totalContributions)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(result.totalInterest)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(result.finalBalance)}
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
                  Fix the highlighted inputs and your growth schedule will
                  appear here.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {view === "chart" && (
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <ChartLineIcon className="size-5" />
            </span>
            <CardTitle>Growth over time</CardTitle>
            <CardDescription>
              {result
                ? `How your balance grows across ${yearsNum} ${yearNoun} — contributions versus interest.`
                : "Correct the highlighted fields to see your growth chart."}
            </CardDescription>
            <CardAction>
              <Badge variant="secondary">{contributionLabel}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {result ? (
              <ChartContainer config={chartConfig} className="h-[320px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `Year ${value}`}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={64}
                    domain={[0, "auto"]}
                    tickFormatter={(value) =>
                      compactCurrency.format(Number(value))
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `Year ${value}`}
                        formatter={(value) => formatCurrency(Number(value), 0)}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    dataKey="contributions"
                    type="monotone"
                    stroke="var(--color-contributions)"
                    fill="var(--color-contributions)"
                    fillOpacity={0.6}
                  />
                  <Area
                    dataKey="interest"
                    type="monotone"
                    stroke="var(--color-interest)"
                    fill="var(--color-interest)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <Alert>
                <TriangleAlertIcon />
                <AlertTitle>Chart paused</AlertTitle>
                <AlertDescription>
                  Fix the highlighted inputs and your growth chart will appear
                  here.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
