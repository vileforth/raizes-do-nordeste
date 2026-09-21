export function weightedDigit(digits: number[], weights: number[]): number {
  const total = digits.reduce((sum, digit, index) => sum + digit * weights[index], 0);
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function buildCpf(digits: number[]): string {
  const first = weightedDigit(digits, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = weightedDigit([...digits, first], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return `${digits.join('')}${first}${second}`;
}
