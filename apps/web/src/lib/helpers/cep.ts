export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length !== 8) {
    return value;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
