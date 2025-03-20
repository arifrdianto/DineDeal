export function formatThousandSeparator(
  num: number,
  locale: string = "id-ID"
): string {
  return num.toLocaleString(locale);
}
