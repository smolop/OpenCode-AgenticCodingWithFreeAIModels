import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowRightIcon,
  CheckIcon,
  HouseIcon,
  PercentIcon,
  PiggyBankIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

const mortgageFeatures = [
  "Monthly, fortnightly and weekly repayment estimates",
  "Total interest paid and true cost of the loan over its term",
  "See how extra repayments shorten your loan and save interest",
  "Compare rates, terms and deposits side by side",
];

const compoundFeatures = [
  "Final balance, total contributions and interest earned",
  "Regular contributions with flexible compounding frequencies",
  "A clear breakdown of deposits versus growth",
  "Year-by-year projections for any time horizon",
];

const highlights = [
  {
    icon: ZapIcon,
    title: "Instant results",
    description:
      "Every calculation runs live in your browser — no loading, no accounts, no waiting.",
  },
  {
    icon: PercentIcon,
    title: "Transparent maths",
    description:
      "See the inputs behind every number, from interest rates to compounding periods.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by design",
    description:
      "Nothing you enter leaves your device. Free to use, as often as you like.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
          <Badge variant="secondary">
            <SparklesIcon />
            Free forever · No sign-up
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Simple financial calculators that give you instant answers
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Estimate your mortgage repayments or project how compound interest
            grows your savings — clear results, no spreadsheets, no sign-up.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/mortgage">
                Calculate mortgage repayments
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/compound-interest-calculator">
                Compound interest calculator
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-4 text-foreground" />
              Instant results
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-4 text-foreground" />
              Transparent calculations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-4 text-foreground" />
              Runs in your browser
            </span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Two calculators, zero guesswork
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Everything you need to plan a loan or grow a savings pot, with the
              assumptions laid out in plain language.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <HouseIcon className="size-5" />
                </span>
                <CardTitle>Mortgage repayments calculator</CardTitle>
                <CardDescription>
                  Work out what your home loan really costs, month by month.
                </CardDescription>
                <CardAction>
                  <Badge variant="outline">Mortgage</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {mortgageFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/mortgage">
                    Open mortgage calculator
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
                  <PiggyBankIcon className="size-5" />
                </span>
                <CardTitle>Compound interest calculator</CardTitle>
                <CardDescription>
                  See how your savings snowball with time and contributions.
                </CardDescription>
                <CardAction>
                  <Badge variant="outline">Savings</Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {compoundFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/compound-interest-calculator">
                    Open compound interest calculator
                    <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Why FinCalc
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Built for quick, confident decisions — not for collecting your
              data.
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <Card key={title} size="sm" className="h-full">
                <CardHeader>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4.5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <Card>
            <CardHeader className="items-center text-center">
              <CardTitle>Ready to run the numbers?</CardTitle>
              <CardDescription>
                Pick a calculator and get your answer in seconds.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/mortgage">
                  Mortgage repayments
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/compound-interest-calculator">
                  Compound interest
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
