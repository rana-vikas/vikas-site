export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}
