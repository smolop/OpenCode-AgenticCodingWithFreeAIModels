import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CompoundInterestCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "See how your savings grow with compound interest. Add a starting balance, regular contributions, an interest rate and a timeframe to project your final balance and total interest earned.",
};

export default function CompoundInterestCalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Compound interest calculator
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Enter your starting balance, contributions and interest rate to
              see how your money compounds — with a year-by-year breakdown of
              deposits versus growth.
            </p>
          </div>

          <div className="mt-8">
            <CompoundInterestCalculator />
          </div>

          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Figures are estimates for guidance only and do not constitute
            financial advice. Taxes, fees and inflation are not included.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
