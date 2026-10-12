import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalculatorIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CalculatorIcon className="size-4" />
          </span>
          <span className="font-heading text-base font-medium">FinCalc</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/mortgage"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Mortgage repayments
          </Link>
          <Link
            href="/compound-interest-calculator"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Compound interest
          </Link>
        </nav>
        <Button asChild size="sm">
          <Link href="/mortgage">
            Get started
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
      <Separator />
    </header>
  );
}
