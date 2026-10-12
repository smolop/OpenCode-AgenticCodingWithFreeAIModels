import { Separator } from "@/components/ui/separator";
import { CalculatorIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <>
      <Separator />
      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalculatorIcon className="size-3.5" />
          </span>
          <span className="font-medium text-foreground">FinCalc</span>
        </div>
        <p>Free mortgage and compound interest calculators.</p>
        <p>© 2026 FinCalc</p>
      </footer>
    </>
  );
}
