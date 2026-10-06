import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center sm:px-6">
      <Badge variant="secondary">404 · Page not found</Badge>
      <span className="flex size-12 items-center justify-center rounded-xl bg-muted">
        <CompassIcon className="size-6" />
      </span>
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        This page doesn&apos;t exist
      </h1>
      <p className="max-w-md text-muted-foreground">
        The link may be out of date, or the page has moved. Head back to FinCalc
        to run your numbers.
      </p>
      <Button asChild size="lg">
        <Link href="/">
          <ArrowLeftIcon data-icon="inline-start" />
          Back to FinCalc
        </Link>
      </Button>
    </div>
  );
}
