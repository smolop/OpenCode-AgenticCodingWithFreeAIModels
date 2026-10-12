const currencyFormatters = new Map<number, Intl.NumberFormat>();

export function formatCurrency(value: number, fractionDigits = 2): string {
  let formatter = currencyFormatters.get(fractionDigits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    currencyFormatters.set(fractionDigits, formatter);
  }
  return formatter.format(value);
}
