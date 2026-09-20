export function buildSupportProtocol(sequence: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const suffix = String(sequence).padStart(4, '0');
  return `ATD-${year}${month}${day}-${suffix}`;
}
