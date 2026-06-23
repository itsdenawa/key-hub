export const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function formatMoney(cents: number) {
  return currencyFormatter.format(cents / 100);
}
