import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MortgageCalculator } from "./calculator";

export const metadata: Metadata = {
  title: "Mortgage Repayment Calculator",
  description:
    "Work out your mortgage repayments in seconds. Adjust the property price, deposit, interest rate and term to see monthly, fortnightly or weekly repayments in euros.",
};

export default function MortgagePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Mortgage repayments calculator
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Enter your loan details and see what it really costs — your
              repayment, total interest and total paid, live as you type.
            </p>
          </div>

          <div className="mt-8">
            <MortgageCalculator />
          </div>

          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Figures are estimates for guidance only and do not constitute
            financial advice. Lender fees, taxes and insurance are not included.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
